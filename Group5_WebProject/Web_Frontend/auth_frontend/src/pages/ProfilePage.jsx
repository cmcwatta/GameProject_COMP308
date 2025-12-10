import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const getRoleInfo = () => {
    switch (user?.role) {
      case 'admin':
        return {
          color: 'bg-red-100 text-red-800',
          displayName: 'Administrator',
          description: 'Full system access and user management capabilities',
          icon: <ShieldCheckIcon className="h-6 w-6 text-red-600" />
        };
      case 'municipal_staff':
        return {
          color: 'bg-blue-100 text-blue-800',
          displayName: 'Municipal Staff',
          description: 'Issue management and resolution capabilities',
          icon: <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
        };
      case 'community_advocate':
        return {
          color: 'bg-green-100 text-green-800',
          displayName: 'Community Advocate',
          description: 'Community monitoring and support capabilities',
          icon: <ShieldCheckIcon className="h-6 w-6 text-green-600" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          displayName: 'Resident',
          description: 'Issue reporting and tracking capabilities',
          icon: <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
        };
    }
  };

  const roleInfo = getRoleInfo();

  const handleSave = () => {
    // TODO: Implement update profile API call
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const stats = [
    { label: 'Issues Reported', value: '24', color: 'text-blue-600' },
    { label: 'Issues Resolved', value: '18', color: 'text-green-600' },
    { label: 'Avg. Response Time', value: '2.3 days', color: 'text-purple-600' },
    { label: 'Satisfaction Rate', value: '92%', color: 'text-yellow-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-16 w-16 text-blue-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.role?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border-b border-blue-500 focus:outline-none"
                  />
                ) : (
                  user?.username
                )}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-b border-blue-500 focus:outline-none"
                  />
                ) : (
                  <span className="text-gray-600">{user?.email}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Role & Stats */}
        <div className="space-y-6">
          {/* Role Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Role</h2>
              {roleInfo.icon}
            </div>
            <div className={`px-4 py-2 rounded-lg ${roleInfo.color} text-center mb-4`}>
              <span className="font-medium">{roleInfo.displayName}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{roleInfo.description}</p>
            <button
              onClick={logout}
              className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              Sign Out
            </button>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">Member Since</span>
                </div>
                <span className="font-medium">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Verified</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Activity Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Issue #1234 Resolved</p>
                    <p className="text-sm text-gray-500">Pothole on Main Street has been fixed</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">New Issue Reported</p>
                    <p className="text-sm text-gray-500">Broken streetlight at Oak Avenue</p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Status Updated</p>
                    <p className="text-sm text-gray-500">Garbage collection delay - In Progress</p>
                  </div>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates about your reported issues</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">SMS Alerts</p>
                  <p className="text-sm text-gray-500">Get urgent updates via text message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Community Updates</p>
                  <p className="text-sm text-gray-500">News and announcements from your municipality</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;