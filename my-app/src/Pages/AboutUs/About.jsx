import SideBar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        <p className="about-description">
          Welcome to <strong>Team Collaboration App</strong>, where seamless teamwork meets efficiency.
          Our platform is designed to enhance productivity, streamline communication, and empower teams to achieve their goals effortlessly.
        </p>

      </div>
      <Footer />
    </div>
  );
};

export default About;
