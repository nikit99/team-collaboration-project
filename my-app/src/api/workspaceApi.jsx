import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/workspaces/';
const token = localStorage.getItem('authToken'); 
const headers = { Authorization: `Token ${token}` };

// Get all workspaces
export const getWorkspaces = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.get(BASE_URL, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }
};


export const createWorkspace = async (workspaceData) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.post(BASE_URL, workspaceData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating workspace:', error);
    return null;
  }
};


export const updateWorkspace = async (id, workspaceData) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.put(`${BASE_URL}${id}/`, workspaceData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating workspace:', error);
    return null;
  }
};


export const deleteWorkspace = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    await axios.delete(`${BASE_URL}${id}/`, { headers });
    return true;
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return false;
  }
};

export const getWorkspaceById = async (id) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.get(`${BASE_URL}${id}/`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching workspace:', error);
    throw error;
  }
};
