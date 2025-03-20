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

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { resetPassword } from '../../api/authapi';

// const ResetPassword = () => {
//   const [email, setEmail] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     console.log("Reset Password form submitted");

//     try {
//       console.log("Sending request to backend...");
//       const response = await resetPassword({ email, currentPassword, newPassword });

//       console.log("Full Response from Backend:", response);

//       if (response.success) {
//         console.log("Password reset successful, logging out user...");
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("user");
//         navigate("/signin");
//       } else {
//         console.log("Error: Invalid response from server");
//         setError("Invalid response from server");
//       }
//     } catch (err) {
//       console.error("Reset Password Error:", err);
//       setError(err.error || "Password reset failed! Check console for details.");
//     }
//   };

//   return (
//     <div className="reset-password-container">
//       <h2>Reset Password</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleResetPassword}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Current Password"
//           value={currentPassword}
//           onChange={(e) => setCurrentPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="New Password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;
