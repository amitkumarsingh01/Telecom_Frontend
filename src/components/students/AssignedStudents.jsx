import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AssignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
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
    const fetchAssignedStudents = async () => {
      try {
        const response = await axios.get('https://telecom-kappa.vercel.app/api/assigned-students', {
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
        setError('Error fetching assigned students: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchAssignedStudents();
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
      
      // Update the student in the state with new status
      const updatedStudents = students.map(student => 
        student._id === id ? { ...student, status: response.data.status } : student
      );
      
      // Update states
      setStudents(updatedStudents);
      
      // Recalculate status counts
      calculateStatusCounts(updatedStudents);
      
      // Update filtered students
      setFilteredStudents(updatedStudents.filter(student => 
        (statusFilter === 'all' || student.status === statusFilter) &&
        (!dateFilter.startDate || new Date(student.createdAt) >= new Date(dateFilter.startDate)) &&
        (!dateFilter.endDate || new Date(student.createdAt) <= new Date(dateFilter.endDate))
      ));
      
      // If this student is currently selected in the modal, update it there too
      if (selectedStudent && selectedStudent._id === id) {
        setSelectedStudent({ ...selectedStudent, status: response.data.status });
      }

      // Reset editing state
      setEditingStudent(null);
    } catch (err) {
      setError('Error updating student: ' + (err.response?.data?.error || err.message));
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
  
  // Open student details modal
  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };
  
  // Close student details modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };
  
  // Communication handlers
  const handleEmail = (student) => {
    const subject = encodeURIComponent('Follow-up from your application');
    const body = encodeURIComponent(`Hi ${student.name},\n\nWe are contacting you from JST regarding your application. Please let us know if you have any questions.\n\nRegards,\nJST Team`);
    window.open(`mailto:${student.email}?subject=${subject}&body=${body}`);
  };
  
  const handleWhatsApp = (student) => {
    const message = encodeURIComponent(`Hi ${student.name}, we are contacting you from JST regarding your application. Please let us know if you have any questions.`);
    window.open(`https://wa.me/${student.phone.replace(/\D/g, '')}?text=${message}`);
  };
  
  const handleSMS = (student) => {
    const message = encodeURIComponent(`Hi ${student.name}, we are contacting you from JST regarding your application.`);
    window.open(`sms:${student.phone}?body=${message}`);
  };
  
  const handleCall = (student) => {
    window.open(`tel:${student.phone}`);
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
      
      {/* Status Counts */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
                <th className="py-3 px-6 text-left">Created At</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">
                    <button 
                      className="text-green-600 hover:text-green-800 hover:underline"
                      onClick={() => openStudentModal(student)}
                    >
                      {student.name}
                    </button>
                  </td>
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
                  <td className="py-3 px-6 text-left">
                    {formatDate(student.createdAt)}
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
                        className="text-green-500 hover:text-green-700"
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
      
      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Student Details</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 text-lg">{selectedStudent.name}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 text-lg">{selectedStudent.email}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <div className="mt-1 text-lg">{selectedStudent.phone}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <div className="mt-1 text-lg">{selectedStudent.description || '-'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${selectedStudent.status === 'approved' ? 'bg-green-200 text-green-800' : 
                      selectedStudent.status === 'rejected' ? 'bg-red-200 text-red-800' : 
                      'bg-yellow-200 text-yellow-800'}
                  `}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Created At</label>
                <div className="mt-1 text-lg">{formatDate(selectedStudent.createdAt)}</div>
              </div>
              
              <div className="py-4">
                <div className="border-t border-gray-200"></div>
              </div>
              
              {/* Communication Actions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Contact Options</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button
                    onClick={() => handleEmail(selectedStudent)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </button>
                  
                  <button
                    onClick={() => handleWhatsApp(selectedStudent)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={() => handleSMS(selectedStudent)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    SMS
                  </button>
                  
                  <button
                    onClick={() => handleCall(selectedStudent)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </button>
                </div>
              </div>
              
              {/* Update Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Update Status</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedStudent._id, 'approved');
                      closeModal();
                    }}
                    className="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedStudent._id, 'rejected');
                      closeModal();
                    }}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedStudent._id, 'pending');
                      closeModal();
                    }}
                    className="px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStudents;