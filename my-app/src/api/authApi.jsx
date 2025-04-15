import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_AUTH_URL;

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


export const getUsers = async (filters = {}, page = 1, pageSize = 10, noPagination = false) => {
  try {
    const params = new URLSearchParams();
    
    
    if (filters.role && filters.role !== 'all') {
      params.append('role', filters.role);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.ordering) {
      params.append('ordering', filters.ordering);
    }
    
    if (noPagination) {
      params.append('no_page', 'true');
    } else {
      params.append('page', page);
      params.append('page_size', pageSize);
    }

    const response = await axios.get(`${API_BASE_URL}/users/`, { params });
    
    if (noPagination) {
      return {
        users: response.data,  
        pagination: null
      };
    }
    
    return {
      users: response.data.results,
      pagination: {
        total: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        currentPage: page,
        totalPages: Math.ceil(response.data.count / pageSize),
        pageSize: pageSize
      }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data || error.message;
  }
};



export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
    return null; 
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.delete(`${API_BASE_URL}/users/${userId}/delete/`, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to delete user!';
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}/update-role/`,
      { role: newRole }, // Sending updated role
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to update user role!';
  }
};

