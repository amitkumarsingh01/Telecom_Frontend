// src/components/dashboard/TeleCallerDashboard.js
import React from 'react';
import AssignedStudents from '../students/AssignedStudents';

const TeleCallerDashboard = () => {
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">TeleCaller Dashboard</h1>
        <p className="text-gray-600 mb-4">View and update status of assigned students</p>
      </div>
      
      <AssignedStudents />
    </div>
  );
};

export default TeleCallerDashboard;