import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/auth";

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Signup failed!";
  }
};

export const signin = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signin/`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Signin failed!";
    }
  };

  export const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/reset-password-request/", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Reset password request failed!";
    }
  };
  
  export const resetPassword = async (userId, token, passwords) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/auth/reset-password/${userId}/${token}/`, passwords);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Password reset failed!";
    }
  };
  
