import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../../shared/AuthContext';
import { apolloClient } from '../../shared/apiClient';
import ProtectedRoute from '../../shared/ProtectedRoute';
import './App.css';

// Placeholder components - to be implemented
const AdminDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
    <p className="text-gray-600">Dashboard metrics and overview coming soon</p>
  </div>
);

const Analytics = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Analytics</h1>
    <p className="text-gray-600">Detailed analytics and reports coming soon</p>
  </div>
);

const HeatMap = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Issue Heatmap</h1>
    <p className="text-gray-600">Geographic heatmap of issues coming soon</p>
  </div>
);

const Trends = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Trends & Insights</h1>
    <p className="text-gray-600">Trend analysis and AI insights coming soon</p>
  </div>
);

const Backlog = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Issue Backlog</h1>
    <p className="text-gray-600">Issue backlog and prioritization coming soon</p>
  </div>
);

const Header = () => {
  const handleBack = () => {
    const token = localStorage.getItem('token');
    window.location.href = token
      ? `http://localhost:5173/dashboard?token=${encodeURIComponent(token)}`
      : 'http://localhost:5173/dashboard';
  };

  return (
    <header className="bg-purple-600 text-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Civic Analytics</h1>
          <nav className="flex space-x-4 items-center">
            <button 
              onClick={handleBack}
              className="hover:bg-purple-700 px-3 py-2 rounded transition-colors"
              title="Go back to Dashboard"
            >
              ← Back
            </button>
            <a href="http://localhost:5173" className="hover:bg-purple-700 px-3 py-2 rounded">
              Dashboard
            </a>
            <a href="http://localhost:5174" className="hover:bg-purple-700 px-3 py-2 rounded">
              Issues
            </a>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = 'http://localhost:5173/login';
              }}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* Public redirect to auth */}
                <Route path="/" element={<Navigate to="/analytics" />} />

                {/* Protected Routes - Admin/Staff only */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={['municipal_staff', 'admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute requiredRoles={['municipal_staff', 'admin']}>
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/heatmap" 
                  element={
                    <ProtectedRoute requiredRoles={['municipal_staff', 'admin']}>
                      <HeatMap />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/trends" 
                  element={
                    <ProtectedRoute requiredRoles={['municipal_staff', 'admin']}>
                      <Trends />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/backlog" 
                  element={
                    <ProtectedRoute requiredRoles={['municipal_staff', 'admin']}>
                      <Backlog />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all - redirect to analytics */}
                <Route path="*" element={<Navigate to="/analytics" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;