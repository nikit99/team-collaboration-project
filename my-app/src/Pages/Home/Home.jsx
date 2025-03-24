import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../Components/Sidebar/Sidebar';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/SignIn');
    }
  }, [navigate]);

  return (
    <div>
      <SideBar />
      <div className="home-container">
        <h2 className="home-title">Welcome to the Home Page</h2>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
