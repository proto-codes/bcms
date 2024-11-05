import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyAccount() {
  const [message, setMessage] = useState({ text: 'error', type: 'error' });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from the URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      verifyToken(token);
    } else {
      setMessage({
        text: 'Verification token is missing. Please check your email for a verification link or request a new verification token.',
        type: 'error',
      });
      setLoading(false);
    }
  }, [location.search]);

  // Function to verify the token
  const verifyToken = async (token) => {
    try {
      const response = await api.get(`/verify-account?token=${token}`);
      setMessage({ text: response.data.message || 'Account confirmed successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Function to request a new verification token
  const requestNewToken = async () => {
    setLoading(true);
    try {
      const response = await api.post('/request-verification-token');
      setMessage({ text: response.data.message || 'A new verification token has been sent to your email.', type: 'success' });
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Error requesting verification token. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-100 d-flex justify-content-center align-items-center py-3">
      <div className="card border-0 p-3 shadow-lg text-center" style={{ width: '400px' }}>
        <h4 className="text-gold mb-3">Account Verification</h4>
        {loading ? (
          <p>Verifying your account...</p>
        ) : (
          <div>
            <p className={`${message.type === 'error' ? 'text-danger' : 'text-success'}`}>
              {message.text}
            </p>
            {message.type === 'error' && (
              <div>
                <p>If you haven't received a verification email, you can request a new verification token.</p>
                <button className="btn btn-primary" onClick={requestNewToken}>
                  Request New Verification Token
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyAccount;
