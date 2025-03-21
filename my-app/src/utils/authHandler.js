
import { signup, signin } from '../api/authapi';

export const handleAuth = async (type, formData, setError, navigate) => {
  try {
    let response;
    if (type === 'signup') {
      response = await signup(formData);
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
      navigate('/');
    } else {
      setError(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } successful, but login failed!`
      );
      navigate('/signin');
    }
  } catch (err) {
    console.error(`${type} Error:`, err);
    console.log('Full error object:', err); 
  
    setError(err.error || 'Something went wrong!');
  }
  
};
