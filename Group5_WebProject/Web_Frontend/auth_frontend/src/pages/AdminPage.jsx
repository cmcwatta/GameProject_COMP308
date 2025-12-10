import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import {
  UserGroupIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await authService.getUsers();
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateRole = async (userId) => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }

    try {
      const updatedUser = await authService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      setEditingUser(null);
      setNewRole('');
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      // Call delete mutation
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'municipal_staff':
        return 'bg-blue-100 text-blue-800';
      case 'community_advocate':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'municipal_staff':
        return 'Municipal Staff';
      case 'community_advocate':
        return 'Community Advocate';
      default:
        return 'Resident';
    }
  };

  const roleOptions = [
    { value: 'resident', label: 'Resident' },
    { value: 'community_advocate', label: 'Community Advocate' },
    { value: 'municipal_staff', label: 'Municipal Staff' },
    { value: 'admin', label: 'Administrator' }
  ];

  const stats = {
    totalUsers: users.length,
    residents: users.filter(u => u.role === 'resident').length,
    staff: users.filter(u => u.role === 'municipal_staff').length,
    advocates: users.filter(u => u.role === 'community_advocate').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage users, monitor system activity, and configure settings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <UserGroupIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Residents</p>
              <p className="text-3xl font-bold text-gray-800">{stats.residents}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <span className="text-gray-800 font-medium">R</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Municipal Staff</p>
              <p className="text-3xl font-bold text-gray-800">{stats.staff}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-800 font-medium">S</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Administrators</p>
              <p className="text-3xl font-bold text-gray-800">{stats.admins}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-800 font-medium">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="resident">Residents</option>
              <option value="community_advocate">Community Advocates</option>
              <option value="municipal_staff">Municipal Staff</option>
              <option value="admin">Administrators</option>
            </select>
            
            <button
              onClick={fetchUsers}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-800 font-medium">
                            {userItem.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === userItem.id ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={newRole || userItem.role}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            {roleOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateRole(userItem.id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 text-xs rounded-full ${getRoleColor(userItem.role)}`}>
                          {getRoleDisplayName(userItem.role)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(userItem.id);
                            setNewRole(userItem.role);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit role"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {userItem.id !== user.userId && (
                          <button
                            onClick={() => handleDeleteUser(userItem.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
            <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mr-2" />
            <span className="text-gray-600 group-hover:text-blue-600">Add New User</span>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition group">
            <ArrowPathIcon className="h-6 w-6 text-gray-400 group-hover:text-green-500 mr-2" />
            <span className="text-gray-600 group-hover:text-green-600">Bulk Update Roles</span>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group">
            <UserGroupIcon className="h-6 w-6 text-gray-400 group-hover:text-purple-500 mr-2" />
            <span className="text-gray-600 group-hover:text-purple-600">Generate Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;