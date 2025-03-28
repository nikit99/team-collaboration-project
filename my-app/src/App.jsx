import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './Pages/SignUp/SignUp';
import SignIn from './Pages/SignIn/SignIn';
import Home from './Pages/Home/Home';
import About from './Pages/AboutUs/About';
import ResetPasswordRequest from './Pages/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import User from './Pages/Users/Users';
import Header from './Components/Header/Header';
import Workspace from './Pages/Workspace/Workspace';
import WorkspaceForm from './Pages/WorkspaceForm/WorkspaceForm';
import Projects from './Pages/Projects/Projects';
import ProjectForm from './Pages/ProjectForm/ProjectForm';

import ProjectDemo from './Pages/Projects Demo/ProjectDemo';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route
          path="/reset-password-request"
          element={<ResetPasswordRequest />}
        />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        />
        <Route path="/users" element={<User />} />
       
        <Route path="/workspaces" element={<Workspace />} />
        <Route path="/workspaces/all" element={<Workspace />} />
        <Route path="/workspaces/myworkspace" element={<Workspace />} />
        <Route path="/workspaces/:viewType" component={Workspace} />

        <Route path="/create-workspace" element={<WorkspaceForm />} />
        <Route path="/edit-workspace/:id" element={<WorkspaceForm />} />

        
        
        <Route path="/Projects" element={<Projects />} />
        <Route path="/ProjectForm" element={<ProjectForm />} />
        <Route path="/edit-project/:id" element={<ProjectForm />} /> 

        <Route path="ProjectDemo" element={<ProjectDemo />} />
        <Route path="ProjectDemo/all" element={<ProjectDemo />} />
        <Route path="/ProjectDemo/:workspaceId" element={<ProjectDemo />} />
       
      </Routes>
    </Router>
  );
}

export default App;
