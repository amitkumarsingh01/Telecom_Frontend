// src/components/dashboard/AdminDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentList from '../students/StudentList';
import UserList from '../users/UserList';
import AssignStudents from '../students/AssignStudents';

const AdminDashboard = () => {
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            to="/admin/students"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Students
          </Link>
          <Link
            to="/admin/users"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/assign"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Assign Students
          </Link>
        </div>
      </div>
      
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/assign" element={<AssignStudents />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;