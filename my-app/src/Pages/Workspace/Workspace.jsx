import React, { useEffect, useState } from 'react';
import { getWorkspaces, deleteWorkspace } from '../../api/workspaceApi';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa'; // Import icons
import './Workspace.css';
import SideBar from '../../Components/Sidebar/Sidebar';

const Workspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isSuperAdmin = loggedInUser.role === 'superadmin' || loggedInUser.role === 'admin';
  const isUser = loggedInUser.role === 'user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workspaceData = await getWorkspaces();
        setWorkspaces(workspaceData);
      } catch (err) {
        setError(err.message || 'Error fetching workspaces.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      const success = await deleteWorkspace(id);
      if (success) {
        setWorkspaces(workspaces.filter((ws) => ws.id !== id));
      }
    }
  };

  return (
    <>
      {/* <SideBar /> */}
      <div className="workspace-container">
        <h2 className='workspace-heading'>My Workspaces</h2>

        {loading ? (
          <p className="loading-message">Loading workspaces...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="workspace-grid">
            {workspaces.map((ws) => {
              const isOwner = ws.owner === loggedInUser.name;
              return (
                <div 
                  key={ws.id} 
                  className="workspace-card" 
                  onClick={() => navigate(`/ProjectDemo/${ws.id}`)}
                >
                  <div className="workspace-content">
                    <h3>{ws.name}</h3>
                    <p>{ws.description}</p>
                    <p className="workspace-owner">Created by: {ws.owner}</p>
                  </div>
                  <div className="card-icons" onClick={(e) => e.stopPropagation()}>
                    {isOwner || isSuperAdmin ? (
                      <>
                        <FaEdit className="edit-icon" title="Edit" onClick={() => navigate(`/edit-workspace/${ws.id}`)} />
                        <FaTrash className="delete-icon" title="Delete" onClick={() => handleDelete(ws.id)} />
                      </>
                    ) : (
                      <FaEye className="view-icon" title="View" onClick={() => navigate(`/edit-workspace/${ws.id}`)} />
                    )}
                  </div>
                </div>
              );
            })}

            {!isUser && (
              <div className="workspace-card add-card" title="Add Workspace" onClick={() => navigate('/create-workspace')}>
                <FaPlus className="plus-sign" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Workspace;


// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { getWorkspaces, deleteWorkspace } from '../../api/workspaceApi';
// import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa'; // Import icons
// import './Workspace.css';
// import SideBar from '../../Components/Sidebar/Sidebar';

// const Workspace = () => {
//   const [workspaces, setWorkspaces] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
//   const isSuperAdmin = loggedInUser.role === 'superadmin';
//   const isUser = loggedInUser.role === 'user';
//   const showAll = location.pathname.includes('/all'); // Check if URL contains "/all"

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const workspaceData = await getWorkspaces();
//         if (isSuperAdmin && showAll) {
//           setWorkspaces(workspaceData); // Show all workspaces
//         } else {
//           setWorkspaces(workspaceData.filter((ws) => ws.owner === loggedInUser.name)); 
//         }
//       } catch (err) {
//         setError(err.message || 'Error fetching workspaces.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [showAll, isSuperAdmin, loggedInUser.name]);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this workspace?')) {
//       const success = await deleteWorkspace(id);
//       if (success) {
//         setWorkspaces(workspaces.filter((ws) => ws.id !== id));
//       }
//     }
//   };

//   return (
//     <>
//       <SideBar />
//       <div className="workspace-container">
//         <h2 className='workspace-heading'>My Workspaces</h2>

//         {loading ? (
//           <p className="loading-message">Loading workspaces...</p>
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <div className="workspace-grid">
//             {workspaces.map((ws) => {
//               const isOwner = ws.owner === loggedInUser.name;
//               return (
//                 <div 
//                   key={ws.id} 
//                   className="workspace-card" 
//                   onClick={() => navigate(`/ProjectDemo/${ws.id}`)}
//                 >
//                   <div className="workspace-content">
//                     <h3>{ws.name}</h3>
//                     <p>{ws.description}</p>
//                     <p className="workspace-owner">Created by: {ws.owner}</p>
//                   </div>
//                   <div className="card-icons" onClick={(e) => e.stopPropagation()}>
//                     {isOwner || isSuperAdmin ? (
//                       <>
//                         <FaEdit className="edit-icon" title="Edit" onClick={() => navigate(`/edit-workspace/${ws.id}`)} />
//                         <FaTrash className="delete-icon" title="Delete" onClick={() => handleDelete(ws.id)} />
//                       </>
//                     ) : (
//                       <FaEye className="view-icon" title="View" onClick={() => navigate(`/edit-workspace/${ws.id}`)} />
//                     )}
//                   </div>
//                 </div>
//               );
//             })}

//             {!isUser && (
//               <div className="workspace-card add-card" title="Add Workspace" onClick={() => navigate('/create-workspace')}>
//                 <FaPlus className="plus-sign" />
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Workspace;
