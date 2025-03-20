// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token && userType) {
      setUser({ token, userType });
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post('https://telecom-kappa.vercel.app/api/login', {
        username,
        password
      });
      
      const { token, userType } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      
      // Update state
      setUser({ token, userType });
      
      return { success: true, userType };
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username, password, userType) => {
    try {
      setError(null);
      await axios.post('https://telecom-kappa.vercel.app/api/register', {
        username,
        password,
        userType
      });
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
