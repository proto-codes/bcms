import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import PageLoader from '../components/PageLoader';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userProfilePics, setUserProfilePics] = useState(null);
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
          setUserProfilePics(response.data.profile_pics);
          if (response.data.newAccessToken) {
            localStorage.setItem('accessToken', response.data.newAccessToken);
          }
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setUserName(null);
          setUserProfilePics(null);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error validating token');
        setIsAuthenticated(false);
        setUserId(null);
        setUserName(null);
        setUserProfilePics(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserId(null);
      setUserName(null);
      setUserProfilePics(null);
    }
  };

  const logout = async () => {
    try {
      const response = await api.post('/logout');
      localStorage.removeItem('accessToken');
      toast.success(response.data.message);
      setIsAuthenticated(false);
      setUserId(null);
      setUserName(null);
      setUserProfilePics(null);
      window.location.href = '/auth/login';
    } catch (error) {
      toast.error(error.response?.data?.error || 'Logout error');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setLoading(false);
    };

    initializeAuth();

    const handleStorageChange = (event) => {
      if (event.key === 'accessToken') {
        checkAuth();
      }
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
    <AuthContext.Provider value={{ isAuthenticated, userId, userName, userProfilePics, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
