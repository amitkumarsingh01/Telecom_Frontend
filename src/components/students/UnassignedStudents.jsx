import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const UnassignStudents = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useContext(AuthContext);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [bulkAction, setBulkAction] = useState(false);

  // Filter states
  const [telecallerFilter, setTelecallerFilter] = useState('all');
  const [telecallers, setTelecallers] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assigned pending students
        const studentsResponse = await axios.get('https://telecom-kappa.vercel.app/api/students?status=pending&assigned=true', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        // Fetch telecallers for filter
        const usersResponse = await axios.get('https://telecom-kappa.vercel.app/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        // Filter telecallers
        const telecallersList = usersResponse.data.filter(u => u.userType === 'TeleCaller');
        setTelecallers(telecallersList);
        
        // Set students data
        setPendingStudents(studentsResponse.data);
        setFilteredStudents(studentsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching data: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  // Apply filters when filter state changes
  useEffect(() => {
    let result = [...pendingStudents];
    
    // Apply telecaller filter
    if (telecallerFilter !== 'all') {
      result = result.filter(student => student.assignedTo === telecallerFilter);
    }
    
    // Apply date filter
    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      result = result.filter(student => new Date(student.createdAt) >= startDate);
    }
    
    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      // Set time to end of day for the end date
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(student => new Date(student.createdAt) <= endDate);
    }
    
    setFilteredStudents(result);
  }, [telecallerFilter, dateFilter, pendingStudents]);

  const handleUnassign = async (studentId) => {
    try {
      setMessage({ type: '', text: '' });
      
      const response = await axios.post(
        'https://telecom-kappa.vercel.app/api/unassign-student',
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      // Update the state by removing the unassigned student
      const updatedStudents = pendingStudents.filter(s => s._id !== studentId);
      setPendingStudents(updatedStudents);
      
      setMessage({ 
        type: 'success', 
        text: `Student has been unassigned successfully: ${response.data.message || ''}` 
      });
      
      // Clear selection if this student was selected
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Error unassigning student: ' + (err.response?.data?.error || err.message) 
      });
    }
  };

  const handleBulkUnassign = async () => {
    if (selectedStudents.length === 0) {
      setMessage({ type: 'error', text: 'No students selected for unassignment' });
      return;
    }
    
    try {
      setMessage({ type: '', text: '' });
      
      const response = await axios.post(
        'https://telecom-kappa.vercel.app/api/unassign-students-bulk',
        { studentIds: selectedStudents },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      // Update the state by removing all unassigned students
      const updatedStudents = pendingStudents.filter(s => !selectedStudents.includes(s._id));
      setPendingStudents(updatedStudents);
      
      setMessage({ 
        type: 'success', 
        text: `${selectedStudents.length} students have been unassigned successfully: ${response.data.message || ''}` 
      });
      
      // Clear selections
      setSelectedStudents([]);
      setBulkAction(false);
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Error unassigning students: ' + (err.response?.data?.error || err.message) 
      });
    }
  };
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedStudents(filteredStudents.map(student => student._id));
    } else {
      setSelectedStudents([]);
    }
  };
  
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  // Reset all filters
  const resetFilters = () => {
    setTelecallerFilter('all');
    setDateFilter({ startDate: '', endDate: '' });
  };

  const getTelecallerName = (telecallerId) => {
    const telecaller = telecallers.find(t => t._id === telecallerId);
    return telecaller ? telecaller.username : 'Unknown';
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Unassign Pending Students</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Filter section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Telecaller filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller</label>
            <select
              value={telecallerFilter}
              onChange={(e) => setTelecallerFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Telecallers</option>
              {telecallers.map(tc => (
                <option key={tc._id} value={tc._id}>
                  {tc.username} (Assigned: {pendingStudents.filter(s => s.assignedTo === tc._id).length})
                </option>
              ))}
            </select>
          </div>
          
          {/* Date range filter - Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          {/* Date range filter - End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        {/* Reset button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Bulk actions */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {pendingStudents.length} pending assigned students
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setBulkAction(!bulkAction)}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {bulkAction ? 'Cancel Bulk Action' : 'Bulk Action'}
          </button>
          
          {bulkAction && (
            <button
              onClick={handleBulkUnassign}
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={selectedStudents.length === 0}
            >
              Unassign Selected ({selectedStudents.length})
            </button>
          )}
        </div>
      </div>
      
      {filteredStudents.length === 0 ? (
        <p className="text-gray-500">No pending assigned students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                {bulkAction && (
                  <th className="py-3 px-6 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                )}
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Assigned To</th>
                <th className="py-3 px-6 text-left">Created At</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                  {bulkAction && (
                    <td className="py-3 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleSelectStudent(student._id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                  )}
                  <td className="py-3 px-6 text-left">
                    {student.name}
                  </td>
                  <td className="py-3 px-6 text-left">{student.email}</td>
                  <td className="py-3 px-6 text-left">{student.phone}</td>
                  <td className="py-3 px-6 text-left">{student.description || '-'}</td>
                  <td className="py-3 px-6 text-left">
                    {getTelecallerName(student.assignedTo)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(student.createdAt)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleUnassign(student._id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Unassign
                    </button>
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

export default UnassignStudents;