import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../../shared/AuthContext';
import { apolloClient } from '../../shared/apiClient';
import ProtectedRoute from '../../shared/ProtectedRoute';
import './App.css';

// Placeholder components - to be implemented
const IssueList = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Issue Tracker</h1>
    <p className="text-gray-600">Issue list and tracking features coming soon</p>
  </div>
);

const IssueSubmission = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Report an Issue</h1>
    <p className="text-gray-600">Issue submission form coming soon</p>
  </div>
);

const IssueDetail = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Issue Details</h1>
    <p className="text-gray-600">Issue detail view coming soon</p>
  </div>
);

const IssueMap = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Issue Map</h1>
    <p className="text-gray-600">Interactive issue map coming soon</p>
  </div>
);

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Civic Issue Tracker</h1>
          <nav className="flex space-x-4">
            <a href="http://localhost:5173" className="hover:bg-blue-700 px-3 py-2 rounded">
              Dashboard
            </a>
            <a href="http://localhost:5175" className="hover:bg-blue-700 px-3 py-2 rounded">
              Analytics
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
                <Route path="/" element={<Navigate to="/issues" />} />

                {/* Protected Routes */}
                <Route 
                  path="/issues" 
                  element={
                    <ProtectedRoute>
                      <IssueList />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/issues/new" 
                  element={
                    <ProtectedRoute>
                      <IssueSubmission />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/issues/:id" 
                  element={
                    <ProtectedRoute>
                      <IssueDetail />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/map" 
                  element={
                    <ProtectedRoute>
                      <IssueMap />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all - redirect to issues */}
                <Route path="*" element={<Navigate to="/issues" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
