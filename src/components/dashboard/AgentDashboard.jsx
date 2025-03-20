// src/components/dashboard/AgentDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentList from '../students/StudentList';
import AddStudent from '../students/AddStudent';
import UploadStudents from '../students/UploadStudents';
// import UploadStudents from '../students/UploadStudents';

const AgentDashboard = () => {
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            to="/agent/students"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Students
          </Link>
          <Link
            to="/agent/add-student"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Student
          </Link>
          <Link
            to="/agent/upload-students"
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload Students
          </Link>
        </div>
      </div>
      
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/upload-students" element={<UploadStudents />} />
      </Routes>
    </div>
  );
};

export default AgentDashboard;