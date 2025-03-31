import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
// import './Sidebar.css'; 

const SideBar = () => {
  const location = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isSuperAdmin = loggedInUser.role === 'superadmin';

  return (
    <Sidebar
      style={{
        backgroundColor: 'wheat',
        marginTop: '55px',
        height: '100vh',
        width: '200px', // Adjust width
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <Menu>
        <MenuItem 
          component={<Link to="/users" />} 
          className={location.pathname === '/users' ? 'active-menu' : 'menu-item'}
        >
          Team Members
        </MenuItem>

        {/* {isSuperAdmin ? (
          <SubMenu 
            label="Workspaces"
            className="menu-item"
            rootStyles={{
              backgroundColor: 'whitesmoke',
              width: '100%', // Ensure full width
            }}
          >
            <MenuItem 
              component={<Link to="/workspaces" />} 
              className={location.pathname === '/workspaces' ? 'active-menu' : 'menu-item'}
            >
              Mine
            </MenuItem>
            <MenuItem 
              component={<Link to="/workspaces/all" />} 
              className={location.pathname === '/workspaces/all' ? 'active-menu' : 'menu-item'}
            >
              All
            </MenuItem>
          </SubMenu>
        ) : (
          <MenuItem 
            component={<Link to="/workspaces" />} 
            className={location.pathname === '/workspaces' ? 'active-menu' : 'menu-item'}
          >
            Workspaces 
          </MenuItem>
        )} */}

        <MenuItem 
            component={<Link to="/workspaces" />} 
            className={location.pathname === '/workspaces' ? 'active-menu' : 'menu-item'}
          >
            Workspaces 
          </MenuItem>

        <MenuItem 
          component={<Link to="/ProjectDemo" />} 
          className={location.pathname === '/ProjectDemo' ? 'active-menu' : 'menu-item'}
        >
          Projects 
        </MenuItem>
      
        <MenuItem 
          component={<Link to="/Tasks" />} 
          className={location.pathname === '/Tasks' ? 'active-menu' : 'menu-item'}
        >
          Tasks
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
