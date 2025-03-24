import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './Pages/SignUp/SignUp';
import SignIn from './Pages/SignIn/SignIn';
import Home from './Pages/Home/Home';
import ResetPasswordRequest from './Pages/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import Header from './Components/Header/Header';
import Workspace from './Pages/Workspace/Workspace';
import WorkspaceForm from './Pages/WorkspaceForm/WorkspaceForm';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
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

        <Route path="/workspaces" element={<Workspace />} />
        <Route path="/create-workspace" element={<WorkspaceForm />} />
        <Route path="/edit-workspace/:id" element={<WorkspaceForm />} />
        
       
      </Routes>
    </Router>
  );
}

export default App;
