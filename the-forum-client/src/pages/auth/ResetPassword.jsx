import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [tokenExists, setTokenExists] = useState(true);

  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const navigate = useNavigate();

  // Check if token exists when the component mounts
  useEffect(() => {
    if (!token) {
      setError('Verification token is missing.');
      setTokenExists(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setValidated(true);

    // Validation checks
    if (!newPassword || !passwordConfirmation) {
      setLoading(false);
      return;
    }

    if (newPassword !== passwordConfirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/public/reset-password', {
        token,
        newPassword,
        passwordConfirmation
      });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center py-3">
      <div className="card border-0 p-3 shadow-lg" style={{ width: '400px' }}>
        <h4 className="text-center text-gold mb-3">Reset Password</h4>
        {tokenExists ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={`form-control ${validated && (error || !newPassword) ? 'is-invalid' : ''} ${success ? 'is-valid' : ''}`}
                id="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor="newPassword">New Password</label>
              {validated && !newPassword && (
                <div className="invalid-feedback" aria-live="polite">New password is required.</div>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={`form-control ${validated && (error || !passwordConfirmation) ? 'is-invalid' : ''} ${success ? 'is-valid' : ''}`}
                id="passwordConfirmation"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              <label htmlFor="passwordConfirmation">Confirm Password</label>
              {validated && !passwordConfirmation && (
                <div className="invalid-feedback" aria-live="polite">Password confirmation is required.</div>
              )}
            </div>
            {error && <p className="text-danger" aria-live="polite">{error}</p>}
            {success && <p className="text-success" aria-live="polite">{success}</p>}
            <button type="submit" className="btn btn-gold w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          <p className="text-danger text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
