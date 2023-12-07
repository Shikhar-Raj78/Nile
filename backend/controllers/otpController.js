const otpGenerator = require('otp-generator');
const asyncHandler = require('express-async-handler')
const OTP = require('../models/otpModel');

const sendOTP = asyncHandler(async (req, res) => {
  
  try {
    const { email } = req.body;
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
    console.log('OTP sent successfully')
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports ={
  sendOTP
}