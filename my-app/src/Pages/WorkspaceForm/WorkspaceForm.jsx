// import React, { useEffect, useState } from 'react';
// import {
//   createWorkspace,
//   updateWorkspace,
//   getWorkspaceById,
// } from '../../api/workspaceApi';
// // import { getUsers } from '../../api/userApi';
// import { getUserById, getUsers } from '../../api/authapi';
// import { useNavigate, useParams } from 'react-router-dom';
// import Select from 'react-select';
// import './WorkspaceForm.css';

// const WorkspaceForm = () => {
//   const { id } = useParams(); // Get workspace ID for editing
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // New: Track loading state

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const userData = await getUsers();
//         setUsers(userData);
//       } catch (err) {
//         setError('Error fetching users.');
//       }
//     };

//     const fetchWorkspace = async () => {
//         if (id) {
//           try {
//             const workspaceData = await getWorkspaceById(id);
//             console.log("Fetched Workspace Data:", workspaceData);
      
//             setFormData({ 
//               name: workspaceData.name, 
//               description: workspaceData.description 
//             });
      
//             if (workspaceData.members) {
//               console.log("Members in Response (IDs):", workspaceData.members);
      
//               // Fetch full user details using IDs
//               const memberDetails = await Promise.all(
//                 workspaceData.members.map(async (memberId) => {
//                   const userData = await getUserById(memberId);
//                   console.log("🔹 User Data for ID", memberId, ":", userData);
//                   return userData;
//                 })
//               );
      
//               console.log("Full Member Details:", memberDetails);
      
//               // Convert member details into the format expected by react-select
//               const formattedMembers = memberDetails
//                 .filter(member => member) // Remove null values (if any user not found)
//                 .map((member) => ({
//                   value: member.id,
//                   label: `${member.name} (${member.email})`
//                 }));
      
//               console.log("Formatted Members for Select:", formattedMembers);
//               setSelectedMembers(formattedMembers);
//             }
      
//             setLoading(false);
//           } catch (err) {
//             console.error("Error fetching workspace details:", err);
//             setError("Error fetching workspace details.");
//             setLoading(false);
//           }
//         } else {
//           setLoading(false);
//         }
//       };      
      

//     fetchUsers().then(fetchWorkspace); // Ensure users are fetched before workspace
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//     const handleSubmit = async () => {
//       if (!formData.name.trim()) {
//           setError('Workspace name is required.');
//           return;
//       }

//       try {
//           const membersArray = selectedMembers.map(user => user.value);
//           const workspaceData = {
//               name: formData.name,
//               description: formData.description || '',
//               members: membersArray,
//           };

//           if (id) {
//               await updateWorkspace(id, workspaceData);
//           } else {
//               await createWorkspace(workspaceData);
//           }

//           navigate('/workspaces'); // Ensure UI updates after submission
//       } catch (err) {
//           setError(err.message || 'Error saving workspace.');
//       }
//   };
//   return (
//     <div className="workspaceForm-form-container">
//       <h2>{id ? 'Edit Workspace' : 'Create Workspace'}</h2>
//       {error && <p className="error">{error}</p>}

//       <input
//         type="text"
//         name="name"
//         placeholder="Workspace Name"
//         value={formData.name}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="description"
//         placeholder="Workspace Description"
//         value={formData.description}
//         onChange={handleChange}
//       />

//       <label>Select Members:</label>
//       <Select
//         options={users.map((user) => ({
//           value: user.id,
//           label: `${user.name} (${user.email})`,
//         }))}
//         isMulti
//         onChange={setSelectedMembers}
//         value={selectedMembers} // This should now correctly display selected members
//         placeholder="Search and select members..."
//       />

//       <button onClick={handleSubmit}>{id ? 'Update' : 'Create'}</button>
//       <button onClick={() => navigate('/workspaces')}>Cancel</button>
//     </div>
//   );
// };

// export default WorkspaceForm;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createWorkspace, updateWorkspace, getWorkspaceById } from '../../api/workspaceApi';
import { getUserById, getUsers } from '../../api/authapi';
import './WorkspaceForm.css';

const WorkspaceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch {
        setError('Error fetching users.');
      }
    };

    const fetchWorkspace = async () => {
      if (id) {
        try {
          const workspaceData = await getWorkspaceById(id);
          setFormData({
            name: workspaceData.name,
            description: workspaceData.description || '',
          });
          if (workspaceData.members) {
            const memberDetails = await Promise.all(
              workspaceData.members.map((memberId) => getUserById(memberId))
            );
            setSelectedMembers(
              memberDetails.map((member) => ({
                value: member.id,
                label: `${member.name} (${member.email})`,
              }))
            );
          }
        } catch {
          setError('Error fetching workspace details.');
        }
      }
    };

    fetchUsers().then(fetchWorkspace);
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Workspace name is required.');
      return;
    }
    try {
      const workspaceData = {
        name: formData.name,
        description: formData.description || '',
        members: selectedMembers.map((user) => user.value),
      };
      id ? await updateWorkspace(id, workspaceData) : await createWorkspace(workspaceData);
      navigate('/workspaces');
    } catch (err) {
      setError('Error saving workspace.');
    }
  };

  return (
    <div className="workspaceForm-container">
      <div className="workspaceForm-card">
        <h2 className="workspaceForm-title">{id ? 'Edit Workspace' : 'Create Workspace'}</h2>
        {error && <p className="workspaceForm-error">{error}</p>}
        <form onSubmit={handleSubmit} className="workspaceForm-form">
          <div className="input-group">
            <label className="workspaceForm-label">Workspace Name</label>
            <input 
              type="text" 
              name="name" 
              className="workspaceForm-input" 
              placeholder="Enter workspace name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="workspaceForm-label">Workspace Description</label>
            <input 
              type="text" 
              name="description" 
              className="workspaceForm-input" 
              placeholder="Enter workspace description" 
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label className="workspaceForm-label">Select Members</label>
            <Select className='workspaceForm-select'
              options={users.map((user) => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
              }))} 
              isMulti 
              onChange={setSelectedMembers} 
              value={selectedMembers} 
              placeholder="Search and select members..." 
            />
          </div>

          <button type="submit" className="workspaceForm-button">{id ? 'Update' : 'Create'}</button>
        </form>
        <button onClick={() => navigate('/workspaces')} className="workspaceForm-cancel">Cancel</button>
      </div>
    </div>
  );
};

export default WorkspaceForm;
