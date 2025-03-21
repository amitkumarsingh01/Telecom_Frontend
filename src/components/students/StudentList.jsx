import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://telecom-kappa.vercel.app/api/students', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setStudents(response.data);
        setFilteredStudents(response.data);
        
        // Calculate initial status counts
        calculateStatusCounts(response.data);
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching students: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user.token]);

  // Calculate counts for each status
  const calculateStatusCounts = (studentList) => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: studentList.length
    };
    
    studentList.forEach(student => {
      if (student.status in counts) {
        counts[student.status]++;
      }
    });
    
    setStatusCounts(counts);
  };

  // Apply filters when filter state changes
  useEffect(() => {
    let result = [...students];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(student => student.status === statusFilter);
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
  }, [statusFilter, dateFilter, students]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://telecom-kappa.vercel.app/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        // Update students list
        const updatedStudents = students.filter(student => student._id !== id);
        
        // Update state
        setStudents(updatedStudents);
        
        // Recalculate status counts
        calculateStatusCounts(updatedStudents);
        
        // Update filtered students
        setFilteredStudents(updatedStudents.filter(student => 
          (statusFilter === 'all' || student.status === statusFilter) &&
          (!dateFilter.startDate || new Date(student.createdAt) >= new Date(dateFilter.startDate)) &&
          (!dateFilter.endDate || new Date(student.createdAt) <= new Date(dateFilter.endDate))
        ));
      } catch (err) {
        setError('Error deleting student: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Format date to DD/MM/YYYY HH:MM
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter('all');
    setDateFilter({ startDate: '', endDate: '' });
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
      
      {/* Status Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{statusCounts.total}</div>
          <div className="text-gray-600">Total</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-800">{statusCounts.pending}</div>
          <div className="text-yellow-800">Pending</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">{statusCounts.approved}</div>
          <div className="text-green-800">Approved</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-800">{statusCounts.rejected}</div>
          <div className="text-red-800">Rejected</div>
        </div>
      </div>

      {/* Filter section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredStudents.length} of {students.length} students
      </div>
      
      {filteredStudents.length === 0 ? (
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
                <th className="py-3 px-6 text-left">Created At</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredStudents.map((student) => (
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
                  <td className="py-3 px-6 text-left">
                    {formatDate(student.createdAt)}
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