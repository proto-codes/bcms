import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import PageLoader from '../components/PageLoader';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await api.post('/validate-token');

          if (response.status === 200) {
            setIsAuthenticated(true);
            setUserId(response.data.user.id);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();

    // Set up an event listener for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
