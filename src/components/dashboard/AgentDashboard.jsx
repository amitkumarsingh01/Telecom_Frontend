import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentList from '../students/StudentList';
import AddStudent from '../students/AddStudent';
import UploadStudents from '../students/UploadStudents';

const AgentDashboard = () => {
  return (
    <div>
<div className="bg-white shadow rounded-lg p-4 mb-6">
  <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row w-full">
          <Link
            to="/agent/students"
            className="flex-1 text-center bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            View Students
          </Link>
          <Link
            to="/agent/add-student"
            className="flex-1 text-center bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Add Student
          </Link>
          <Link
            to="/agent/upload-students"
            className="flex-1 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-2 px-2 mx-1 rounded"
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