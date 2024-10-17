import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const isAuthenticated = localStorage.getItem('token');

  if (isAuthenticated) {
    window.location.href = '/'
  }
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const register = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true

    // Basic validation
    if (userData.password !== userData.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password.trim(),
        password_confirmation: userData.password_confirmation.trim(),
      });

      console.log('Registration successful:', response.data);
      // Clear form fields
      setUserData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
      setError(''); // Clear any previous errors
      
      // Store the token for authenticated requests
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard page
      window.location.href = '/';
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center my-3">
        <div className="card border-0 p-4 shadow-lg" style={{ width: '350px' }}>
          <h2 className="text-center text-gold-dark mb-4">Register</h2>
          <form onSubmit={register}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                id="name"
                placeholder="Enter full name"
                required
                autoComplete='on'
                value={userData.name}
                onChange={handleInputChange}
              />
            </div>
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
            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                className="form-control"
                id="password_confirmation"
                placeholder="Confirm password"
                required
                value={userData.password_confirmation}
                onChange={handleInputChange}
              />
            </div>
            {error && <p className="text-danger">{error}</p>} {/* Display error message */}
            <button type="submit" className="btn btn-gold-dark w-100" disabled={loading}>
              {loading ? 'Registering...' : 'Register'} {/* Button text changes based on loading state */}
            </button>
          </form>
          <div className="text-center mt-3">
            <small>Already have an account? <Link to="/auth/login" className='text-gold-dark'>Login</Link></small>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
