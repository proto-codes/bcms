import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function Login() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const login = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setValidated(false);

    const { email, password } = userData;

    if (!email.trim() || !password) {
      setValidated(true);
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setValidated(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/public/login', userData);
      setSuccess(response.data.message || 'Login successful!');
      localStorage.setItem('token', response.data.token);

      setTimeout(() => {
        window.location.href = '/'; // Redirect to the dashboard page
      }, 2000);

      setUserData({
        email: '',
        password: '',
      });
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
      setValidated(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center py-3">
      <div className="card border-0 p-3 shadow-lg" style={{ width: '400px' }}>
        <h4 className="text-center text-gold mb-2">The Forum</h4>
        <p className="text-center mb-3">Login to Your Account</p>
        <form onSubmit={login} noValidate>
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              className={`form-control ${validated && (!userData.email || !emailRegex.test(userData.email.trim())) ? 'is-invalid' : ''}`}
              id="email"
              placeholder="Email address"
              autoComplete="on"
              value={userData.email}
              onChange={handleInputChange}
              aria-required="true"
              aria-describedby="emailHelp"
            />
            <label htmlFor="email">Email address</label>
            {validated && !userData.email && <div className="invalid-feedback">Email is required</div>}
            {validated && userData.email && !emailRegex.test(userData.email.trim()) && <div className="invalid-feedback">Please enter a valid email address</div>}
          </div>
          <div className="form-floating mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control ${validated && !userData.password ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              aria-required="true"
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="btn position-absolute top-50 end-0 translate-middle-y pe-2"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
            {validated && !userData.password && <div className="invalid-feedback">Password is required</div>}
          </div>
          {error && <p className="text-danger" aria-live="assertive">{error}</p>}
          {success && <p className="text-success" aria-live="assertive">{success}</p>}
          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <small className="mt-2 text-center">
          <Link to="/auth/forgot-password" className="text-gold">Forgot password?</Link>
        </small>
        <div className="text-center mt-2">
          <small>Don't have an account? <Link to="/auth/register" className="text-gold">Register</Link></small>
        </div>
      </div>
    </div>
  );
}

export default Login;
