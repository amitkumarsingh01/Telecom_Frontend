import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentList from '../students/StudentList';
import UserList from '../users/UserList';
import AssignStudents from '../students/AssignStudents';
import UploadStudents from '../students/UploadStudents';

const AdminDashboard = () => {
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row w-full">
          <Link
            to="/admin/students"
            className="flex-1 text-center bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Manage Students
          </Link>
          <Link
            to="/admin/users"
            className="flex-1 text-center bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/assign"
            className="flex-1 text-center bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Assign Students
          </Link>
          <Link
            to="/admin/upload-students"
            className="flex-1 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Upload Students
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/assign" element={<AssignStudents />} />
        <Route path="/upload-students" element={<UploadStudents />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;