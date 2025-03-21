// import { useState } from 'react';
// import { requestPasswordReset } from '../../api/authapi';
// import './ResetPasswordRequest.css';
// import { useNavigate, Link } from 'react-router-dom';

// const ResetPasswordRequest = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   // const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await requestPasswordReset(email);
//       setMessage(data.message);
      
//     } catch (error) {
//       setMessage(error.error || 'Something went wrong!');
//     }
//   };

//   return (
//     <div className="reset-password-container">
//       <h2 className="reset-password-title">Reset Password</h2>
//       <form onSubmit={handleSubmit} className="reset-password-form">
//         <input
//           type="email"
//           className="reset-password-input"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit" className="reset-password-button">
//           Send Reset Link
//         </button>
//       </form>
//       {message && <p className="reset-password-message">{message}</p>}
//     </div>
//   );
// };

// export default ResetPasswordRequest;
import { useState } from 'react';
import { requestPasswordReset } from '../../api/authapi';
import './ResetPasswordRequest.css';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
        <button type="submit" className="reset-password-button">
          Send Reset Link
        </button>
      </form>
      {message && <p className="reset-password-message">{message}</p>}
    </div>
  );
};

export default ResetPasswordRequest;
