import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <Sidebar
      style={{
        backgroundColor: 'wheat',
        marginTop: '70px',
        height: '100vh', // Full height
        width: '12pc', // Small width
        position: 'fixed', // Fix to the left
        top: 0,
        left: 0,
      }}
    >
      <Menu>
        {/* <SubMenu label="Charts">
          <MenuItem> Home </MenuItem>
          <MenuItem> About </MenuItem>
        </SubMenu> */}
        <MenuItem component={<Link to="/" />}> Home </MenuItem> 
        <MenuItem component={<Link to="/workspaces" />}> Workspace </MenuItem> 
        <MenuItem component={<Link to="/users" />}> Users </MenuItem> 
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
