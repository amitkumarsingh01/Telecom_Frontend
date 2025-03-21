// src/components/users/UserList.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://telecom-kappa.vercel.app/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.token]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      
      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Role</th>
                {/* <th className="py-3 px-6 text-left">Assigned Students</th> */}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{u.username}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${u.userType === 'Admin' ? 'bg-purple-200 text-purple-800' : 
                        u.userType === 'Agent' ? 'bg-blue-200 text-blue-800' : 
                        'bg-green-200 text-green-800'}
                    `}>
                      {u.userType}
                    </span>
                  </td>
                  {/* <td className="py-3 px-6 text-left">
                    {u.userType === 'TeleCaller' ? u.assignedCount : '-'}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;