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
        <div className="flex flex-row w-full">
          <Link
            to="/admin/students"
            className="flex-1 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Manage Students
          </Link>
          <Link
            to="/admin/users"
            className="flex-1 text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/assign"
            className="flex-1 text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Assign Students
          </Link>
          <Link
            to="/admin/upload-students"
            className="flex-1 text-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 mx-1 rounded"
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