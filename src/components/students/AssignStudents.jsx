// src/components/students/AssignStudents.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AssignStudents = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [telecallers, setTelecallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useContext(AuthContext);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTelecaller, setSelectedTelecaller] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get('https://telecom-kappa.vercel.app/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setUsers(usersResponse.data);
        
        // Filter telecallers
        setTelecallers(usersResponse.data.filter(u => u.userType === 'TeleCaller'));
        
        // Fetch students
        const studentsResponse = await axios.get('https://telecom-kappa.vercel.app/api/students', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        // Filter unassigned students
        setStudents(studentsResponse.data.filter(s => !s.assignedTo));
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching data: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  const handleAutoAssign = async () => {
    try {
      setMessage({ type: '', text: '' });
      const response = await axios.post(
        'https://telecom-kappa.vercel.app/api/assign-automated',
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      setMessage({ type: 'success', text: response.data.message });
      
      // Refresh student list
      const studentsResponse = await axios.get('https://telecom-kappa.vercel.app/api/students', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Filter unassigned students
      setStudents(studentsResponse.data.filter(s => !s.assignedTo));
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Error auto-assigning students: ' + (err.response?.data?.error || err.message) 
      });
    }
  };

  const handleManualAssign = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedTelecaller) {
      setMessage({ type: 'error', text: 'Please select both a student and a telecaller' });
      return;
    }
    
    try {
      setMessage({ type: '', text: '' });
      const response = await axios.post(
        'https://telecom-kappa.vercel.app/api/assign-manual',
        {
          studentId: selectedStudent,
          telecallerId: selectedTelecaller
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      setMessage({ type: 'success', text: response.data.message });
      
      // Reset selections
      setSelectedStudent('');
      setSelectedTelecaller('');
      
      // Refresh student list
      const studentsResponse = await axios.get('https://telecom-kappa.vercel.app/api/students', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Filter unassigned students
      setStudents(studentsResponse.data.filter(s => !s.assignedTo));
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Error assigning student: ' + (err.response?.data?.error || err.message) 
      });
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
      <h2 className="text-xl font-bold mb-4">Assign Students to TeleCaller</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Auto Assign</h3>
          <p className="text-gray-600 mb-4">
            Automatically distribute all unassigned students among telecallers
          </p>
          
          <div className="mb-3">
            <span className="font-medium">Unassigned Students:</span> {students.length}
          </div>
          <div className="mb-3">
            <span className="font-medium">Available TeleCaller:</span> {telecallers.length}
          </div>
          
          <button
            onClick={handleAutoAssign}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={students.length === 0 || telecallers.length === 0}
          >
            Auto Assign Students
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Manual Assign</h3>
          <form onSubmit={handleManualAssign}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student">
                Select Student
              </label>
              <select
                id="student"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telecaller">
                Select TeleCaller
              </label>
              <select
                id="telecaller"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedTelecaller}
                onChange={(e) => setSelectedTelecaller(e.target.value)}
                required
              >
                <option value="">Select a telecaller</option>
                {telecallers.map(telecaller => (
                  <option key={telecaller._id} value={telecaller._id}>
                    {telecaller.username} (Assigned: {telecaller.assignedCount})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={students.length === 0 || telecallers.length === 0}
            >
              Assign Student
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignStudents;