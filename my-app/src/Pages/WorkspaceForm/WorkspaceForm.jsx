import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createWorkspace, updateWorkspace, getWorkspaceById } from '../../api/workspaceApi';
import { getUserById, getUsers } from '../../api/authApi';
import './WorkspaceForm.css';

const WorkspaceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const usersResponse = await getUsers({}, 1, 10, true);
        const userList = usersResponse.users || [];
        setUsers(userList);

        if (id) {
          const workspaceData = await getWorkspaceById(id);
          setFormData({
            name: workspaceData.name,
            description: workspaceData.description || '',
          });
          
          if (workspaceData.members && workspaceData.members.length > 0) {
            const memberDetails = await Promise.all(
              workspaceData.members.map(memberId => getUserById(memberId))
            );
            
            const validMembers = memberDetails
              .filter(member => member !== null)
              .map(member => ({
                value: member.id,
                label: `${member.name || 'Unknown'} (${member.email || 'No email'})`
              }));
            
            setSelectedMembers(validMembers);
          }
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      setLoading(true);
      const workspaceData = {
        name: formData.name,
        description: formData.description,
        members: selectedMembers.map(user => user.value),
      };

      if (id) {
        await updateWorkspace(id, workspaceData);
      } else {
        await createWorkspace(workspaceData);
      }
      navigate('/workspaces');
    } catch (err) {
      console.error('Error saving workspace:', err);
      setError('Error saving workspace. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-page">
      <div className="workspaceForm-container">
        <div className="workspaceForm-card">
          <h2 className="workspaceForm-title">
            {id ? 'Edit Workspace' : 'Create Workspace'}
          </h2>
          
          {error && (
            <div className="workspaceForm-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="workspaceForm-form">
            <div className="input-group">
              <label className="workspaceForm-label">Workspace Name *</label>
              <input
                type="text"
                name="name"
                className="workspaceForm-input"
                placeholder="Enter workspace name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="workspaceForm-label">Description</label>
              <textarea
                name="description"
                className="workspaceForm-input workspaceForm-textarea"
                placeholder="Enter workspace description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="input-group">
              <label className="workspaceForm-label">Members</label>
              <Select
                className="workspaceForm-select"
                classNamePrefix="select"
                options={users.map(user => ({
                  value: user.id,
                  label: `${user.name || 'Unknown'} (${user.email || 'No email'})`
                }))}
                isMulti
                value={selectedMembers}
                onChange={setSelectedMembers}
                isLoading={loading}
                isDisabled={loading}
                placeholder="Select members..."
                noOptionsMessage={() => "No users available"}
              />
            </div>

           
              <button
                type="submit"
                className="workspaceForm-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : (id ? 'Update Workspace' : 'Create Workspace')}
              </button>
              
              <button
                type="button"
                className="workspaceForm-cancel"
                onClick={() => navigate('/workspaces')}
                disabled={loading}
              >
                Cancel
              </button>
          
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceForm;