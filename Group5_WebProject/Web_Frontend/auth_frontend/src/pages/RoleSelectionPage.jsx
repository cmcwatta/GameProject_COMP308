import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import './RoleSelectionPage.css';

export default function RoleSelectionPage() {
  const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setActiveTab('register');
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        {/* Header */}
        <div className="role-selection-header">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome to Civic Engagement
          </h1>
          <p className="text-gray-600 text-center">
            Connect with your community. Choose your role to get started.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="role-selection-tabs">
          <button
            className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
          <button
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>

        {/* Content Area */}
        <div className="role-selection-content">
          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="roles-grid">
              {/* Resident Card */}
              <div className="role-card">
                <div className="role-icon resident">🏠</div>
                <h3 className="role-title">Resident</h3>
                <p className="role-description">
                  Report issues, track status, receive alerts
                </p>
                <button
                  className="role-button resident-btn"
                  onClick={() => handleRoleSelect('resident')}
                >
                  Register as Resident →
                </button>
              </div>

              {/* Community Advocate Card */}
              <div className="role-card">
                <div className="role-icon advocate">👥</div>
                <h3 className="role-title">Community Advocate</h3>
                <p className="role-description">
                  Monitor trends, support residents, coordinate initiatives
                </p>
                <button
                  className="role-button advocate-btn"
                  onClick={() => handleRoleSelect('community_advocate')}
                >
                  Register as Advocate →
                </button>
              </div>

              {/* Municipal Staff Card */}
              <div className="role-card">
                <div className="role-icon staff">🏛️</div>
                <h3 className="role-title">Municipal Staff</h3>
                <p className="role-description">
                  Manage issues, update status, provide resolutions
                </p>
                <button
                  className="role-button staff-btn"
                  onClick={() => handleRoleSelect('municipal_staff')}
                >
                  Register as Staff →
                </button>
              </div>
            </div>
          )}

          {/* Login Tab */}
          {activeTab === 'login' && (
            <div className="auth-form-container">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Login to Your Account</h2>
              <LoginForm />
              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <button
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => setActiveTab('roles')}
                >
                  Create one here
                </button>
              </p>
            </div>
          )}

          {/* Register Tab */}
          {activeTab === 'register' && (
            <div className="auth-form-container">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Create Account as {selectedRole?.replace('_', ' ').toUpperCase()}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Fill in your details to get started
              </p>
              <RegisterForm selectedRole={selectedRole} />
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <button
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => setActiveTab('login')}
                >
                  Log in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
