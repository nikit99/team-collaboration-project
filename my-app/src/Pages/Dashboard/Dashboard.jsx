import React, { useEffect, useState } from 'react';
import { FaTasks, FaProjectDiagram, FaBuilding, FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '../../api/taskApi';
import { getWorkspaces } from '../../api/workspaceApi';
import { getProjects } from '../../api/projectsApi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    workspaces: 0,
    projects: 0,
    tasks: 0,
    projectsStatus: {
      completed: 0,
      in_progress: 0,
      cancelled: 0
    },
    tasksStatus: {
      completed: 0,
      in_progress: 0,
      to_do: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const userId = loggedInUser.id;
  const isAdminOrSuperAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const [workspacesData, projectsData, tasksData] = await Promise.all([
          getWorkspaces(1, 1000),  
          getProjects({}, 1, 1000), 
          getTasks({}, 1, 1000)     
        ]);

        const workspaces = workspacesData.workspaces || workspacesData;
        const projects = projectsData.projects || projectsData;
        const tasks = tasksData.tasks || tasksData;

        const filteredWorkspaces = Array.isArray(workspaces) 
          ? workspaces.filter(ws => isAdminOrSuperAdmin || ws.members?.includes(userId))
          : [];
        
        const filteredProjects = Array.isArray(projects)
          ? projects.filter(project => 
              isAdminOrSuperAdmin || 
              project.owner === userId || 
              project.members?.includes(userId)
            )
          : [];
        
        const filteredTasks = Array.isArray(tasks)
          ? tasks.filter(task => 
              isAdminOrSuperAdmin || 
              task.owner === userId || 
              task.members?.includes(userId)
            )
          : [];

        const projectsStatus = {
          completed: filteredProjects.filter(p => p.status === 'completed').length,
          in_progress: filteredProjects.filter(p => p.status === 'in_progress').length,
          cancelled: filteredProjects.filter(p => p.status === 'cancelled').length
        };

        const tasksStatus = {
          completed: filteredTasks.filter(t => t.status === 'completed').length,
          in_progress: filteredTasks.filter(t => t.status === 'in_progress').length,
          to_do: filteredTasks.filter(t => t.status === 'to_do').length
        };

        setStats({
          workspaces: filteredWorkspaces.length,
          projects: filteredProjects.length,
          tasks: filteredTasks.length,
          projectsStatus,
          tasksStatus
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isAdminOrSuperAdmin]);

  const projectsChartData = [
    { name: 'Completed', value: stats.projectsStatus.completed },
    { name: 'In Progress', value: stats.projectsStatus.in_progress },
    { name: 'Cancelled', value: stats.projectsStatus.cancelled }
  ];

  const tasksChartData = [
    { name: 'Completed', value: stats.tasksStatus.completed },
    { name: 'In Progress', value: stats.tasksStatus.in_progress },
    { name: 'To Do', value: stats.tasksStatus.to_do }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Home</h2>
          <p className="dashboard-subtitle">Monitor all your workspaces, projects, and tasks here</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate('/workspaces')}>
            <div className="stat-icon">
              <FaBuilding size={24} />
            </div>
            <div className="stat-content">
              <h3>Workspaces</h3>
              <p className="stat-value">{stats.workspaces}</p>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate('/ProjectDemo')}>
            <div className="stat-icon">
              <FaProjectDiagram size={24} />
            </div>
            <div className="stat-content">
              <h3>Projects</h3>
              <p className="stat-value">{stats.projects}</p>
              <div className="stat-subtext">
                <span className="completed">{stats.projectsStatus.completed} completed</span>
                <span className="in-progress">{stats.projectsStatus.in_progress} in progress</span>
              </div>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate('/tasks')}>
            <div className="stat-icon">
              <FaTasks size={24} />
            </div>
            <div className="stat-content">
              <h3>Tasks</h3>
              <p className="stat-value">{stats.tasks}</p>
              <div className="stat-subtext">
                <span className="completed">{stats.tasksStatus.completed} completed</span>
                <span className="to-do" onClick={(e) => {
                  e.stopPropagation();
                  navigate('/tasks?status=to_do');
                }}>{stats.tasksStatus.to_do} to do</span>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Projects Status</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Tasks Status</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tasksChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tasksChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="quick-links">
          <h3>Quick Access</h3>
          <div className="link-buttons">
            <button 
              className="link-button todo-tasks"
              onClick={() => navigate('/tasks?status=to_do')}
            >
              <FaTasks /> To Do Tasks ({stats.tasksStatus.to_do})
            </button>
            <button 
              className="link-button in-progress-tasks"
              onClick={() => navigate('/tasks?status=in_progress')}
            >
              <FaTasks /> In Progress Tasks ({stats.tasksStatus.in_progress})
            </button>
            <button 
              className="link-button in-progress-projects"
              onClick={() => navigate('/ProjectDemo?status=in_progress')}
            >
              <FaProjectDiagram /> Active Projects ({stats.projectsStatus.in_progress})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;