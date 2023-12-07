const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const OTP = require("../models/otpModel");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");

function validatePassword(password) {
  const regex = {
    digit: /\d/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  return (
    regex.digit.test(password) &&
    regex.uppercase.test(password) &&
    regex.lowercase.test(password) &&
    regex.specialChar.test(password)
  );
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    console.log(username)
    console.log(email)
    console.log(password)
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be atleast 8 characters");
  }
  if (!validatePassword(password)) {
    res.status(400);
    throw new Error(
      "Password must contain atleast one digit, atleast one uppercase character, atleast one lowercase character, atleast one special character"
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  let isActive = false;
  const user = await User.create({
    username,
    email,
    password,
    isActive,
  });

  if (user) {
    const { _id, username, email, isActive } = user;
    const response = await fetch("http://localhost:5000/api/otp/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to send OTP: ${response.statusText}`);
    }

    const otpApiResponse = await response.json();
    res.status(201).json({
      _id,
      username,
      email,
      isActive,
      otpApiResponse,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found. Please signup.");
  }
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (user && passwordIsCorrect) {
    if (!user.isActive) {
      const { _id, name, email, isActive } = user;
      const response = await fetch("http://localhost:5000/api/otp/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to send OTP: ${response.statusText}`);
      }
      const otpApiResponse = await response.json();
      res.status(200).json({
        _id,
        name,
        email,
        isActive,
        otpApiResponse,
      });
    } else {
      const token = generateToken(user._id);

      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });
      const { _id, name, email, isActive } = user;
      res.status(200).json({
        _id,
        name,
        email,
        isActive,
      });
    }
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  if (response.length === 0 || otp !== response[0].otp) {
    return res.status(400).json({
      success: false,
      message: "The OTP is not valid",
    });
  } else {
    const user = await User.findOne({ email });
    user.isActive = true;
    await user.save();
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ message: "Email has been verified." });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "Successfully Logged Out",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
  }).save();

  // Construct reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use this url below to reset your password.</p>
    <p>this reset link is valid only for 30 minutes.</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a> 
    <p>Regards</p>
    <p>InvTrack team</p>
  `;
  const subject = "Noreply - Password Reset Request";
  const send_to = user.email;
  const reply_to = "noreply";
  try {
    await mailSender(reply_to, send_to, subject, message);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({ message: "Password reset successful, please login" });
});
module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  getUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  loginStatus
};
