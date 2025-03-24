// import React, { useEffect, useState } from 'react';
// import { getWorkspaces, deleteWorkspace } from '../../api/workspaceApi';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './Workspace.css';
// import SideBar from '../../Components/Sidebar/Sidebar';

// const Workspace = () => {
//   const [workspaces, setWorkspaces] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // New loading state
//   const navigate = useNavigate();
// //   const location = useLocation();
  
// //   const userId = localStorage.getItem('authToken');
// //   console.log(userId)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const workspaceData = await getWorkspaces();
//         setWorkspaces(workspaceData);
//       } catch (err) {
//         setError(err.message || 'Error fetching workspaces.');
//       } finally {
//         setLoading(false); // Set loading to false after fetching data
//       }
//     };

//     fetchData();
//   }, []);//need to refresh for getting looged in user workspace. find solutioon.

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
//         <h2>My Workspaces</h2>
        
//         {loading ? (
//           <p className="loading-message">Loading workspaces...</p> // Show loading message
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <div className="workspace-grid">
//             {workspaces.map((ws) => (
//               <div key={ws.id} className="workspace-card">
//                 <h3>{ws.name}</h3>
//                 <p>{ws.description}</p>
//                 <div className="card-buttons">
//                   <button onClick={() => navigate(`/edit-workspace/${ws.id}`)}>Edit</button>
//                   <button onClick={() => handleDelete(ws.id)}>Delete</button>
//                 </div>
//               </div>
//             ))}

//             {/* Empty Card with "+" Sign */}
//             <div className="workspace-card add-card" onClick={() => navigate('/create-workspace')}>
//               <span className="plus-sign">+</span>
//             </div>
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
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Import icons
import './Workspace.css';
import SideBar from '../../Components/Sidebar/Sidebar';

const Workspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            {workspaces.map((ws) => (
              <div key={ws.id} className="workspace-card">
                <h3>{ws.name}</h3>
                <p>{ws.description}</p>
                <div className="card-icons">
                  <FaEdit className="edit-icon" onClick={() => navigate(`/edit-workspace/${ws.id}`)} />
                  <FaTrash className="delete-icon" onClick={() => handleDelete(ws.id)} />
                </div>
              </div>
            ))}

            <div className="workspace-card add-card" onClick={() => navigate('/create-workspace')}>
              <FaPlus className="plus-sign" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Workspace;
