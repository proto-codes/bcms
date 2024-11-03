import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setValidated(false);

    // Validate email field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Email is required');
      setValidated(true);
      setLoading(false);
      return;
    } else if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      setValidated(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/public/forgot-password', { email: email.trim() });
      setSuccess(response.data.message);
      setEmail('');
      setValidated(false);
    } catch (error) {
      console.error('Error sending password reset link:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
      setValidated(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center py-3">
      <div className="card border-0 p-3 shadow-lg" style={{ width: '400px' }}>
        <h4 className="text-center text-gold mb-3">Forgot Password</h4>
        <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${validated && error ? 'is-invalid' : ''} ${success ? 'is-valid' : ''}`}
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange}
            />
            <label htmlFor="email">Email address</label>
            {validated && error && (
              <div className="invalid-feedback" aria-live="polite">{error}</div>
            )}
            {success && (
              <div className="valid-feedback" aria-live="polite">{success}</div>
            )}
          </div>
          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        <div className="text-center mt-2">
          <small>Remember your password? <Link to="/auth/login" className="text-gold">Login</Link></small>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
