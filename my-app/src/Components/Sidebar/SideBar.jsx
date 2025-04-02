import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaProjectDiagram, 
  FaTasks,
  FaHome,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
import './Sidebar.css';

const SideBar = ({ collapsed }) => {
  const location = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isSuperAdmin = loggedInUser.role === 'superadmin';
  const [clickedItem, setClickedItem] = useState(null);

  const menuItems = [
    { path: '/users', icon: <FaUsers size={20} />, label: 'Team Members' },
    { path: '/workspaces', icon: <FaBuilding size={20} />, label: 'Workspaces' },
    { path: '/ProjectDemo', icon: <FaProjectDiagram size={20} />, label: 'Projects' },
    { path: '/Tasks', icon: <FaTasks size={20} />, label: 'Tasks' },
  ];

  const handleItemClick = (path) => {
    setClickedItem(path);
    setTimeout(() => setClickedItem(null), 500); // Reset after animation completes
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
            onClick={() => handleItemClick(item.path)}
          >
            <span className={`menu-icon ${clickedItem === item.path ? 'click-animation' : ''}`}>
              {item.icon}
            </span>
            {!collapsed && <span className="menu-label">{item.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;