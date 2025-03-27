// import React, { useEffect, useState } from 'react';
// import { getWorkspaces, deleteWorkspace } from '../../api/workspaceApi';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa'; // Import icons
// import './Workspace.css';
// import SideBar from '../../Components/Sidebar/Sidebar';

// const Workspace = () => {
//   const [workspaces, setWorkspaces] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();


//   const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
// //   console.log(loggedInUser);
//   const isSuperAdmin = loggedInUser.role === 'superadmin';
//   const isUser = loggedInUser.role === 'user';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const workspaceData = await getWorkspaces();
//         setWorkspaces(workspaceData);
//       } catch (err) {
//         setError(err.message || 'Error fetching workspaces.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

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
//                 <div key={ws.id} className="workspace-card">
//                   <h3>{ws.name}</h3>
//                   <p>{ws.description}</p>
//                   <p className="workspace-owner">Created by: {ws.owner}</p>
//                   <div className="card-icons">
//                     {isOwner || isSuperAdmin ? (
//                       <>
//                         <FaEdit className="edit-icon" onClick={() => navigate(`/edit-workspace/${ws.id}`)} />
//                         <FaTrash className="delete-icon" onClick={() => handleDelete(ws.id)} />
//                       </>
//                     ) : (
//                       <FaEye className="view-icon" onClick={() => navigate(`/edit-workspace/${ws.id}`)} />
//                     )}
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Show '+' only if the user is not a normal user */}
//             {!isUser && (
//               <div className="workspace-card add-card" onClick={() => navigate('/create-workspace')}>
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
  const isSuperAdmin = loggedInUser.role === 'superadmin';
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
      <SideBar />
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
