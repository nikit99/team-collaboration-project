import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/workspaces/';
const token = localStorage.getItem('authToken'); 
const headers = { Authorization: `Token ${token}` };

export const getWorkspaces = async (page = 1, pageSize = 10) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };
    const params = new URLSearchParams();
    
    params.append('page', page);
    if (pageSize) params.append('page_size', pageSize);

    const response = await axios.get(BASE_URL, { headers, params });
    
    return {
      workspaces: response.data.results,
      pagination: {
        total: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        currentPage: response.data.current_page || page,
        totalPages: response.data.total_pages || Math.ceil(response.data.count / pageSize),
        pageSize: pageSize
      }
    };
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
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
    throw error;
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
