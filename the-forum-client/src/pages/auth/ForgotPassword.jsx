import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/forgot-password', { email: email.trim() });
      setSuccess('A password reset link has been sent to your email.');
      setEmail(''); // Clear the email input field
    } catch (error) {
      console.error('Error sending password reset link:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card border-0 p-4 shadow-lg" style={{ width: '350px' }}>
        <h2 className="text-center text-gold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={handleInputChange}
            />
          </div>
          {error && <p className="text-danger">{error}</p>} {/* Display error message */}
          {success && <p className="text-success">{success}</p>} {/* Display success message */}
          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="text-center mt-3">
          <small>Remember your password? <Link to="/auth/login" className='text-gold'>Login</Link></small>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
