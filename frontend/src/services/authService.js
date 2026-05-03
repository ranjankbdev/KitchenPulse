import axiosInstance from '../config/axiosInstance.js';

// Signup
const registerUserAPI = async (user) => {
  const { data } = await axiosInstance.post('/auth/register', user);
  return data;
};

// Signin
const loginUserAPI = async (user) => {
  const { data } = await axiosInstance.post('/auth/login', user);
  return data;
};

// Send otp
const sendPasswordResetOtpAPI = async (payload) => {
  const { data } = await axiosInstance.post('/auth/password-reset/otp', payload);
  return data;
};

// Verify OTP
const verifyPasswordResetOtpAPI = async (payload) => {
  const { data } = await axiosInstance.post('/auth/password-reset/verify', payload);
  return data;
};

// Reset password
const resetUserPasswordAPI = async (payload) => {
  const { data } = await axiosInstance.post('/auth/password-reset', payload);
  return data;
};

const googleAuthAPI = async (user) => {
  const { data } = await axiosInstance.post('/auth/google-auth', user);
  return data;
};

const logoutUserAPI = async () => {
  await axiosInstance.post('/auth/logout');
};

export {
  registerUserAPI,
  loginUserAPI,
  sendPasswordResetOtpAPI,
  verifyPasswordResetOtpAPI,
  resetUserPasswordAPI,
  googleAuthAPI,
  logoutUserAPI,
};
