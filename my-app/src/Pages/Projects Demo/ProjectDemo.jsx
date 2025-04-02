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
  FaSort,
  FaSortUp,
  FaSortDown
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWorkspace, setFilterWorkspace] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'end_date',
    direction: 'ascending'
  });
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isAdminOrSuperAdmin =
    loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProjects = await getProjects();
        const allWorkspaces = await getWorkspaces();

        const workspaceMap = {};
        allWorkspaces.forEach((ws) => {
          workspaceMap[ws.id] = ws.name;
        });
        setWorkspaces(workspaceMap);

        if (workspaceId && workspaceId !== 'undefined' && workspaceId !== 'null') {
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

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortConfig.key === 'end_date') {
      const dateA = new Date(a.end_date);
      const dateB = new Date(b.end_date);
      if (sortConfig.direction === 'ascending') {
        return dateA - dateB;
      }
      return dateB - dateA;
    }
    return 0;
  });

  const filteredProjects = sortedProjects
    .filter((project) =>
      filterStatus === 'all' ? true : project.status === filterStatus
    )
    .filter((project) =>
      filterWorkspace === 'all' 
        ? true 
        : project.workspace === Number(filterWorkspace)
    )
    .filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatStatus = (status) => {
    const statusMap = {
      'completed': 'Completed',
      'in_progress': 'In Progress',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <div className="projects-container">
        <div className="projects-header">
          <h2 className="projects-heading">
            {workspaceId && workspaces[workspaceId]
              ? `${workspaces[workspaceId]} Projects`
              : 'My Projects'}
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

          <label>Workspace:</label>
          <select
            value={filterWorkspace}
            onChange={(e) => setFilterWorkspace(e.target.value)}
          >
            <option value="all">All</option>
            {Object.entries(workspaces).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          <label>Search:</label>
          <input
            type="text"
            className="search-input"
            placeholder="Enter Project Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {isAdminOrSuperAdmin && (
            <button
              className="add-project-btn"
              onClick={() => navigate('/projectForm')}
            >
              <FaPlus /> New
            </button>
          )}
        </div>

        {loading ? (
          <p className="loading-message">Loading projects...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Workspace Name</th>
                  <th>Created By</th>
                  <th>Start Date</th>
                  <th>
                    <div 
                      className="sortable-header" 
                      onClick={() => requestSort('end_date')}
                    >
                      End Date
                      <span className="sort-icon">
                        {getSortIcon('end_date')}
                      </span>
                    </div>
                  </th>
                  <th>Status</th>
                  {isAdminOrSuperAdmin && <th>Actions</th>}
                </tr>
              </thead>
            </table>
            <div className="table-body-container">
              <table className="projects-table">
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="clickable-row"
                      onClick={(e) => {
                        if (!e.target.closest('.action-button')) {
                          navigate(`/tasks/${project.id}`);
                        }
                      }}
                    >
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
                            className="action-button"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="completed">Completed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`status-badge status-${project.status}`}>
                            {formatStatus(project.status)}
                          </span>
                        )}
                      </td>
                      {isAdminOrSuperAdmin && (
                        <td>
                          {editingProjectId === project.id ? (
                            <FaSave
                              title="save"
                              className="save-icon action-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveStatus(project.id);
                              }}
                            />
                          ) : (
                            <FaEdit
                              title="update status"
                              className="edit-icon action-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStatus(project.id, project.status);
                              }}
                            />
                          )}
                          <FaTrash
                            title="delete"
                            className="delete-icon action-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id);
                            }}
                          />
                          <FaPen
                            title="edit project"
                            className="view-icon action-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-project/${project.id}`);
                            }}
                          />
                        </td>
                      )}
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

export default Projects;