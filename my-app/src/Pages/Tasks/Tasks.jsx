import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask, updateTaskStatus } from '../../api/taskApi';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSave, FaPen, FaArrowLeft } from 'react-icons/fa';
import SideBar from '../../Components/Sidebar/Sidebar';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const { projectId } = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const userId = loggedInUser.id;
  const isAdminOrSuperAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const allTasks = await getTasks();
        
        // Filter tasks based on projectId if present
        let filteredTasks = allTasks;
        if (projectId && projectId !== 'undefined' && projectId !== 'null') {
          filteredTasks = allTasks.filter(task => task.project == projectId);
        } else {
          // For /tasks route, show only tasks where user is owner or member
          filteredTasks = allTasks.filter(task => 
            task.owner === userId || 
            task.members.includes(userId) ||
            isAdminOrSuperAdmin
          );
        }
        
        setTasks(filteredTasks);
      } catch (err) {
        setError(err.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, userId, isAdminOrSuperAdmin]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleEditStatus = (id, currentStatus) => {
    setEditingTaskId(id);
    setUpdatedStatus(currentStatus);
  };

  const handleStatusChange = (e) => {
    setUpdatedStatus(e.target.value);
  };

  const handleSaveStatus = async (id) => {
    try {
      await updateTaskStatus(id, updatedStatus);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status: updatedStatus } : task
      ));
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update task status');
    }
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  // Check if user can edit/delete a task
  const canModifyTask = (task) => {
    return isAdminOrSuperAdmin || task.owner === userId || task.members.includes(userId);
  };

  return (
    <>
      <SideBar />
      <div className="tasks-container">
        <div className="tasks-header">
          <h2 className="tasks-heading">
            {projectId ? 'Project Tasks' : 'My Tasks'}
          </h2>
          {projectId && projectId !== 'undefined' && projectId !== 'null' && (
            <FaArrowLeft
              className="back-icon"
              onClick={() => navigate(-1)}
            />
          )}
        </div>

        <div className="filter-container">
          <label>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {isAdminOrSuperAdmin && (
            <button
              className="add-task-btn"
              onClick={() => navigate('/taskForm')}
            >
              <FaPlus /> Create Task
            </button>
          )}
        </div>

        {loading ? (
          <p className="loading-message">Loading tasks...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="table-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Project</th>
                  <th>Workspace</th>
                  <th>Start Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>
            <div className="table-body-container">
              <table className="tasks-table">
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.project_name}</td>
                      <td>{task.workspace_name}</td>
                      <td>{task.start_date}</td>
                      <td>{task.due_date}</td>
                      <td>
                        {editingTaskId === task.id ? (
                          <select value={updatedStatus} onChange={handleStatusChange}>
                            <option value="to_do">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        ) : (
                          task.status.replace('_', ' ')
                        )}
                      </td>
                      <td>
                        {canModifyTask(task) && (
                          <>
                            {editingTaskId === task.id ? (
                              <FaSave
                                title="save"
                                className="save-icon"
                                onClick={() => handleSaveStatus(task.id)}
                              />
                            ) : (
                              <FaEdit
                                title="update status"
                                className="edit-icon"
                                onClick={() => handleEditStatus(task.id, task.status)}
                              />
                            )}
                            <FaTrash
                              title="delete"
                              className="delete-icon"
                              onClick={() => handleDelete(task.id)}
                            />
                            <FaPen
                              title="edit task"
                              className="view-icon"
                              onClick={() => navigate(`/edit-task/${task.id}`)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;

