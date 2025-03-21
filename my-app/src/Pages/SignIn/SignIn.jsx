import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleAuth } from '../../utils/authHandler';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Signin.css';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="input-group">
            <label htmlFor="email" className="signin-label">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="signin-input" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="signin-label">Password</label>
            <div className="input-container">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                className="signin-input password-input" 
                placeholder="Enter your password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <FaEye 
                className={`eye-icon ${showPassword ? 'hidden' : ''}`} 
                onClick={() => setShowPassword(true)} 
              />
              <FaEyeSlash 
                className={`eye-icon ${showPassword ? '' : 'hidden'}`} 
                onClick={() => setShowPassword(false)} 
              />
            </div>
          </div>
          
          <button type="submit" className="signin-button">Sign In</button>
        </form>
        <p className="signin-text">Don't have an account? <Link to="/signup" className="signin-link">Sign Up</Link></p>
        <p className="signin-text"><Link to="/reset-password-request" className="signin-link">Forgot password?</Link></p>
      </div>
    </div>
  );
  // return (
  //   <div className="signin-container">
  //     <div className="signin-card">
  //       <h2 className="signin-title">Sign In</h2>
  //       {error && <p className="signin-error">{error}</p>}
  //       <form onSubmit={handleSubmit} className="signin-form">
  //         <input 
  //           type="email" 
  //           name="email" 
  //           className="signin-input" 
  //           placeholder="Email" 
  //           value={formData.email} 
  //           onChange={handleChange} 
  //           required 
  //         />
  //         <div className="input-container">
  //           <input 
  //             type={showPassword ? "text" : "password"} 
  //             name="password" 
  //             className="signin-input password-input" 
  //             placeholder="Password" 
  //             value={formData.password} 
  //             onChange={handleChange} 
  //             required 
  //           />
  //           <FaEye 
  //             className={`eye-icon ${showPassword ? 'hidden' : ''}`} 
  //             onClick={() => setShowPassword(true)} 
  //           />
  //           <FaEyeSlash 
  //             className={`eye-icon ${showPassword ? '' : 'hidden'}`} 
  //             onClick={() => setShowPassword(false)} 
  //           />
  //         </div>
  //         <button type="submit" className="signin-button">Sign In</button>
  //       </form>
  //       <p className="signin-text">Don't have an account? <Link to="/signup" className="signin-link">Sign Up</Link></p>
  //       <p className="signin-text"><Link to="/reset-password-request" className="signin-link">Forgot password?</Link></p>
  //     </div>
  //   </div>
  // );
};

export default Signin;

