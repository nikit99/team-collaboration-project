import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createTask, getTaskById, updateTask } from '../../api/taskApi';
import { getProjects } from '../../api/projectsApi';
import './TaskForm.css';
import { getWorkspaces } from '../../api/workspaceApi';
import { getUsers, getUserById } from '../../api/authapi';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const statusOptions = [
    { value: 'to_do', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const fetchWorkspaces = useCallback(async () => {
    try {
      const workspacesResponse = await getWorkspaces(1, 1000);
      const workspaceList = workspacesResponse.workspaces || workspacesResponse;
      setWorkspaces(Array.isArray(workspaceList) ? workspaceList : []);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      setError('Error loading workspaces. Please try again.');
    }
  }, []);

  const fetchProjects = useCallback(async (workspaceId) => {
    if (!workspaceId) {
      setProjects([]);
      return;
    }
    try {
      setIsLoading(true);
      const projectsResponse = await getProjects(
        { workspace: workspaceId }, 
        1, 
        1000, 
        true
      );
      const projectList = projectsResponse.projects || projectsResponse;
      setProjects(Array.isArray(projectList) ? projectList : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Error fetching projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProjectMembers = useCallback(async (projectId) => {
    if (!projectId) {
      setUsers([]);
      setSelectedMembers([]);
      return;
    }
    try {
      setIsLoading(true);
      const currentProject = projects.find(p => p.id === projectId);
      if (!currentProject?.members) {
        setUsers([]);
        return;
      }

      const membersResponse = await getUsers({}, 1, 1000, true);
      const allUsers = membersResponse.users || membersResponse;
      
      const projectMembers = Array.isArray(allUsers) 
        ? allUsers.filter(user => currentProject.members.includes(user.id))
        : [];
      
      setUsers(projectMembers);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Error fetching project members. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsInitialLoad(true);
      setError('');
      try {
        // Load workspaces
        const workspacesResponse = await getWorkspaces(1, 1000);
        const workspaceList = workspacesResponse.workspaces || workspacesResponse;
        setWorkspaces(Array.isArray(workspaceList) ? workspaceList : []);

        if (id) {
          // Load task data
          const taskData = await getTaskById(id);
          setFormData({
            name: taskData.name,
            description: taskData.description || '',
            start_date: taskData.start_date || '',
            due_date: taskData.due_date || '',
            status: taskData.status || 'to_do',
          });

          const projectsResponse = await getProjects({}, 1, 1000, true);
          const allProjects = projectsResponse.projects || projectsResponse;
          const taskProject = Array.isArray(allProjects) 
            ? allProjects.find(p => p.id === taskData.project) 
            : null;

          if (taskProject) {
            const workspace = workspaceList.find(w => w.id === taskProject.workspace);
            if (workspace) {
              setSelectedWorkspace({
                value: workspace.id,
                label: workspace.name,
              });

              const projectsForWorkspace = await getProjects(
                { workspace: workspace.id }, 
                1, 
                1000, 
                true
              );
              const projectList = projectsForWorkspace.projects || projectsForWorkspace;
              setProjects(Array.isArray(projectList) ? projectList : []);

              setSelectedProject({
                value: taskProject.id,
                label: taskProject.name,
              });

              if (taskData.members?.length > 0) {
                const membersResponse = await getUsers({}, 1, 1000, true);
                const allUsers = membersResponse.users || membersResponse;
                
                const projectMembers = allUsers.filter(user => 
                  taskProject.members.includes(user.id)
                );
                setUsers(projectMembers);

                const memberDetails = await Promise.all(
                  taskData.members.map(memberId => getUserById(memberId))
                );
                
                setSelectedMembers(
                  memberDetails
                    .filter(member => member)
                    .map(member => ({
                      value: member.id,
                      label: `${member.name} (${member.email})`
                    }))
                );
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Error loading task details. Please try again.');
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const populateForm = async (taskData) => {
    try {
      setFormData({
        name: taskData.name,
        description: taskData.description || '',
        start_date: taskData.start_date || '',
        due_date: taskData.due_date || '',
        status: taskData.status || 'to_do',
      });

      const projectsResponse = await getProjects({}, 1, 1000, true);
      const allProjects = projectsResponse.projects || projectsResponse;
      const taskProject = Array.isArray(allProjects) 
        ? allProjects.find(p => p.id === taskData.project) 
        : null;
      
      if (taskProject) {
        const workspace = workspaces.find(w => w.id === taskProject.workspace);
        if (workspace) {
          setSelectedWorkspace({
            value: workspace.id,
            label: workspace.name,
          });

          await fetchProjects(workspace.id);
          
          setSelectedProject({
            value: taskProject.id,
            label: taskProject.name,
          });

          if (taskData.members?.length > 0) {
            await fetchProjectMembers(taskProject.id);
            const memberDetails = await Promise.all(
              taskData.members.map(memberId => getUserById(memberId))
            );
            
            setSelectedMembers(
              memberDetails
                .filter(member => member)
                .map(member => ({
                  value: member.id,
                  label: `${member.name} (${member.email})`
                }))
            );
          }
        }
      }
    } catch (err) {
      console.error('Error populating form:', err);
      setError('Error loading task details. Please try again.');
    }
  };

  const handleWorkspaceChange = async (selectedOption) => {
    setSelectedWorkspace(selectedOption);
    setSelectedProject(null);
    setSelectedMembers([]);
    if (selectedOption) {
      await fetchProjects(selectedOption.value);
    }
  };

  const handleProjectChange = async (selectedOption) => {
    setSelectedProject(selectedOption);
    if (selectedOption) {
      await fetchProjectMembers(selectedOption.value);
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
      setIsLoading(true);
      if (id) {
        await updateTask(id, taskData);
      } else {
        await createTask(taskData);
      }
      navigate('/tasks');
    } catch (err) {
      console.error('Error saving task:', err);
      setError(err.response?.data?.message || 'Error saving task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoad) {
    return <div className="loading">Loading initial data...</div>;
  }

  return (
    <div className="taskForm-container">
      <div className="taskForm-card">
        <h2 className="taskForm-title">{id ? 'Edit Task' : 'Create Task'}</h2>
        {error && <p className="taskForm-error">{error}</p>}

        <form onSubmit={handleSubmit} className="taskForm-form">
          <div className="form-grid">
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
                disabled={isLoading}
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
                isDisabled={isLoading}
              />
            </div>

            <div className="input-group full-width">
              <label className="taskForm-label">Task Description</label>
              <textarea
                name="description"
                className="taskForm-input"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Workspace</label>
              <Select
                className="taskForm-select"
                options={workspaces.map(workspace => ({
                  value: workspace.id,
                  label: workspace.name,
                }))}
                onChange={handleWorkspaceChange}
                value={selectedWorkspace}
                placeholder="Select a workspace..."
                isDisabled={!!id || isLoading}
              />
            </div>

            <div className="input-group">
              <label className="taskForm-label">Project</label>
              <Select
                className="taskForm-select"
                options={projects.map(project => ({
                  value: project.id,
                  label: project.name,
                }))}
                onChange={handleProjectChange}
                value={selectedProject}
                placeholder={!selectedWorkspace ? "Select workspace first" : "Select a project..."}
                isDisabled={!selectedWorkspace || isLoading}
              />
            </div>

            <div className="input-group full-width">
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
                placeholder={
                  isLoading ? "Loading..." :
                  !selectedProject ? "Select project first" :
                  users.length === 0 ? "No members in project" :
                  "Select members..."
                }
                isDisabled={!selectedProject || isLoading || users.length === 0}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="taskForm-button"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (id ? 'Update Task' : 'Create Task')}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="taskForm-cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;