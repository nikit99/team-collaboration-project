import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  return (
    <div className="home-container">
      {token && <SideBar />}
      <div className="home-content">
        <h1 className="home-title">Welcome to Team Collaboration App</h1>
        <p className="home-subtitle">Effortless collaboration for better project management.</p>

        {!token && (
          <div className="auth-message">
            <p>Sign in to access your workspace.</p>
            <button className="signin-btn" onClick={() => navigate('/SignIn')}>Sign In</button>
            <p className="signup-text">Don’t have an account? <span onClick={() => navigate('/SignUp')} className="signup-link">Sign Up</span></p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;

