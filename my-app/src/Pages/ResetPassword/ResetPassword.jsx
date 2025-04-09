
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';

const ResetPassword = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();

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
      navigate('/signin');
    } catch (error) {
      setMessage(error.error || 'Something went wrong!');
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">

        <div className="input-group">
          <label htmlFor="new-password" className="reset-password-label">New Password</label>
          <input
            type="password"
            id="new-password"
            className="reset-password-input"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirm-password" className="reset-password-label">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            className="reset-password-input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>

      {message && <p className="reset-password-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
