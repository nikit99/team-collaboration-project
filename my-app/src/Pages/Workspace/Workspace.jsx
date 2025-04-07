import React, { useEffect, useState } from 'react';
import { getWorkspaces, deleteWorkspace } from '../../api/workspaceApi';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Workspace.css';
import SideBar from '../../Components/Sidebar/Sidebar';

const Workspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
  });
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isSuperAdmin = loggedInUser.role === 'superadmin' || loggedInUser.role === 'admin';
  const isUser = loggedInUser.role === 'user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { workspaces: workspaceData, pagination: paginationData } = await getWorkspaces(
          pagination.currentPage,
          pagination.pageSize
        );
        setWorkspaces(workspaceData);
        setPagination(paginationData);
      } catch (err) {
        setError(err.message || 'Error fetching workspaces.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pagination.currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      try {
        await deleteWorkspace(id);
        // Refresh workspaces to maintain pagination
        const { workspaces: updatedWorkspaces } = await getWorkspaces(
          pagination.currentPage,
          pagination.pageSize
        );
        setWorkspaces(updatedWorkspaces);
      } catch (error) {
        console.error('Error deleting workspace:', error);
        alert('Failed to delete workspace!');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <>
      <div className="workspace-container">
        <div className="workspace-header">
          <h2 className="workspace-heading">My Workspaces</h2>
         
        </div>

        {loading ? (
          <p className="loading-message">Loading workspaces...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : workspaces.length === 0 ? (
          <p className="no-workspaces">No workspaces found</p>
        ) : (
          <>
            <div className="workspace-grid">
              {workspaces.map((ws) => {
                const isOwner = ws.owner === loggedInUser.name;
                return (
                  <div 
                    key={ws.id} 
                    className="workspace-card" 
                    onClick={() => navigate(`/ProjectDemo/${ws.id}`)}
                  >
                    <div className="workspace-content">
                      <h3>{ws.name}</h3>
                      <p>{ws.description}</p>
                      <p className="workspace-owner">Created by: {ws.owner}</p>
                    </div>
                    <div className="card-icons" onClick={(e) => e.stopPropagation()}>
                      {isOwner || isSuperAdmin ? (
                        <>
                          <FaEdit 
                            className="edit-icon" 
                            title="Edit" 
                            onClick={() => navigate(`/edit-workspace/${ws.id}`)} 
                          />
                          <FaTrash 
                            className="delete-icon" 
                            title="Delete" 
                            onClick={() => handleDelete(ws.id)} 
                          />
                        </>
                      ) : (
                        <FaEye 
                          className="view-icon" 
                          title="View" 
                          onClick={() => navigate(`/edit-workspace/${ws.id}`)} 
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {!isUser && (
                <div 
                  className="workspace-card add-card" 
                  title="Add Workspace" 
                  onClick={() => navigate('/create-workspace')}
                >
                  <FaPlus className="plus-sign" />
                </div>
              )}
            </div>

         
          </>
        )}
      </div>
    </>
  );
};

export default Workspace;

