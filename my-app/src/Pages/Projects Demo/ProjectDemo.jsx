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
  FaSortDown,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import './ProjectDemo.css';
import Pagination from '../../Components/Pagination/Pagination';
import Select from 'react-select';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    workspace: 'all',
    search: '',
    ordering: '-end_date' 
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
  });

  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isAdminOrSuperAdmin =
    loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If workspaceId is provided in URL, override the workspace filter
        const effectiveFilters = {
          ...filters,
          ...(workspaceId && workspaceId !== 'undefined' && workspaceId !== 'null' 
            ? { workspace: workspaceId } 
            : {})
        };

        const [projectsData, workspacesData] = await Promise.all([
          getProjects(effectiveFilters, pagination.currentPage, pagination.pageSize),
          getWorkspaces(1, 1000) // Fetch all workspaces with a large page size
        ]);

        const workspaceMap = {};
        workspacesData.workspaces.forEach((ws) => {
          workspaceMap[ws.id] = ws.name;
        });
        setWorkspaces(workspaceMap);
        setProjects(projectsData.projects);
        setPagination(projectsData.pagination);
      } catch (err) {
        setError(err.message || 'Error fetching projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, workspaceId, pagination.currentPage]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSort = (key) => {
    const newOrdering = filters.ordering === key ? `-${key}` : key;
    handleFilterChange('ordering', newOrdering);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const getSortIcon = (key) => {
    if (!filters.ordering.includes(key)) return <FaSort />;
    return filters.ordering.startsWith('-') ? <FaSortDown /> : <FaSortUp />;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        // Refresh projects to maintain pagination
        const { projects: updatedProjects } = await getProjects(
          filters, 
          pagination.currentPage, 
          pagination.pageSize
        );
        setProjects(updatedProjects);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project!');
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

  const formatStatus = (status) => {
    const statusMap = {
      'completed': 'Completed',
      'in_progress': 'In Progress',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="projects-page">
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

        {/* <div className="filter-container">
          <label>Filter by Status:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <label>Workspace:</label>
          <select
            value={filters.workspace}
            onChange={(e) => handleFilterChange('workspace', e.target.value)}
            disabled={!!workspaceId} // Disable if workspaceId is in URL
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
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          {isAdminOrSuperAdmin && (
            <button
              className="add-project-btn"
              onClick={() => navigate('/projectForm')}
            >
              <FaPlus /> New
            </button>
          )}
        </div> */}
        <div className="filter-container">
  <label>Filter by Status:</label>
  <Select
    options={statusOptions}
    value={statusOptions.find(option => option.value === filters.status)}
    onChange={(selectedOption) => handleFilterChange('status', selectedOption.value)}
    className="react-select-container"
    classNamePrefix="react-select"
    isSearchable={false}
    styles={{
      control: (base) => ({
        ...base,
        minHeight: '38px',
        height: '38px',
        width: '150px',
        fontSize: '14px',
        border: '1px solid #ced4da',
        boxShadow: 'none',
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: '4px'
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
        height: '36px'
      }),
      singleValue: (base) => ({
        ...base,
        fontSize: '14px'
      }),
      option: (base) => ({
        ...base,
        fontSize: '14px',
        padding: '8px 12px'
      })
    }}
  />

  <label>Workspace:</label>
  <Select
    options={[
      { value: 'all', label: 'All' },
      ...Object.entries(workspaces).map(([id, name]) => ({
        value: id,
        label: name
      }))
    ]}
    value={
      filters.workspace === 'all' 
        ? { value: 'all', label: 'All' }
        : { value: filters.workspace, label: workspaces[filters.workspace] || 'All' }
    }
    onChange={(selectedOption) => handleFilterChange('workspace', selectedOption.value)}
    className="react-select-container"
    classNamePrefix="react-select"
    isDisabled={!!workspaceId}
    styles={{
      control: (base) => ({
        ...base,
        minHeight: '38px',
        height: '38px',
        width: '150px',
        fontSize: '14px',
        border: '1px solid #ced4da',
        boxShadow: 'none',
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: '4px'
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
        height: '36px'
      }),
      singleValue: (base) => ({
        ...base,
        fontSize: '14px'
      }),
      option: (base) => ({
        ...base,
        fontSize: '14px',
        padding: '8px 12px'
      })
    }}
  />

  <label>Search:</label>
  <input
    type="text"
    className="search-input"
    placeholder="Enter Project Name"
    value={filters.search}
    onChange={(e) => handleFilterChange('search', e.target.value)}
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
        ) : projects.length === 0 ? (
          <p className="no-results">No projects found matching your criteria</p>
        ) : (
          <>
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
                        onClick={() => handleSort('end_date')}
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
                    {projects.map((project) => (
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

           <Pagination
             currentPage={pagination.currentPage}
             totalPages={pagination.totalPages}
             onPageChange={handlePageChange}
           />
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;