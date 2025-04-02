
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './Components/Layout/MainLayout';
import AppRoutes from './Routes/AppRoutes';

// import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
