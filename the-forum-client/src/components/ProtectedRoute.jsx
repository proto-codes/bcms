import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/PageLoader'; // Import your PageLoader component

const ProtectedRoute = ({ children, requireAuth }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <PageLoader />; // Use PageLoader while auth status is being checked
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
