import { signup, signin } from '../api/authApi';

export const handleAuth = async (type, formData, setError, navigate) => {
  try {
    let response;
    if (type === 'signup') {
      response = await signup(formData);
      console.log('Signup Response:', response);
      navigate('/signin'); 
      return;
    } else if (type === 'signin') {
      response = await signin({
        email: formData.email,
        password: formData.password,
      });
    }

    console.log(`${type} Response:`, response);

    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('User data stored in localStorage:', response.user);
      navigate('/'); // Navigate to home only after successful sign-in
    } else {
      setError('Login failed!');
      navigate('/signin');
    }
  } catch (err) {
    console.error(`${type} Error:`, err);
    setError(err.error || 'Something went wrong!');
  }
};
