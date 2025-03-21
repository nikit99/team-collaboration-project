import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleAuth } from '../../utils/authHandler';
import './SignUp.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match!');
      return;
    }
    await handleAuth('signup', formData, setError, navigate);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        {error && <p className="signup-error">{error}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="signup-input" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="signup-input" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="signup-input" />
          <input type="password" name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} required className="signup-input" />
          <div className="signup-role">
            <label className="role-label">Role:</label>
            <div className="role-options">
              <label>
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} />
                <span>User</span>
              </label>
              <label>
                <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} />
                <span>Admin</span>
              </label>
            </div>
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="signup-text">Already have an account? <Link to="/signin" className="signup-link">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Signup;



// import { useState } from 'react';
// import { signup } from '../../api/authapi';
// import { useNavigate, Link } from 'react-router-dom';
// import './SignUp.css';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirm_password: '',
//     role: '',
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirm_password) {
//       setError('Passwords do not match!');
//       return;
//     }

//     try {
//       const response = await signup(formData);
//       console.log('Signup Response:', response);

//       if (response.token) {
//         localStorage.setItem('authToken', response.token);
//         localStorage.setItem('user', JSON.stringify(response.user));
//         console.log('User data stored in localStorage:', response.user);
//         navigate('/');
//       } else {
//         setError('Signup successful, but login failed!');
//         navigate('/signin');
//       }
//     } catch (err) {
//       console.error('Signup Error:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Something went wrong!');
//       }
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-card">
//         <h2 className="signup-title">Sign Up</h2>
//         {error && <p className="signup-error">{error}</p>}
//         <form onSubmit={handleSubmit} className="signup-form">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="signup-input"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="signup-input"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="signup-input"
//           />

//           <input
//             type="password"
//             name="confirm_password"
//             placeholder="Confirm Password"
//             value={formData.confirm_password}
//             onChange={handleChange}
//             required
//             className="signup-input"
//           />

//           <div className="signup-role">
//             <label className="role-label">Role:</label>
//             <div className="role-options">
//               <label>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="user"
//                   checked={formData.role === 'user'}
//                   onChange={handleChange}
//                 />
//                 <span>User</span>
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="admin"
//                   checked={formData.role === 'admin'}
//                   onChange={handleChange}
//                 />
//                 <span>Admin</span>
//               </label>
//             </div>
//           </div>

//           <button type="submit" className="signup-button">
//             Sign Up
//           </button>
//         </form>

//         <p className="signup-text">
//           Already have an account?{' '}
//           <Link to="/signin" className="signup-link">
//             Sign In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
