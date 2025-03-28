

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../api/authapi';
import './ResetPasswordRequest.css';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.error || 'Something went wrong!');
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="input-group">
          <label htmlFor="email" className="reset-password-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="reset-password-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="reset-password-button">
            Send Reset Link
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/signin')}
          >
            Cancel
          </button>
        </div>
      </form>
      {message && <p className="reset-password-message">{message}</p>}
    </div>
  );
};

export default ResetPasswordRequest;
