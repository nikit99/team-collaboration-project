
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleSidebar, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="menu-icon" onClick={toggleSidebar}>
          {/* {sidebarCollapsed ? '☰' : '✕'} */}
          {sidebarCollapsed ? '☰' : '☰'}
        </div>

        {/* <div className="header-title">Team Collaboration</div> */}

        <div className="header-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            About
          </NavLink>
        </div>

        <div className="header-user">
          {user ? (
            <div className="user-dropdown">
              <div className="user-circle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p style={{fontWeight:'bold'}}>{user.name}</p>
                  <p>
                    {user.role === 'superadmin'
                      ? 'Super Admin'
                      : user.role === 'admin'
                      ? 'Admin'
                      : 'Member'}
                  </p>
                  <hr />
                  <button onClick={handleSignOut} className="dropdown-item">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {location.pathname === '/SignIn' ? (
                <NavLink to="/SignUp">Sign Up</NavLink>
              ) : (
                <NavLink to="/SignIn">Login</NavLink>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;