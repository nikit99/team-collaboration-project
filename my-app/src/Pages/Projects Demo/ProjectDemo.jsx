import React, { useEffect, useState } from 'react';
import {
  getProjects,
  deleteProject,
  updateProjectStatus,
} from '../../api/projectsApi';
import { getWorkspaces } from '../../api/workspaceApi';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaSave,
  FaPen,
  FaArrowLeft,
} from 'react-icons/fa';
import './ProjectDemo.css';
import SideBar from '../../Components/Sidebar/Sidebar';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const { workspaceId } = useParams(); // Get workspace ID from URL

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isAdminOrSuperAdmin =
    loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Workspace ID from URL:', workspaceId);
        const allProjects = await getProjects();
        const allWorkspaces = await getWorkspaces(); // Fetch workspaces

        const workspaceMap = {};
        allWorkspaces.forEach((ws) => {
          workspaceMap[ws.id] = ws.name;
        });
        setWorkspaces(workspaceMap);

        if (
          workspaceId &&
          workspaceId !== 'undefined' &&
          workspaceId !== 'null'
        ) {
          const workspaceProjects = allProjects.filter(
            (proj) => proj.workspace === Number(workspaceId)
          );
          setProjects(workspaceProjects);
        } else {
          setProjects(allProjects);
        }
      } catch (err) {
        setError(err.message || 'Error fetching projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const success = await deleteProject(id);
      if (success) {
        setProjects(projects.filter((project) => project.id !== id));
      }
    }
  };

  const handleEditStatus = (id, currentStatus) => {
    setEditingProjectId(id);
    setUpdatedStatus(currentStatus);
  };

  const handleStatusChange = (e) => {
    setUpdatedStatus(e.target.value);
  };

  const handleSaveStatus = async (id) => {
    try {
      await updateProjectStatus(id, updatedStatus);
      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, status: updatedStatus } : project
        )
      );
      setEditingProjectId(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update project status!');
    }
  };

  const filteredProjects =
    filterStatus === 'all'
      ? projects
      : projects.filter((project) => project.status === filterStatus);

  return (
    <>
      <SideBar />
      <div className="projects-container">
        <div className="projects-header">
        <h2 className="projects-heading">
    {workspaceId && workspaces[workspaceId] ? `${workspaces[workspaceId]} Projects` : "My Projects"}
  </h2>
          {workspaceId &&
            workspaceId !== 'undefined' &&
            workspaceId !== 'null' && (
              <FaArrowLeft
                className="back-icon"
                onClick={() => navigate('/workspaces')}
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
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <p className="loading-message">Loading projects...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Workspace Name</th>
                <th>Created By</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                {isAdminOrSuperAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{workspaces[project.workspace] || 'Unknown'}</td>
                  <td>{project.created_by}</td>
                  <td>{project.start_date}</td>
                  <td>{project.end_date}</td>
                  <td>
                    {editingProjectId === project.id ? (
                      <select
                        value={updatedStatus}
                        onChange={handleStatusChange}
                      >
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      project.status
                    )}
                  </td>
                  {isAdminOrSuperAdmin && (
                    <td>
                      {editingProjectId === project.id ? (
                        <FaSave
                          title="save"
                          className="save-icon"
                          onClick={() => handleSaveStatus(project.id)}
                        />
                      ) : (
                        <FaEdit
                          title="update status"
                          className="edit-icon"
                          onClick={() =>
                            handleEditStatus(project.id, project.status)
                          }
                        />
                      )}
                      <FaTrash
                        title="delete"
                        className="delete-icon"
                        onClick={() => handleDelete(project.id)}
                      />
                      <FaPen
                        title="edit project"
                        className="view-icon"
                        onClick={() => navigate(`/edit-project/${project.id}`)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isAdminOrSuperAdmin && (
          <button
            className="add-project-btn"
            onClick={() => navigate('/projectForm')}
          >
            <FaPlus /> Create Project
          </button>
        )}
      </div>
    </>
  );
};

export default Projects;
