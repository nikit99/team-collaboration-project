import React, { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../../api/projectsApi';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import './Projects.css';
import SideBar from '../../Components/Sidebar/Sidebar';



const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('id')) || {};
  const isSuperAdmin = loggedInUser.role === 'superadmin';
  const isUser = loggedInUser.role === 'user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjects();
        setProjects(projectData);
      } catch (err) {
        setError(err.message || 'Error fetching projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const success = await deleteProject(id);
      if (success) {
        setProjects(projects.filter((project) => project.id !== id));
      }
    }
  };

  return (
    <>
      {/* <SideBar /> */}
      <div className="projects-container">
        <h2 className='projects-heading'>My Projects</h2>

        {loading ? (
          <p className="loading-message">Loading projects...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const isOwner = project.owner === loggedInUser.name;
              return (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <p className="project-owner">Created by: {project.created_by}</p>
                  <div className="card-icons">
                    {isOwner || isSuperAdmin ? (
                      <>
                        <FaEdit className="edit-icon" onClick={() => navigate(`/edit-project/${project.id}`)} />
                        <FaTrash className="delete-icon" onClick={() => handleDelete(project.id)} />
                      </>
                    ) : (
                      <FaEye className="view-icon" onClick={() => navigate(`/edit-project/${project.id}`)} />
                    )}
                  </div>
                </div>
              );
            })}

            {!isUser && (
              <div className="project-card add-card" onClick={() => navigate('/projectForm')}>
                <FaPlus className="plus-sign" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
