import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [tokenExists, setTokenExists] = useState(true);

  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const navigate = useNavigate();

  // Check if token exists when the component mounts
  useEffect(() => {
    if (!token) {
      toast.error('Verification token is missing.');
      setTokenExists(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidated(true);

    // Validation checks
    if (!newPassword || !passwordConfirmation) {
      toast.error('Both password fields are required');
      setLoading(false);
      return;
    }

    if (newPassword !== passwordConfirmation) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/public/reset-password', {
        token,
        newPassword,
        passwordConfirmation
      });
      toast.success(response.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An unexpected error occurred. Please try again.');
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
                className={`form-control ${validated && !newPassword ? 'is-invalid' : ''}`}
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
                className={`form-control ${validated && !passwordConfirmation ? 'is-invalid' : ''}`}
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
          <p className="text-danger text-center">{'Verification token is missing.'}</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
