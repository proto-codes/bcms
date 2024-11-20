import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import PageLoader from '../components/PageLoader';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Invalid token format:', error);
      return true;
    }
  };

  const checkAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && !isTokenExpired(accessToken)) {
      try {
        const response = await api.post('/validate-token');
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserId(response.data.user.id);
          setUserName(response.data.user.name);
          if (response.data.newAccessToken) {
            localStorage.setItem('accessToken', response.data.newAccessToken);
          }
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setUserName(null);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsAuthenticated(false);
        setUserId(null);
        setUserName(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserId(null);
      setUserName(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUserId(null);
    setUserName(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setLoading(false);
    };

    initializeAuth();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userName, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
