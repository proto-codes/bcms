import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth }) => {
  const { isAuthenticated } = useAuth();

  if (requireAuth && !isAuthenticated) {
    // Redirect to Login if trying to access a protected route without being authenticated
    return <Navigate to="/auth/login" />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to Dashboard if trying to access public routes while authenticated
    return <Navigate to="/" />;
  }

  return children; // Render the children (the protected component)
};

export default ProtectedRoute;
