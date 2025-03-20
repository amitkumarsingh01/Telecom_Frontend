// src/components/students/AssignedStudents.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AssignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const response = await axios.get('https://telecom-kappa.vercel.app/api/assigned-students', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching assigned students: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchAssignedStudents();
  }, [user.token]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(
        `https://telecom-kappa.vercel.app/api/students/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      // Update state
      setStudents(students.map(student => 
        student._id === id ? { ...student, status: response.data.status } : student
      ));

      // Reset editing state
      setEditingStudent(null);
    } catch (err) {
      setError('Error updating student: ' + (err.response?.data?.error || err.message));
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
      <h2 className="text-xl font-bold mb-4">Assigned Students</h2>
      
      {students.length === 0 ? (
        <p className="text-gray-500">No students have been assigned to you yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {students.map((student) => (
                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{student.name}</td>
                  <td className="py-3 px-6 text-left">{student.email}</td>
                  <td className="py-3 px-6 text-left">{student.phone}</td>
                  <td className="py-3 px-6 text-left">{student.description || '-'}</td>
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
                  <td className="py-3 px-6 text-center">
                    {editingStudent === student._id ? (
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleStatusChange(student._id, 'approved')}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(student._id, 'rejected')}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusChange(student._id, 'pending')}
                          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => setEditingStudent(null)}
                          className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingStudent(student._id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Update Status
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

export default AssignedStudents;