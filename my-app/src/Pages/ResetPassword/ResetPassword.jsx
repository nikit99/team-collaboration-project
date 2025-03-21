import { useState } from 'react';
import { useParams } from 'react-router-dom';
//import { resetPassword } from "../api";
import { resetPassword } from '../../api/authapi';

const ResetPassword = () => {
  const { userId, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword(userId, token, {
        password,
        confirm_password: confirmPassword,
      });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.error || 'Something went wrong!');
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="password"
          className="reset-password-input"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="reset-password-input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>
      {message && <p className="reset-password-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;

