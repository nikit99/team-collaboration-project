import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createProject, updateProject, getProjectById } from '../../api/projectsApi';
import { getUserById } from '../../api/authapi';
import { getWorkspaces } from '../../api/workspaceApi';
import './ProjectForm.css';
import SideBar from '../../Components/Sidebar/Sidebar';

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

  const statusOptions = [
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'in_progress', label: 'In Progress' }, // Fixed typo
    { value: 'completed', label: 'Completed' },
  ];

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const workspaceData = await getWorkspaces();
        setWorkspaces(workspaceData);
      } catch {
        setError('Error fetching workspaces.');
      }
    };

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (id && workspaces.length > 0) {
        try {
          const projectData = await getProjectById(id);
          console.log('Project Data:', projectData);

          setFormData({
            name: projectData.name,
            description: projectData.description || '',
            start_date: projectData.start_date || '',
            end_date: projectData.end_date || '',
            status: projectData.status || 'in_progress',
          });

          const workspace = workspaces.find(w => w.id === projectData.workspace);
          if (workspace) {
            setSelectedWorkspace({
              value: workspace.id,
              label: workspace.name,
              members: workspace.members || [],
            });

            if (workspace.members?.length > 0) {
              const memberDetails = await Promise.all(
                workspace.members.map(memberId => getUserById(memberId))
              );
              setUsers(memberDetails);
              const projectMembers = memberDetails.filter(member => projectData.members.includes(member.id));
              setSelectedMembers(
                projectMembers.map(member => ({
                  value: member.id,
                  label: `${member.name} (${member.email})`,
                }))
              );
            }
          }
        } catch {
          setError('Error fetching project details.');
        }
      }
    };

    if (workspaces.length > 0) {
      fetchProject();
    }
  }, [id, workspaces]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = selectedOption => {
    setFormData({ ...formData, status: selectedOption.value });
  };

  const handleWorkspaceChange = async selectedOption => {
    setSelectedWorkspace(selectedOption);
    setSelectedMembers([]);

    if (selectedOption) {
      try {
        const memberDetails = await Promise.all(
          selectedOption.members.map(memberId => getUserById(memberId))
        );
        setUsers(memberDetails);
      } catch {
        setError('Error fetching workspace members.');
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
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
    try {
      const projectData = {
        name: formData.name,
        description: formData.description || '',
        start_date: formData.start_date || '',
        end_date: formData.end_date || '',
        status: formData.status || 'in_progress',
        workspace: selectedWorkspace?.value || null,
        members: selectedMembers.map(user => user.value),
      };

      if (id) {
        await updateProject(id, projectData);
      } else {
        await createProject(projectData);
      }
      navigate('/ProjectDemo');
    } catch (err) {
      setError('Error saving project.');
    }
  };

  return (
    <>
    
    {/* <SideBar/> */}
    <div className="projectForm-container">
      <div className="projectForm-card">
        <h2 className="projectForm-title">{id ? 'Edit Project' : 'Create Project'}</h2>
        {error && <p className="projectForm-error">{error}</p>}

        <form onSubmit={handleSubmit} className="projectForm-form">
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
            />
          </div>

          <div className="input-group">
            <label className="projectForm-label">Project Description</label>
            <input
              type="text"
              name="description"
              className="projectForm-input"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="projectForm-label">Start Date</label>
            <input
              type="date"
              name="start_date"
              className="projectForm-input"
              value={formData.start_date}
              onChange={handleChange}
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
            />
          </div>

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
              placeholder="Select a workspace..."
            />
          </div>

          <div className="input-group">
            <label className="projectForm-label">Select Members</label>
            <Select
              isMulti
              className="projectForm-select"
              options={users.map(user => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
              }))}
              onChange={handleMembersChange}
              value={selectedMembers}
              placeholder="Select members..."
            />
          </div>

          <button type="submit" className="projectForm-button">
            {id ? 'Update' : 'Create'}
          </button>
        </form>

        <button onClick={() => navigate('/ProjectDemo')} className="projectForm-cancel">
          Cancel
        </button>
      </div>
    </div>
    </>
  );
};

export default ProjectForm;
