import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function Register() {
  const isAuthenticated = localStorage.getItem('token');

  if (isAuthenticated) {
    window.location.href = '/';
  }

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setValidated(false); // Reset validation state on input change
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex

  const register = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    setValidated(false); // Reset validated state

    const { name, email, password, password_confirmation } = userData;

    // Validation
    if (!name.trim() || !email.trim() || !password || !password_confirmation) {
      setError('All fields are required.');
      setValidated(true);
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError('Invalid email format.');
      setValidated(true);
      setLoading(false);
      return;
    }

    if (password !== password_confirmation) {
      setError('Passwords do not match.');
      setValidated(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/public/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password.trim(),
        password_confirmation: userData.password_confirmation.trim(),
      });

      setSuccess(response.data.message || 'Registration successful!');
      localStorage.setItem('token', response.data.token);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

      setUserData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center py-3">
      <div className="card border-0 p-3 shadow-lg" style={{ width: '400px' }}>
        <h4 className="text-center text-gold mb-2">The Forum</h4>
        <p className="text-center mb-3">Create Your Account</p>
        <form noValidate onSubmit={register}>
          <div className="row g-2">
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2">
                <input
                  type="text"
                  name="name"
                  className={`form-control ${validated && !userData.name.trim() ? 'is-invalid' : ''}`}
                  id="name"
                  placeholder="Full Name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="name">Full Name</label>
                {validated && !userData.name.trim() && (
                  <div className="invalid-feedback">Please enter your name.</div>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2">
                <input
                  type="email"
                  name="email"
                  className={`form-control ${validated && !userData.email.trim() ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={handleInputChange}
                />
                <label htmlFor="email">Email Address</label>
                {validated && !userData.email.trim() && (
                  <div className="invalid-feedback">Please enter your email.</div>
                )}
                {validated && userData.email && !emailRegex.test(userData.email.trim()) && (
                  <div className="invalid-feedback">Invalid email format.</div>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2 position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control ${validated && !userData.password ? 'is-invalid' : ''}`}
                  id="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleInputChange}
                />
                <label htmlFor="password">Password</label>
                {validated && !userData.password && (
                  <div className="invalid-feedback">Please enter your password.</div>
                )}
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2 position-relative">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  name="password_confirmation"
                  className={`form-control ${validated && !userData.password_confirmation ? 'is-invalid' : ''}`}
                  id="password_confirmation"
                  placeholder="Confirm Password"
                  value={userData.password_confirmation}
                  onChange={handleInputChange}
                />
                <label htmlFor="password_confirmation">Confirm Password</label>
                {validated && !userData.password_confirmation && (
                  <div className="invalid-feedback">Please confirm your password.</div>
                )}
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-2"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  aria-label={showPasswordConfirmation ? 'Hide confirmation password' : 'Show confirmation password'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPasswordConfirmation ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <div className="text-center mt-2">
          <small>Already have an account? <Link to="/auth/login" className="text-gold">Login</Link></small>
        </div>
      </div>
    </div>
  );
}

export default Register;
