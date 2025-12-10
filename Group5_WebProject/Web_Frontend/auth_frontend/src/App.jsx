import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { apolloClient } from './services/apiClient';

// Pages
import RoleSelectionPage from './pages/RoleSelectionPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

// Styles
import './styles/App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<RoleSelectionPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                {/* Admin Only Route */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPage />
                  </ProtectedRoute>
                } />

                {/* Municipal Staff Route */}
                <Route path="/staff" element={
                  <ProtectedRoute allowedRoles={['municipal_staff', 'admin']}>
                    <DashboardPage roleSpecific={true} />
                  </ProtectedRoute>
                } />

                {/* Community Advocate Route */}
                <Route path="/advocate" element={
                  <ProtectedRoute allowedRoles={['community_advocate', 'admin']}>
                    <DashboardPage roleSpecific={true} />
                  </ProtectedRoute>
                } />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;