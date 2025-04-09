
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createProject, updateProject, getProjectById } from '../../api/projectsApi';
import { getUserById, getUsers } from '../../api/authApi';
import { getWorkspaces } from '../../api/workspaceApi';
import './ProjectForm.css';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'in_progress',
  });

  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError('');
      try {
        const workspacesResponse = await getWorkspaces(1, 1000);
        const workspaceList = workspacesResponse.workspaces || workspacesResponse;
        setWorkspaces(Array.isArray(workspaceList) ? workspaceList : []);

        if (id) {
          const projectData = await getProjectById(id);
          await populateForm(projectData, workspaceList);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Error loading initial data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const populateForm = async (projectData, workspaceList) => {
    try {
      setFormData({
        name: projectData.name,
        description: projectData.description || '',
        start_date: projectData.start_date || '',
        end_date: projectData.end_date || '',
        status: projectData.status || 'in_progress',
      });

      const workspace = Array.isArray(workspaceList)
        ? workspaceList.find(w => w.id === projectData.workspace)
        : null;

      if (workspace) {
        setSelectedWorkspace({
          value: workspace.id,
          label: workspace.name,
          members: workspace.members || [],
        });

        if (workspace.members?.length > 0) {
          const usersResponse = await getUsers({}, 1, 1000, true);
          const allUsers = usersResponse.users || usersResponse;
          setUsers(Array.isArray(allUsers) ? allUsers : []);

          const memberDetails = await Promise.all(
            workspace.members.map(memberId => getUserById(memberId))
          );
          
          const projectMembers = memberDetails
            .filter(member => member && projectData.members.includes(member.id))
            .map(member => ({
              value: member.id,
              label: `${member.name || 'Unknown'} (${member.email || 'No email'})`,
            }));
          
          setSelectedMembers(projectMembers);
        }
      }
    } catch (err) {
      console.error('Error populating form:', err);
      setError('Error loading project details. Please try again.');
    }
  };

  const handleWorkspaceChange = async (selectedOption) => {
    setSelectedWorkspace(selectedOption);
    setSelectedMembers([]);
    setError('');

    if (selectedOption) {
      try {
        setLoading(true);
        const usersResponse = await getUsers({}, 1, 1000, true);
        const allUsers = usersResponse.users || usersResponse;
        const memberDetails = await Promise.all(
          selectedOption.members.map(memberId => getUserById(memberId))
        );
        
        setUsers(
          memberDetails
            .filter(member => member !== null)
            .map(member => ({
              ...member,
              label: `${member.name || 'Unknown'} (${member.email || 'No email'})`
            }))
        );
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Error fetching workspace members. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setUsers([]);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = selectedOption => {
    setFormData({ ...formData, status: selectedOption.value });
  };

  const handleMembersChange = selectedOptions => {
    setSelectedMembers(selectedOptions);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required.');
      return;
    }
    if (!selectedWorkspace) {
      setError('Please select a workspace.');
      return;
    }

    try {
      setLoading(true);
      const projectData = {
        name: formData.name,
        description: formData.description || '',
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: formData.status,
        workspace: selectedWorkspace.value,
        members: selectedMembers.map(user => user.value),
      };

      if (id) {
        await updateProject(id, projectData);
      } else {
        await createProject(projectData);
      }
      navigate('/ProjectDemo');
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.response?.data?.message || 'Error saving project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="projectForm-container">
        <div className="projectForm-card">
          <h2 className="projectForm-title">{id ? 'Edit Project' : 'Create Project'}</h2>
          {error && <p className="projectForm-error">{error}</p>}
  
          <form onSubmit={handleSubmit} className="projectForm-form">
            <div className="form-grid">
              {/* Row 1 */}
              <div className="input-group">
                <label className="projectForm-label">Project Name</label>
                <input
                  type="text"
                  name="name"
                  className="projectForm-input"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
  
              <div className="input-group">
                <label className="projectForm-label">Status</label>
                <Select
                  className="projectForm-select"
                  options={statusOptions}
                  onChange={handleStatusChange}
                  value={statusOptions.find(option => option.value === formData.status)}
                  placeholder="Select project status..."
                  isDisabled={loading}
                />
              </div>
  
              {/* Row 2 */}
              <div className="input-group full-width">
                <label className="projectForm-label">Project Description</label>
                <input
                  type="text"
                  name="description"
                  className="projectForm-input"
                  placeholder="Enter project description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
  
              {/* Row 3 */}
              <div className="input-group">
                <label className="projectForm-label">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="projectForm-input"
                  value={formData.start_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
  
              <div className="input-group">
                <label className="projectForm-label">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  className="projectForm-input"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
  
              {/* Row 4 - Workspace and Members in same row */}
              <div className="input-group">
                <label className="projectForm-label">Select Workspace</label>
                <Select
                  className="projectForm-select"
                  options={workspaces.map(workspace => ({
                    value: workspace.id,
                    label: workspace.name,
                    members: workspace.members || [],
                  }))}
                  onChange={handleWorkspaceChange}
                  value={selectedWorkspace}
                  placeholder={loading ? "Loading..." : "Select a workspace..."}
                  isDisabled={loading}
                />
              </div>
  
              <div className="input-group">
                <label className="projectForm-label">Select Members</label>
                <Select
                  isMulti
                  className="projectForm-select"
                  options={users.map(user => ({
                    value: user.id,
                    label: `${user.name || 'Unknown'} (${user.email || 'No email'})`,
                  }))}
                  onChange={handleMembersChange}
                  value={selectedMembers}
                  placeholder={loading ? "Loading..." : "Select members..."}
                  isDisabled={loading || !selectedWorkspace}
                />
              </div>
            </div>
  
            <div className="form-actions">
              <button 
                type="submit" 
                className="projectForm-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : (id ? 'Update Project' : 'Create Project')}
              </button>
              <button 
                onClick={() => navigate('/ProjectDemo')} 
                className="projectForm-cancel"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;