// src/components/auth/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.userType !== requiredRole) {
    // Redirect to appropriate dashboard
    switch (user.userType) {
      case 'Admin':
        return <Navigate to="/admin" replace />;
      case 'Agent':
        return <Navigate to="/agent" replace />;
      case 'TeleCaller':
        return <Navigate to="/telecaller" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;