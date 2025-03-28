// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './Header.css';
// import teamworkLogo from '../../../public/teamworkLogo.jpg';

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     } else {
//       setUser(null);
//     }
//   }, [location]);

//   const handleSignOut = () => {
//     setDropdownOpen(!dropdownOpen);
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     setUser(null);
//     // setWorkspaces([]);
//     navigate('/');
//   };

//   const toggleDropdown = () => {
//     console.log(user);
//     setDropdownOpen(!dropdownOpen);
//   };

//   return (
//     <header>
//       <nav className="navbar navbar-inverse">
//         <div className="container">
//           {/* <div>
//             <img src={teamworkLogo} alt="Teamwork Logo" className="logo" />
//           </div>
//           <div className="navbar-header">
//             <a className="navbar-brand">Team Collaboration Project</a>
//           </div> */}

//           <ul className="nav navbar-nav">
//             <li>
//               <Link to="/">
//                 <span className="HomeIcon"></span> Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/about">
//                 <span className="AboutIcon"></span> About
//               </Link>
//             </li>
//             {/* <li>
//               <Link to="/about">
//                 <span className="AboutIcon"></span> Contact Us
//               </Link>
//             </li> */}
//           </ul>

//           <ul className="nav navbar-nav navbar-right">
//             {user ? (
//               <li className="nav-item dropdown">
//                 <div className="user-circle" onClick={toggleDropdown}>
//                   {user.name
//                     .split(' ')
//                     .map((n) => n[0])
//                     .join('')
//                     .toUpperCase()}
//                 </div>
//                 {dropdownOpen && (
//                   <div className="dropdown-menu">
//                     <p style={{ color: 'black' }}>{user.name}</p>
//                     {/* <p style={{ color: 'black' }}>{user.role}</p> */}
//                     <button onClick={handleSignOut} className="dropdown-item">
//                       Sign Out
//                     </button>
//                   </div>
//                 )}
//               </li>
//             ) : (
//               <li>
//                 {location.pathname === '/SignIn' ? (
//                   <Link to="/SignUp">
//                     <span className="SignUp"></span> Sign Up
//                   </Link>
//                 ) : (
//                   <Link to="/SignIn">
//                     <span className="Login"></span> Login
//                   </Link>
//                 )}
//               </li>
//             )}
//           </ul>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import './Header.css';
import teamworkLogo from '../../../public/teamworkLogo.jpg';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleSignOut = () => {
    setDropdownOpen(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(menuOpen);
  };

  return (
    <header>
      <nav className="navbar navbar-inverse">
        <div className="container">
          <div className="menu-icon" onClick={toggleMenu}>
            ☰
          </div>

          <ul className="nav navbar-nav">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                About
              </NavLink>
            </li>
          </ul>

          <ul className="nav navbar-nav navbar-right">
            {user ? (
              <li className="nav-item dropdown">
                <div className="user-circle" onClick={toggleDropdown}>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <p style={{ color: 'black' }}>{user.name}</p>
                    <p
                      style={{
                        color: 'black',
                        fontWeight: 'normal'
                      }}
                    >
                      {user.role === 'superadmin'
                        ? 'Super Admin'
                        : user.role === 'admin'
                        ? 'Admin'
                        : 'Member'}
                    </p>
                    <hr style={{ margin: '5px 0', border: '0.5px solid #ccc' }} />
                    <button onClick={handleSignOut} className="dropdown-item">
                      Sign Out
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                {location.pathname === '/SignIn' ? (
                  <NavLink to="/SignUp">
                    <span className="SignUp"></span> Sign Up
                  </NavLink>
                ) : (
                  <NavLink to="/SignIn">
                    <span className="Login"></span> Login
                  </NavLink>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Sidebar Menu */}
      {menuOpen && (
        <div className="sidebar-menu">
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>
                ℹ️ About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu}>
                📞 Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
