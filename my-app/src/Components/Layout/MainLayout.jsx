import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import SideBar from '../Sidebar/Sidebar';
import './MainLayout.css';

export default function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user'); 
    setIsAuthenticated(!!user);
  }, [location]); 

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-container">

      <Header toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      <div className={`main-content-wrapper ${!isAuthenticated ? 'full-width' : ''}`}>
        {isAuthenticated && <SideBar collapsed={sidebarCollapsed} />}
        
        <main className={`content-area ${!isAuthenticated ? 'full' : sidebarCollapsed ? 'collapsed' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
