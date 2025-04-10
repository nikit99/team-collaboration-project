import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTaskStatus } from '../../api/taskApi';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaPen,
  FaArrowLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import Pagination from '../../Components/Pagination/Pagination';
import './Tasks.css';
import Select from 'react-select';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    workspaceId: 'all',
    projectName: 'all',
    searchTerm: '',
    sortKey: 'due_date',
    sortDirection: 'ascending',
  });
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const navigate = useNavigate();
  const { projectId } = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isAdminOrSuperAdmin =
    loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { tasks: initialTasks } = await getTasks({}, 1, 10);

        const uniqueWorkspaces = Array.from(
          new Set(initialTasks.map((task) => task.workspace_id))
        )
          .map((id) => {
            const task = initialTasks.find((t) => t.workspace_id === id);
            return { id, name: task.workspace_name };
          })
          .filter((ws) => ws.id && ws.name);

        const uniqueProjects = Array.from(
          new Set(initialTasks.map((task) => task.project_name))
        ).filter((name) => name);

        setWorkspaces(uniqueWorkspaces);
        setProjects(uniqueProjects);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const effectiveFilters = {
          ...filters,
          ...(projectId && projectId !== 'undefined' && projectId !== 'null'
            ? { projectId }
            : {}),
        };

        const { tasks, pagination: paginationData } = await getTasks(
          effectiveFilters,
          pagination.currentPage,
          pagination.pageSize
        );

        setTasks(tasks);
        setPagination({
          ...pagination,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters, projectId, pagination.currentPage]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSort = (key) => {
    const newDirection =
      filters.sortKey === key && filters.sortDirection === 'ascending'
        ? 'descending'
        : 'ascending';

    setFilters((prev) => ({
      ...prev,
      sortKey: key,
      sortDirection: newDirection,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const getSortIcon = (key) => {
    if (filters.sortKey !== key) return <FaSort />;
    return filters.sortDirection === 'ascending' ? (
      <FaSortUp />
    ) : (
      <FaSortDown />
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((task) => task.id !== id));
        // Refresh tasks to maintain pagination
        const { tasks: updatedTasks } = await getTasks(
          filters,
          pagination.currentPage,
          pagination.pageSize
        );
        setTasks(updatedTasks);
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
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: updatedStatus } : task
        )
      );
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update task status');
    }
  };

  const canModifyTask = (task) => {
    return (
      isAdminOrSuperAdmin ||
      task.owner === loggedInUser.id ||
      (task.members && task.members.includes(loggedInUser.id))
    );
  };

  const formatStatus = (status) => {
    const statusMap = {
      to_do: 'Todo',
      in_progress: 'In Progress',
      completed: 'Completed',
    };
    return statusMap[status] || status;
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'to_do', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const editStatusOptions = [
    { value: 'to_do', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="tasks-page-container">
      <div className="tasks-content">
        <div className="tasks-container">
          <div className="tasks-header">
            <h2 className="tasks-heading">
              {projectId ? 'Project Tasks' : 'My Tasks'}
            </h2>
            {projectId && projectId !== 'undefined' && projectId !== 'null' && (
              <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
            )}
          </div>

          <div className="filter-container">
            <div className="filter-group">
              <label>Filter by Status:</label>
              <Select
                options={statusOptions}
                value={statusOptions.find(
                  (option) => option.value === filters.status
                )}
                onChange={(selectedOption) =>
                  handleFilterChange('status', selectedOption.value)
                }
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
                    padding: '4px',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '0 8px',
                    height: '36px',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    fontSize: '14px',
                  }),
                  option: (base) => ({
                    ...base,
                    fontSize: '14px',
                    padding: '8px 12px',
                  }),
                }}
              />
            </div>

            <div className="filter-group">
              <label>Workspace:</label>
              <Select
                options={[
                  { value: 'all', label: 'All Workspaces' },
                  ...workspaces.map((workspace) => ({
                    value: workspace.id,
                    label: workspace.name,
                  })),
                ]}
                value={
                  filters.workspaceId === 'all'
                    ? { value: 'all', label: 'All Workspaces' }
                    : {
                        value: filters.workspaceId,
                        label:
                          workspaces.find((w) => w.id === filters.workspaceId)
                            ?.name || 'All Workspaces',
                      }
                }
                onChange={(selectedOption) =>
                  handleFilterChange('workspaceId', selectedOption.value)
                }
                className="react-select-container"
                classNamePrefix="react-select"
                isDisabled={!!projectId}
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
                    padding: '4px',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '0 8px',
                    height: '36px',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    fontSize: '14px',
                  }),
                  option: (base) => ({
                    ...base,
                    fontSize: '14px',
                    padding: '8px 12px',
                  }),
                }}
              />
            </div>

            <div className="filter-group">
              <label>Project:</label>
              <Select
                options={[
                  { value: 'all', label: 'All Projects' },
                  ...projects.map((project) => ({
                    value: project,
                    label: project,
                  })),
                ]}
                value={
                  filters.projectName === 'all'
                    ? { value: 'all', label: 'All Projects' }
                    : { value: filters.projectName, label: filters.projectName }
                }
                onChange={(selectedOption) =>
                  handleFilterChange('projectName', selectedOption.value)
                }
                className="react-select-container"
                classNamePrefix="react-select"
                isDisabled={!!projectId}
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
                    padding: '4px',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '0 8px',
                    height: '36px',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    fontSize: '14px',
                  }),
                  option: (base) => ({
                    ...base,
                    fontSize: '14px',
                    padding: '8px 12px',
                  }),
                }}
              />
            </div>

            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange('searchTerm', e.target.value)
                }
              />
            </div>

            {isAdminOrSuperAdmin && (
              <button
                className="add-task-btn"
                onClick={() => navigate('/taskForm')}
              >
                <FaPlus /> New
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <p className="loading-message">Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error">{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="no-tasks-message">
              <p>No tasks found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="tasks-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Project</th>
                      <th>Workspace</th>
                      <th>Start Date</th>
                      <th>
                        <div
                          className="sortable-header"
                          onClick={() => handleSort('due_date')}
                        >
                          Due Date
                          <span className="sort-icon">
                            {getSortIcon('due_date')}
                          </span>
                        </div>
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-container">
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.name}</td>
                        <td>{task.project_name}</td>
                        <td>{task.workspace_name}</td>
                        <td>{task.start_date || 'N/A'}</td>
                        <td>{task.due_date || 'N/A'}</td>
                        {/* <td>
                          {editingTaskId === task.id ? (
                            <select
                              value={updatedStatus}
                              onChange={handleStatusChange}
                              className="status-select"
                            >
                              <option value="to_do">Todo</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          ) : (
                            <span
                              className={`status-badge status-${task.status}`}
                            >
                              {formatStatus(task.status)}
                            </span>
                          )}
                        </td> */}
                        <td>
                          {editingTaskId === task.id ? (
                            <Select
                              options={editStatusOptions}
                              value={editStatusOptions.find(
                                (option) => option.value === updatedStatus
                              )}
                              onChange={(selectedOption) => {
                                setUpdatedStatus(selectedOption.value);
                              }}
                              className="task-status-select-container"
                              classNamePrefix="task-status-select"
                              isSearchable={false}
                              menuPortalTarget={document.body}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: '32px',
                                  height: '32px',
                                  width: '120px',
                                  fontSize: '14px',
                                  border: '1px solid #ced4da',
                                  boxShadow: 'none',
                                }),
                                valueContainer: (base) => ({
                                  ...base,
                                  padding: '0 8px',
                                  height: '30px',
                                }),
                                dropdownIndicator: (base) => ({
                                  ...base,
                                  padding: '4px',
                                }),
                                indicatorSeparator: (base) => ({
                                  ...base,
                                  margin: '4px 0',
                                  backgroundColor: '#ced4da',
                                }),
                                menu: (base) => ({
                                  ...base,
                                  zIndex: 1000,
                                }),
                              }}
                            />
                          ) : (
                            <span
                              className={`status-badge status-${task.status}`}
                            >
                              {formatStatus(task.status)}
                            </span>
                          )}
                        </td>
                        <td>
                          {canModifyTask(task) && (
                            <div className="action-buttons">
                              {editingTaskId === task.id ? (
                                <FaSave
                                  title="Save Status"
                                  className="save-icon action-button"
                                  onClick={() => handleSaveStatus(task.id)}
                                />
                              ) : (
                                <FaEdit
                                  title="Edit Status"
                                  className="edit-icon action-button"
                                  onClick={() =>
                                    handleEditStatus(task.id, task.status)
                                  }
                                />
                              )}
                              {isAdminOrSuperAdmin && (
                                <>
                                  <FaTrash
                                    title="Delete Task"
                                    className="delete-icon action-button"
                                    onClick={() => handleDelete(task.id)}
                                  />
                                  <FaPen
                                    title="Edit Task"
                                    className="edit-task-icon action-button"
                                    onClick={() =>
                                      navigate(`/edit-task/${task.id}`)
                                    }
                                  />
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
