import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleAuth } from '../../utils/authHandler';
import './Signin.css';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAuth('signin', formData, setError, navigate);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Sign In</h2>
        {error && <p className="signin-error">{error}</p>}
        <form onSubmit={handleSubmit} className="signin-form">
          <input type="email" name="email" className="signin-input" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" className="signin-input" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="signin-button">Sign In</button>
        </form>
        <p className="signin-text">Don't have an account? <Link to="/signup" className="signin-link">Sign Up</Link></p>
        <p className="signin-text"><Link to="/reset-password-request" className="signin-link">Forgot password?</Link></p>
      </div>
    </div>
  );
};

export default Signin;


// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { signin } from '../../api/authapi';
// import './Signin.css';

// const Signin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSignin = async (e) => {
//     e.preventDefault();
//     console.log('Form submitted');

//     try {
//       console.log('Sending request to backend...');
//       const response = await signin({ email, password });

//       console.log('Full Response from Backend:', response);

//       if (response.token) {
//         localStorage.setItem('authToken', response.token);
//         localStorage.setItem('user', JSON.stringify(response.user));
//         console.log('User data stored in localStorage:', response.user);
//         navigate('/');
//       } else {
//         console.log('Error: Invalid response from server');
//         setError('Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Signin Error:', err);
//       setError(err.error || 'Login failed! Check console for details.');
//     }
//   };

//   return (
//     <div className="signin-container">
//       <div className="signin-card">
//         <h2 className="signin-title">Sign In</h2>
//         {error && <p className="signin-error">{error}</p>}
//         <form onSubmit={handleSignin} className="signin-form">
//           <input
//             type="email"
//             className="signin-input"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             className="signin-input"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit" className="signin-button">
//             Sign In
//           </button>
//         </form>
//         <p className="signin-text">
//           Don't have an account?{' '}
//           <a href="/signup" className="signin-link">
//             Sign Up
//           </a>
//         </p>
//         <p className="signin-text">
//           <Link to="/reset-password-request" className="signin-link">
//             Forgot password?
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signin;
