import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import teamworkLogo from '../../../public/teamworkLogo.jpg';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); //detect routes changes
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
  };

  return (
    <header>
      <nav className="navbar navbar-inverse">
        <div className="container">
          <div>
            <img src={teamworkLogo} height="60" alt="Teamwork Logo" />
          </div>
          <div className="navbar-header">
            <a className="navbar-brand" >
              Team Collaboration Project
            </a>
          </div>

          <ul className="nav navbar-nav navbar-right">
            {user ? (
              <>
                <li>
                  <span className="navbar-text">{user.name}</span>
                </li>
                <li>
                  <button className="btn btn-danger" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/SignUp">
                    <span className="SignUp"></span> Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/SignIn">
                    <span className="Login"></span> Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
