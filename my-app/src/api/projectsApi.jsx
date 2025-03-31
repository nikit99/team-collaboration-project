import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/projects/';
// const BASE_URL = import.meta.env.PROJECTS_API_URL;
const token = localStorage.getItem('authToken'); 
const headers = { Authorization: `Token ${token}` };


export const getProjects = async () => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.get(BASE_URL, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const createProject = async (projectData) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.post(BASE_URL, projectData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.put(`${BASE_URL}${id}/`, projectData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
};

export const deleteProject = async (id) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    await axios.delete(`${BASE_URL}${id}/`, { headers });
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};


export const getProjectById = async (id) => {
  try {
    const token = localStorage.getItem('authToken'); 
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.get(`${BASE_URL}${id}/`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const removeProjectMember = async (projectId, userId) => {
  try {
    const token = localStorage.getItem('authToken'); // Fetch the latest token
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.delete(`${BASE_URL}${projectId}/remove-member/${userId}/`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error removing project member:', error);
    return null;
  }
};

export const updateProjectStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('authToken'); // Fetch the latest token
      const headers = { Authorization: `Token ${token}` };
  
      const response = await axios.patch(`${BASE_URL}${id}/update-status/`, { status }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error updating project status:', error);
      return null;
    }
  };