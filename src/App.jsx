import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AgentDashboard from './components/dashboard/AgentDashboard';
import TeleCallerDashboard from './components/dashboard/TeleCallerDashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute requiredRole="Admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/agent/*"
                element={
                  <PrivateRoute requiredRole="Agent">
                    <AgentDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/telecaller/*"
                element={
                  <PrivateRoute requiredRole="TeleCaller">
                    <TeleCallerDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;