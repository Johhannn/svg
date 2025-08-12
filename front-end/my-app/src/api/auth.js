import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const login = async (username, password) => {
  const response = await axios.post(API_URL + 'token/', {
    username,
    password,
  });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const refreshToken = async (refresh) => {
  const response = await axios.post(API_URL + 'token/refresh/', {
    refresh,
  });
  return response.data;
};

export const requestPasswordReset = async (email) => {
  return await axios.post(API_URL + 'password-reset-otps/', { email });
};

export const verifyPasswordResetOTP = async (email, otp, new_password) => {
  return await axios.post(API_URL + 'password-reset-otps/verify/', {
    email,
    otp,
    new_password,
  });
};