// src/components/dashboard/Dashboard.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user type
      switch (user.userType) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Agent':
          navigate('/agent');
          break;
        case 'TeleCaller':
          navigate('/telecaller');
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Telecom CRM</h1>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;