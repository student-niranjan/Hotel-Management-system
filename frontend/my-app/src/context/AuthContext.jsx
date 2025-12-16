// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          setUser(decoded);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token } = response.data;

      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      setUser(decoded);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setError(null);

      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  // REGISTER
  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  // UPDATE PROFILE
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/update-profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  // CREATE OWNER
  const createOwner = async (ownerData) => {
    try {
      const response = await api.post('/create-owner', ownerData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  // CREATE STAFF
  const createStaff = async (staffData) => {
    try {
      const response = await api.post('/create-staff', staffData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        createOwner,
        createStaff,
        forgotPassword,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;