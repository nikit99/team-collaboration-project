import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/tasks/';
// const BASE_URL = import.meta.env.TASKS_API_URL;
const token = localStorage.getItem('authToken');
const headers = { Authorization: `Token ${token}` };

// export const getTasks = async () => {
//   try {
//     const token = localStorage.getItem('authToken');
//     const headers = { Authorization: `Token ${token}` };

//     const response = await axios.get(BASE_URL, { headers });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     return [];
//   }
// };
// api/taskApi.js
export const getTasks = async (filters = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Token ${token}` };
      
      // Convert filters object to URL params
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.projectId) params.append('project', filters.projectId);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.workspace && filters.workspace !== 'all') {
        params.append('project__workspace', filters.workspace);
      }
      if (filters.projectName && filters.projectName !== 'all') {
        params.append('project__name', filters.projectName);
      }
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      
      // Add sorting
      if (filters.sortKey) {
        const direction = filters.sortDirection === 'descending' ? '-' : '';
        params.append('ordering', `${direction}${filters.sortKey}`);
      }
  
      const response = await axios.get(BASE_URL, { headers, params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error; // Re-throw to handle in component
    }
  };

export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.post(BASE_URL, taskData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.put(`${BASE_URL}${id}/`, taskData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

export const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    await axios.delete(`${BASE_URL}${id}/`, { headers });
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

export const getTaskById = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.get(`${BASE_URL}${id}/`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.patch(`${BASE_URL}${id}/change_status/`, { status }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    return null;
  }
};

export const addTaskMember = async (taskId, userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.post(`${BASE_URL}${taskId}/add-member/`, { user_id: userId }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error adding task member:', error);
    return null;
  }
};

export const removeTaskMember = async (taskId, userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.delete(`${BASE_URL}${taskId}/remove-member/${userId}/`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error removing task member:', error);
    return null;
  }
};
