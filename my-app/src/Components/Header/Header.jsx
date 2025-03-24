import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import teamworkLogo from '../../../public/teamworkLogo.jpg';

const Header = () => {
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
    setDropdownOpen(!dropdownOpen);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    // setWorkspaces([]);
    navigate('/signin');
  };

  const toggleDropdown = () => {
    console.log(user);
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header>
      <nav className="navbar navbar-inverse">
        <div className="container">
          <div>
            <img src={teamworkLogo} alt="Teamwork Logo" className="logo" />
          </div>
          <div className="navbar-header">
            <a className="navbar-brand">Team Collaboration Project</a>
          </div>

          <ul className="nav navbar-nav">
            <li>
              <Link to="/">
                <span className="HomeIcon"></span> Home
              </Link>
            </li>
            <li>
              <Link to="/about">
                <span className="AboutIcon"></span> About
              </Link>
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
                    <button onClick={handleSignOut} className="dropdown-item">
                      Sign Out
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                {location.pathname === '/SignIn' ? (
                  <Link to="/SignUp">
                    <span className="SignUp"></span> Sign Up
                  </Link>
                ) : (
                  <Link to="/SignIn">
                    <span className="Login"></span> Login
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './Header.css';
// import teamworkLogo from '../../../public/teamworkLogo.jpg';

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); //detect routes changes
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     } else {
//       setUser(null);
//     }
//   }, [location]);

//   const handleSignOut = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     setUser(null);
//     navigate('/signin');
//   };

//   return (
//     <header>
//       <nav className="navbar navbar-inverse">
//         <div className="container">
//           <div>
//             <img src={teamworkLogo} alt="Teamwork Logo" />
//           </div>
//           <div className="navbar-header">
//             <a className="navbar-brand" >
//               Team Collaboration Project
//             </a>
//           </div>

//           <ul className="nav navbar-nav navbar-right">
//             {user ? (
//               <>
//                 <li>
//                   <span className="navbar-text">{user.name}</span>
//                 </li>
//                 <li>
//                   <button  onClick={handleSignOut}>
//                     Sign Out
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li>
//                   <Link to="/SignUp">
//                     <span className="SignUp"></span> Sign Up
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/SignIn">
//                     <span className="Login"></span> Login
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
