import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createWorkspace, updateWorkspace, getWorkspaceById } from '../../api/workspaceApi';
import { getUserById, getUsers } from '../../api/authapi';
import './WorkspaceForm.css';
import SideBar from '../../Components/Sidebar/Sidebar';


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
    <>
    <SideBar/>
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
    </>
  );
};

export default WorkspaceForm;
