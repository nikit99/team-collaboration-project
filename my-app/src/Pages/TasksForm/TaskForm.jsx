import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import { createTask, getTaskById, updateTask } from '../../api/taskApi';
import { getProjects } from '../../api/projectsApi';
import './TaskForm.css';
import SideBar from '../../Components/Sidebar/Sidebar';
import { getWorkspaces } from '../../api/workspaceApi';
import { getWorkspaceById } from '../../api/workspaceApi';
import { getUserById } from '../../api/authapi';


const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    due_date: '',
    status: 'to_do',
  });

  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = [
    { value: 'to_do', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        
        const workspaceData = await getWorkspaces();
        setWorkspaces(workspaceData);

        // editing
        if (id) {
          const taskData = await getTaskById(id);
          await populateForm(taskData, workspaceData);
        }
      } catch (err) {
        setError('Error loading initial data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const populateForm = async (taskData, workspaceData) => {
    setFormData({
      name: taskData.name,
      description: taskData.description || '',
      start_date: taskData.start_date || '',
      due_date: taskData.due_date || '',
      status: taskData.status || 'to_do',
    });

    const allProjects = await getProjects();
    const taskProject = allProjects.find(p => p.id === taskData.project);
    
    if (taskProject) {
      const workspace = workspaceData.find(w => w.id === taskProject.workspace);
      
      if (workspace) {
        setSelectedWorkspace({
          value: workspace.id,
          label: workspace.name,
        });

        const filteredProjects = allProjects.filter(
          p => p.workspace === workspace.id
        );
        setProjects(filteredProjects);

       
        setSelectedProject({
          value: taskProject.id,
          label: taskProject.name,
          members: taskProject.members || [],
        });

        const memberDetails = await Promise.all(
          taskData.members.map(memberId => getUserById(memberId))
        );
        setSelectedMembers(
          memberDetails.map(member => ({
            value: member.id,
            label: `${member.name} (${member.email})`,
          }))
        );
        setUsers(memberDetails);
      }
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedWorkspace) {
        try {
          const allProjects = await getProjects();
          const filteredProjects = allProjects.filter(
            project => project.workspace === selectedWorkspace.value
          );
          setProjects(filteredProjects);
        } catch {
          setError('Error fetching projects.');
        }
      } else {
        setProjects([]);
        setSelectedProject(null);
      }
    };

    fetchProjects();
  }, [selectedWorkspace]);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (selectedProject) {
        try {
          const memberDetails = await Promise.all(
            selectedProject.members.map(memberId => getUserById(memberId))
          );
          setUsers(memberDetails);
        } catch {
          setError('Error fetching project members.');
          setUsers([]);
        }
      } else {
        setUsers([]);
        setSelectedMembers([]);
      }
    };

    fetchProjectMembers();
  }, [selectedProject]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = selectedOption => {
    setFormData({ ...formData, status: selectedOption.value });
  };

  const handleWorkspaceChange = selectedOption => {
    setSelectedWorkspace(selectedOption);
    setSelectedProject(null);
  };

  const handleProjectChange = selectedOption => {
    setSelectedProject(selectedOption);
  };

  const handleMembersChange = selectedOptions => {
    setSelectedMembers(selectedOptions);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Task name is required.');
      return;
    }
    if (!selectedProject) {
      setError('Please select a project.');
      return;
    }

    const taskData = {
      name: formData.name,
      description: formData.description,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
      status: formData.status,
      project: selectedProject.value,
      members: selectedMembers.map(user => user.value),
    };

    try {
      if (id) {
        await updateTask(id, taskData);
      } else {
        await createTask(taskData);
      }
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving task.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {/* <SideBar /> */}
      <div className="taskForm-container">
        <div className="taskForm-card">
          <h2 className="taskForm-title">{id ? 'Edit Task' : 'Create Task'}</h2>
          {error && <p className="taskForm-error">{error}</p>}

          <form onSubmit={handleSubmit} className="taskForm-form">
            <div className="input-group">
              <label className="taskForm-label">Task Name</label>
              <input
                type="text"
                name="name"
                className="taskForm-input"
                placeholder="Enter task name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Task Description</label>
              <textarea
                name="description"
                className="taskForm-input"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="taskForm-input"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Due Date</label>
              <input
                type="date"
                name="due_date"
                className="taskForm-input"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Status</label>
              <Select
                className="taskForm-select"
                options={statusOptions}
                onChange={handleStatusChange}
                value={statusOptions.find(option => option.value === formData.status)}
                placeholder="Select task status..."
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Select Workspace</label>
              <Select
                className="taskForm-select"
                options={workspaces.map(workspace => ({
                  value: workspace.id,
                  label: workspace.name,
                }))}
                onChange={handleWorkspaceChange}
                value={selectedWorkspace}
                placeholder="Select a workspace..."
                isDisabled={!!id} // Disable when editing to maintain data integrity
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Select Project</label>
              <Select
                className="taskForm-select"
                options={projects.map(project => ({
                  value: project.id,
                  label: project.name,
                  members: project.members || [],
                }))}
                onChange={handleProjectChange}
                value={selectedProject}
                placeholder="Select a project..."
                isDisabled={!selectedWorkspace}
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Assign Members</label>
              <Select
                isMulti
                className="taskForm-select"
                options={users.map(user => ({
                  value: user.id,
                  label: `${user.name} (${user.email})`,
                }))}
                onChange={handleMembersChange}
                value={selectedMembers}
                placeholder="Select members..."
                isDisabled={!selectedProject}
              />
            </div>

            <button type="submit" className="taskForm-button">
              {id ? 'Update Task' : 'Create Task'}
            </button>
          </form>

          <button onClick={() => navigate(-1)} className="taskForm-cancel">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskForm;