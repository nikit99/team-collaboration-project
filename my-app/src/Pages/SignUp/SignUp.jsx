import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleAuth } from '../../utils/authHandler';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUp.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    
    await handleAuth('signup', formData, (errorMsg) => {
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, navigate);
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <label htmlFor="name" className="signup-label">Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Enter your full name"  
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="signup-input" 
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="signup-label">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"  
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="signup-input" 
            />
          </div>

          <div className="input-group input-container">
            <label htmlFor="password" className="signup-label">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              id="password"
              name="password" 
              placeholder="Enter your password" 
              className="signup-input password-input" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            {showPassword ? (
              <FaEyeSlash className="eye-icons" onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye className="eye-icons" onClick={() => setShowPassword(true)} />
            )}
          </div>

          <div className="input-group input-container">
            <label htmlFor="confirm_password" className="signup-label">Confirm Password</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              id="confirm_password"
              name="confirm_password" 
              placeholder="Confirm your password" 
              className="signup-input password-input" 
              value={formData.confirm_password} 
              onChange={handleChange} 
              required 
            />
            {showConfirmPassword ? (
              <FaEyeSlash className="eye-icons" onClick={() => setShowConfirmPassword(false)} />
            ) : (
              <FaEye className="eye-icons" onClick={() => setShowConfirmPassword(true)} />
            )}
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="signup-text">Already have an account? <Link to="/SignIn" className="signup-lnk">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Signup;
