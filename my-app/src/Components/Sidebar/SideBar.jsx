// import React from 'react';
// import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
// import { Link } from 'react-router-dom';

// const SideBar = () => {
//   return (
    
//     <Sidebar
//       style={{
//         backgroundColor: 'whitesmoke',
//         marginTop: '55px',
//         height: '100vh', // Full height
//         width: '5pc', // Small width
//         position: 'fixed', // Fix to the left
//         top: 0,
//         left: 0,
//       }}
//     >
//       <Menu>
//         {/* <SubMenu label="Charts">
//           <MenuItem> Home </MenuItem>
//           <MenuItem> About </MenuItem>
//         </SubMenu> */}
//         {/* <MenuItem component={<Link to="/" />}> Home </MenuItem>  */}
//         <MenuItem component={<Link to="/users" />}> Users </MenuItem> 
//         <MenuItem component={<Link to="/workspaces" />}> Workspaces </MenuItem> 
//         {/* <MenuItem component={<Link to="/projects" />}> ProjectDemo </MenuItem>  */}

//         <MenuItem component={<Link to="/ProjectDemo" />}> Projects </MenuItem> 
//       </Menu>
//     </Sidebar>
//   );
// };

// export default SideBar;


import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Import a separate CSS file for styling

const SideBar = () => {
  const location = useLocation();

  return (
    <Sidebar
      style={{
        backgroundColor: 'whitesmoke',
        marginTop: '55px',
        height: '100vh',
        width: '5pc',
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
          Users 
        </MenuItem>
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
      </Menu>
    </Sidebar>
  );
};

export default SideBar;


// import React, { useState } from 'react';
// import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
// import { Link, useLocation } from 'react-router-dom';
// import './Sidebar.css'; // Import CSS for styling

// const SideBar = () => {
//   const location = useLocation();
//   const [activeMenu, setActiveMenu] = useState(location.pathname);

//   const handleMenuClick = (path) => {
//     setActiveMenu(path);
//   };

//   return (
//     <Sidebar
//       style={{
//         backgroundColor: 'whitesmoke',
//         marginTop: '55px',
//         height: '100vh', // Full height
//         width: '5pc', // Small width
//         position: 'fixed', // Fix to the left
//         top: 0,
//         left: 0,
//       }}
//     >
//       <Menu>
//         <MenuItem 
//           className={`menu-item ${activeMenu === "/users" ? "active-menu" : ""}`} 
//           component={<Link to="/users" onClick={() => handleMenuClick("/users")} />}
//         >
//           Users
//         </MenuItem>

//         <MenuItem 
//           className={`menu-item ${activeMenu === "/workspaces" ? "active-menu" : ""}`} 
//           component={<Link to="/workspaces" onClick={() => handleMenuClick("/workspaces")} />}
//         >
//           Workspaces
//         </MenuItem>

//         <MenuItem 
//           className={`menu-item ${activeMenu === "/ProjectDemo" ? "active-menu" : ""}`} 
//           component={<Link to="/ProjectDemo" onClick={() => handleMenuClick("/ProjectDemo")} />}
//         >
//           Projects
//         </MenuItem>
//       </Menu>
//     </Sidebar>
//   );
// };

// export default SideBar;
