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
        <div className="flex flex-row w-full">
          <Link
            to="/agent/students"
            className="flex-1 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            View Students
          </Link>
          <Link
            to="/agent/add-student"
            className="flex-1 text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 mx-1 rounded"
          >
            Add Student
          </Link>
          <Link
            to="/agent/upload-students"
            className="flex-1 text-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 mx-1 rounded"
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