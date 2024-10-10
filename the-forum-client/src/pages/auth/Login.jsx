import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function Login() {
  const isAuthenticated = !!localStorage.getItem('token');

  if (isAuthenticated) {
    window.location.href = '/dashboard'
  }
  
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  
  const login = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state  
    try {
      const response = await api.post('login', userData);
      
      console.log('Login successful:', response.data);
      
      // Clear user input fields
      setUserData({
        email: '',
        password: '',
      });
      
      // Clear any previous error messages
      setError('');
      
      // Store the token for authenticated requests
      localStorage.setItem('token', response.data.token);
      
      // Redirect to the dashboard page
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      
      // Set error message for display
      setError(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center my-3">
        <div className="card border-0 p-4 shadow-lg" style={{ width: '350px' }}>
          <h2 className="text-center text-info mb-4">Login</h2>
          <form onSubmit={login}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                required
                autoComplete='on'
                value={userData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                required
                value={userData.password}
                onChange={handleInputChange}
              />
            </div>
            {error && <p className="text-danger">{error}</p>} {/* Display error message */}
            <button type="submit" className="btn btn-info w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <small className='mt-3 text-center'><Link to="#" className='text-info'>Forgotten password?</Link></small>
          <div className="text-center mt-3">
            <small>Don't have an account? <Link to="/auth/register" className='text-info'>Register</Link></small>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
