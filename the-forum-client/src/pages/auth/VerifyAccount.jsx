import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function VerifyAccount() {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract token from the URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      verifyToken(token);
    } else {
      setMessage({ text: 'Verification token is missing.', type: 'error' });
      setLoading(false);
    }
  }, [location.search]);

  // Function to verify the token
  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5000/public/verify-account?token=${token}`);
      setMessage({ text: response.data.message || 'Account confirmed successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Invalid or expired token.', type: 'error' });
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
          <p className={`${message.type === 'error' ? 'text-danger' : 'text-success'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyAccount;
