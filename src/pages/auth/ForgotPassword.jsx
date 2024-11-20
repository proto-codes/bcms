import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setValidated(false);

    // Validate email field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setValidated(true);
      toast.error('Email is required');
      setLoading(false);
      return;
    } else if (!emailRegex.test(email.trim())) {
      setValidated(true);
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/public/forgot-password', { email: email.trim() });
      toast.success(response.data.message || 'Password reset link sent successfully');
      setEmail(''); // Clear the email field after success
      setValidated(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
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
              className={`form-control ${validated && !email.trim() ? 'is-invalid' : ''}`}
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange}
            />
            <label htmlFor="email">Email address</label>
          </div>
          <button type="submit" className="btn btn-outline-gold w-100" disabled={loading}>
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
          <small>Remember your password? <Link to="/auth/login" className="text-decoration-none text-gold">Login</Link></small>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
