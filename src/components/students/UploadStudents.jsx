// src/components/students/UploadStudents.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const UploadStudents = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDownloadSample = async () => {
    try {
      const response = await axios.get('https://telecom-kappa.vercel.app/api/sample-excel', {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        responseType: 'blob'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample-students.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Error downloading sample: ' + (err.response?.data?.error || err.message) 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    
    try {
      const response = await axios.post(
        'https://telecom-kappa.vercel.app/api/upload-excel',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setMessage({ type: 'success', text: response.data.message });
      setFile(null);
      // Reset file input
      document.getElementById('file').value = '';
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'Error uploading file: ' + (err.response?.data?.error || err.message) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Upload Students</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Upload an Excel file with student information. The file should contain columns for name, email, phone, and optionally description.
        </p>
        <button
          onClick={handleDownloadSample}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Download sample Excel template
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Excel File
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="file"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Only Excel files (.xlsx, .xls) are allowed</p>
        </div>
        
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Students'}
        </button>
      </form>
    </div>
  );
};

export default UploadStudents;
