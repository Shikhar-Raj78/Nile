import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/register`,
      userData,
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      toast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/login`,
      userData
    );
    if (response.statusText === "OK") {
      toast.success("Login Successful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const verifyEmail = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/verifyEmail`,
      userData
    );
    if (response.statusText === "OK") {
      toast.success("Email Verified. Signing in ...");
    }
    return response.data;
  } catch (error) {
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Logout User
export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/api/auth/logout`);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Forgot Password
export const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/forgotpassword`,
      userData
    );
    toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Reset Password
export const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/auth/resetpassword/${resetToken}`,
      userData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Get Login Status
export const getLoginStatus = async (userData, resetToken) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth/loggedin`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
