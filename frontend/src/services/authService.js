import axiosInstance from '../config/axiosInstance.js';

// Signup
const registerUserAPI = async (user) => {
  const { data } = await axiosInstance.post('/auth/register', user, { withCredentials: true });
  return data;
};

// Signin
const loginUserAPI = async (user) => {
  const { data } = await axiosInstance.post('/auth/login', user, { withCredentials: true });
  return data;
};

// Send otp
const sendPasswordResetOtpAPI = async (payload) => {
  const { data } = await axiosInstance.post('/auth/password-reset/otp', payload, {
    withCredentials: true,
  });
  return data;
};

// Verify OTP
const verifyPasswordResetOtpAPI = async (payload) => {
  const { data } = await axiosInstance.post('/auth/password-reset/verify', payload, {
    withCredentials: true,
  });
  return data;
};

// Reset password
const resetUserPasswordAPI = async (payload) => {
  const { data } = await axiosInstance.post('/auth/password-reset', payload, {
    withCredentials: true,
  });
  return data;
};

const googleAuthAPI = async (user) => {
  const { data } = await axiosInstance.post('/auth/google-auth', user, {
    withCredentials: true,
  });
  return data;
};

const logoutUserAPI = async () => {
  await axiosInstance.post('/auth/logout', { withCredentials: true });
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
