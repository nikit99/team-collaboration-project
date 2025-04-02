// import React, { useEffect, useState } from 'react';
// import {
//   getTasks,
//   deleteTask,
//   updateTask,
//   updateTaskStatus,
// } from '../../api/taskApi';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaSave,
//   FaPen,
//   FaArrowLeft,
//   FaSort,
//   FaSortUp,
//   FaSortDown
// } from 'react-icons/fa';
// import SideBar from '../../Components/Sidebar/Sidebar';
// import './Tasks.css';

// const Tasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [updatedStatus, setUpdatedStatus] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filterWorkspace, setFilterWorkspace] = useState('all');
//   const [filterProject, setFilterProject] = useState('all');
//   const [sortConfig, setSortConfig] = useState({
//     key: 'due_date',
//     direction: 'ascending'
//   });
//   const navigate = useNavigate();
//   const { projectId } = useParams();

//   const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
//   const userId = loggedInUser.id;
//   const isAdminOrSuperAdmin =
//     loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         setLoading(true);
//         const allTasks = await getTasks();

//         let filteredTasks = allTasks;
//         if (projectId && projectId !== 'undefined' && projectId !== 'null') {
//           filteredTasks = allTasks.filter((task) => task.project == projectId);
//         } else {
//           filteredTasks = allTasks.filter(
//             (task) =>
//               task.owner === userId ||
//               task.members.includes(userId) ||
//               isAdminOrSuperAdmin
//           );
//         }

//         setTasks(filteredTasks);
//       } catch (err) {
//         setError(err.message || 'Error fetching tasks');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [projectId, userId, isAdminOrSuperAdmin]);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       try {
//         await deleteTask(id);
//         setTasks(tasks.filter((task) => task.id !== id));
//       } catch (err) {
//         setError('Failed to delete task');
//       }
//     }
//   };

//   const handleEditStatus = (id, currentStatus) => {
//     setEditingTaskId(id);
//     setUpdatedStatus(currentStatus);
//   };

//   const handleStatusChange = (e) => {
//     setUpdatedStatus(e.target.value);
//   };

//   const handleSaveStatus = async (id) => {
//     try {
//       await updateTaskStatus(id, updatedStatus);
//       setTasks(
//         tasks.map((task) =>
//           task.id === id ? { ...task, status: updatedStatus } : task
//         )
//       );
//       setEditingTaskId(null);
//     } catch (error) {
//       console.error('Error updating status:', error);
//       setError('Failed to update task status');
//     }
//   };

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return <FaSort />;
//     return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
//   };

//   const sortedTasks = [...tasks].sort((a, b) => {
//     if (sortConfig.key === 'due_date') {
//       const dateA = new Date(a.due_date);
//       const dateB = new Date(b.due_date);
//       if (sortConfig.direction === 'ascending') {
//         return dateA - dateB;
//       }
//       return dateB - dateA;
//     }
//     return 0;
//   });

//   const filteredTasks = sortedTasks.filter(
//     (task) =>
//       (filterStatus === 'all' || task.status === filterStatus) &&
//       (filterWorkspace === 'all' || task.workspace_name === filterWorkspace) &&
//       (filterProject === 'all' || task.project_name === filterProject) &&
//       task.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const canModifyTask = (task) => {
//     return (
//       isAdminOrSuperAdmin ||
//       task.owner === userId ||
//       task.members.includes(userId)
//     );
//   };

//   const formatStatus = (status) => {
//     const statusMap = {
//       'to_do': 'Todo',
//       'in_progress': 'In Progress',
//       'completed': 'Completed'
//     };
//     return statusMap[status] || status;
//   };

//   return (
//     <>
//       <div className="tasks-container">
//         <div className="tasks-header">
//           <h2 className="tasks-heading">
//             {projectId ? 'Project Tasks' : 'My Tasks'}
//           </h2>
//           {projectId && projectId !== 'undefined' && projectId !== 'null' && (
//             <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
//           )}
//         </div>

//         <div className="filter-container">
//           <label>Filter by Status:</label>
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="all">All</option>
//             <option value="to_do">Todo</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//           </select>

//           <label>Workspace:</label>
//           <select
//             value={filterWorkspace}
//             onChange={(e) => setFilterWorkspace(e.target.value)}
//           >
//             <option value="all">All</option>
//             {[...new Set(tasks.map((task) => task.workspace_name))].map((workspace) => (
//               <option key={workspace} value={workspace}>{workspace}</option>
//             ))}
//           </select>

//           <label>Project:</label>
//           <select
//             value={filterProject}
//             onChange={(e) => setFilterProject(e.target.value)}
//           >
//             <option value="all">All</option>
//             {[...new Set(tasks.map((task) => task.project_name))].map((project) => (
//               <option key={project} value={project}>{project}</option>
//             ))}
//           </select>
          
//           <label>Search:</label>
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Enter Task Name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           {isAdminOrSuperAdmin && (
//             <button
//               className="add-task-btn"
//               onClick={() => navigate('/taskForm')}
//             >
//               <FaPlus /> New
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <p className="loading-message">Loading tasks...</p>
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <div className="table-container">
//             <table className="tasks-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Project</th>
//                   <th>Workspace</th>
//                   <th>Start Date</th>
//                   <th>
//                     <div className="sortable-header" onClick={() => requestSort('due_date')}>
//                       Due Date
//                       <span className="sort-icon">
//                         {getSortIcon('due_date')}
//                       </span>
//                     </div>
//                   </th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//             </table>
//             <div className="table-body-container">
//               <table className="tasks-table">
//                 <tbody>
//                   {filteredTasks.map((task) => (
//                     <tr key={task.id}>
//                       <td>{task.name}</td>
//                       <td>{task.project_name}</td>
//                       <td>{task.workspace_name}</td>
//                       <td>{task.start_date}</td>
//                       <td>{task.due_date}</td>
//                       <td>
//                         {editingTaskId === task.id ? (
//                           <select
//                             value={updatedStatus}
//                             onChange={handleStatusChange}
//                           >
//                             <option value="to_do">Todo</option>
//                             <option value="in_progress">In Progress</option>
//                             <option value="completed">Completed</option>
//                           </select>
//                         ) : (
//                             <span className={`status-badge status-${task.status}`}>
//                               {formatStatus(task.status)}
//                             </span>
//                         )}
//                       </td>
//                       <td>
//                         {canModifyTask(task) && (
//                           <>
//                             {editingTaskId === task.id ? (
//                               <FaSave
//                                 title="Save Status"
//                                 className="save-icon action-button"
//                                 onClick={() => handleSaveStatus(task.id)}
//                               />
//                             ) : (
//                               <FaEdit
//                                 title="Edit Status"
//                                 className="edit-icon action-button"
//                                 onClick={() => handleEditStatus(task.id, task.status)}
//                               />
//                             )}
//                             {isAdminOrSuperAdmin &&
//                             <>
//                             <FaTrash
//                               title="Delete Task"
//                               className="delete-icon action-button"
//                               onClick={() => handleDelete(task.id)}
//                             />
//                             <FaPen
//                               title="Edit Task"
//                               className="view-icon action-button"
//                               onClick={() => navigate(`/edit-task/${task.id}`)}
//                             />
//                             </>
//                             }
                           
                            
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Tasks;

import React, { useEffect, useState } from 'react';
import {
  getTasks,
  deleteTask,
  updateTaskStatus,
} from '../../api/taskApi';
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
  FaSortDown
} from 'react-icons/fa';
import SideBar from '../../Components/Sidebar/Sidebar';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWorkspaceId, setFilterWorkspaceId] = useState('all');
  const [filterProjectName, setFilterProjectName] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'due_date',
    direction: 'ascending'
  });
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  
  const navigate = useNavigate();
  const { projectId } = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const userId = loggedInUser.id;
  const isAdminOrSuperAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        const filters = {
          projectId: projectId && projectId !== 'undefined' && projectId !== 'null' ? projectId : undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          workspaceId: filterWorkspaceId !== 'all' ? filterWorkspaceId : undefined,
          projectName: filterProjectName !== 'all' ? filterProjectName : undefined,
          searchTerm: searchTerm || undefined,
          sortKey: sortConfig.key,
          sortDirection: sortConfig.direction
        };
  
        const tasksData = await getTasks(filters);
        setTasks(tasksData);
        
        // Extract unique workspaces and projects for dropdowns
        const workspaces = Array.from(
          new Set(
            tasksData
              .map(task => ({ id: task.workspace_id, name: task.workspace_name }))
              .filter(ws => ws.id && ws.name)
          )
        );
        
        const projects = Array.from(
          new Set(
            tasksData
              .map(task => ({ name: task.project_name, workspaceId: task.workspace_id }))
              .filter(proj => proj.name)
          )
        );
  
        setAvailableWorkspaces(workspaces);
        setAvailableProjects(projects);
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [projectId, filterStatus, filterWorkspaceId, filterProjectName, searchTerm, sortConfig]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((task) => task.id !== id));
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

  const canModifyTask = (task) => {
    return (
      isAdminOrSuperAdmin ||
      task.owner === userId ||
      task.members.includes(userId)
    );
  };

  const formatStatus = (status) => {
    const statusMap = {
      'to_do': 'Todo',
      'in_progress': 'In Progress',
      'completed': 'Completed'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="tasks-page-container">
      <SideBar />
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
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="to_do">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Workspace:</label>
              <select
                value={filterWorkspaceId}
                onChange={(e) => setFilterWorkspaceId(e.target.value)}
              >
                <option value="all">All</option>
                {availableWorkspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Project:</label>
              <select
                value={filterProjectName}
                onChange={(e) => setFilterProjectName(e.target.value)}
              >
                <option value="all">All</option>
                {availableProjects.map((project, index) => (
                  <option key={index} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Enter Task Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isAdminOrSuperAdmin && (
              <button
                className="add-task-btn"
                onClick={() => navigate('/taskForm')}
              >
                <FaPlus /> New Task
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
                        onClick={() => requestSort('due_date')}
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
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.project_name}</td>
                      <td>{task.workspace_name}</td>
                      <td>{task.start_date || 'N/A'}</td>
                      <td>{task.due_date || 'N/A'}</td>
                      <td>
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
                          <span className={`status-badge status-${task.status}`}>
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
                                onClick={() => handleEditStatus(task.id, task.status)}
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
                                  onClick={() => navigate(`/edit-task/${task.id}`)}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;