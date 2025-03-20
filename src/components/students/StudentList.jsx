// src/components/students/StudentList.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://telecom-kappa.vercel.app/api/students', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching students: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user.token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://telecom-kappa.vercel.app/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        // Update state
        setStudents(students.filter(student => student._id !== id));
      } catch (err) {
        setError('Error deleting student: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Student List</h2>
      
      {students.length === 0 ? (
        <p className="text-gray-500">No students found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Assigned To</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {students.map((student) => (
                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{student.name}</td>
                  <td className="py-3 px-6 text-left">{student.email}</td>
                  <td className="py-3 px-6 text-left">{student.phone}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${student.status === 'approved' ? 'bg-green-200 text-green-800' : 
                        student.status === 'rejected' ? 'bg-red-200 text-red-800' : 
                        'bg-yellow-200 text-yellow-800'}
                    `}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {student.assignedTo ? 
                      (typeof student.assignedTo === 'object' ? 
                        student.assignedTo.username : 
                        'Assigned') : 
                      'Not Assigned'}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {(user.userType === 'Admin' || 
                      (user.userType === 'Agent' && 
                        (student.addedBy && student.addedBy._id === user.id))) && (
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;