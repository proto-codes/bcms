import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';

function Register() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    setValidated(false);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checkPasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = 8;

    if (password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      setPasswordStrength('Strong');
    } else if (password.length >= minLength && (hasUpperCase || hasLowerCase) && (hasNumbers || hasSpecialChars)) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Low');
    }
  };

  const register = async (event) => {
    event.preventDefault();
    setLoading(true);
    setValidated(false);

    const { name, email, password, password_confirmation } = userData;

    if (!name.trim() || !email.trim() || !password || !password_confirmation) {
      setValidated(true);
      toast.error('Please fill in all the fields!');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setValidated(true);
      toast.error('Invalid email format!');
      setLoading(false);
      return;
    }

    if (password !== password_confirmation) {
      setValidated(true);
      toast.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/public/register', {
        name,
        email,
        password: password.trim(),
        password_confirmation: password_confirmation.trim(),
      });

      toast.success(response.data.message || 'Registration successful! Check your email for a confirmation code.');
      localStorage.setItem('accessToken', response.data.accessToken);

      setTimeout(() => {
        window.location.href = '/verify-account';
      }, 3000);

      setUserData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center py-3">
      <div className="card border-0 p-3 shadow-lg" style={{ width: '500px' }}>
        <h4 className="text-center text-gold mb-2">BCMS</h4>
        <p className="text-center mb-3">Create Your Account</p>
        <form onSubmit={register} noValidate>
          <div className="row g-2">
            {/* Name Field */}
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="name"
                  placeholder="Full Name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="name">Full Name</label>
              </div>
            </div>

            {/* Email Field */}
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={handleInputChange}
                  autoComplete="on"
                />
                <label htmlFor="email">Email Address</label>
              </div>
            </div>

            {/* Password Field */}
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2 position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                <label htmlFor="password">Password</label>
                {passwordStrength && (
                  <div className={`mt-1 ${passwordStrength === 'Strong' ? 'text-success' : passwordStrength === 'Medium' ? 'text-warning' : 'text-danger'}`}>
                    Password strength: {passwordStrength}
                  </div>
                )}
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y pe-2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Confirmation Field */}
            <div className="col-md-6 col-12">
              <div className="form-floating mb-2 position-relative">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  name="password_confirmation"
                  className="form-control"
                  id="password_confirmation"
                  placeholder="Confirm Password"
                  value={userData.password_confirmation}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                <label htmlFor="password_confirmation">Confirm Password</label>
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y pe-2"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  aria-label={showPasswordConfirmation ? 'Hide confirmation password' : 'Show confirmation password'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPasswordConfirmation ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button type="submit" className="btn btn-outline-gold w-100" disabled={loading}>
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

        {/* Link to Login page */}
        <div className="text-center mt-2">
          <small>Already have an account? <Link to="/auth/login" className="text-decoration-none text-gold">Login</Link></small>
        </div>
      </div>
    </div>
  );
}

export default Register;
