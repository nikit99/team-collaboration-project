import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//console.log(API_BASE_URL);


export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Signup failed!';
  }
};

export const signin = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signin/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Signin failed!';
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reset-password-request/`,
      { email }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Reset password request failed!';
  }
};

export const resetPassword = async (userId, token, passwords) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reset-password/${userId}/${token}/`,
      passwords
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Password reset failed!';
  }
};
