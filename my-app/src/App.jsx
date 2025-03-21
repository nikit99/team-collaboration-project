import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './Pages/SignUp/SignUp';
import SignIn from './Pages/SignIn/SignIn';
import Home from './Pages/Home/Home';
import ResetPasswordRequest from './Pages/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from './Pages/ResetPassword/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/reset-password-request"
          element={<ResetPasswordRequest />}
        />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        />
      </Routes>
    </Router>
  );
}

export default App;
