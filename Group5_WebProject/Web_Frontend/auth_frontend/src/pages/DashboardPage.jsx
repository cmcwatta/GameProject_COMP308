import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const DashboardPage = ({ roleSpecific = false }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    highPriority: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API calls
      setStats({
        totalIssues: 24,
        pendingIssues: 8,
        resolvedIssues: 16,
        highPriority: 3
      });

      setRecentIssues([
        { id: 1, title: 'Pothole on Main St', status: 'pending', priority: 'high', date: '2024-01-15' },
        { id: 2, title: 'Broken Streetlight', status: 'resolved', priority: 'medium', date: '2024-01-14' },
        { id: 3, title: 'Garbage Collection Delay', status: 'pending', priority: 'low', date: '2024-01-13' },
        { id: 4, title: 'Park Maintenance', status: 'in-progress', priority: 'medium', date: '2024-01-12' },
      ]);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage users, monitor system activity, and configure settings.',
          actions: [
            { label: 'Manage Users', icon: UserGroupIcon, link: '/admin/users' },
            { label: 'System Logs', icon: DocumentTextIcon, link: '/admin/logs' },
            { label: 'Settings', icon: Cog6ToothIcon, link: '/admin/settings' }
          ]
        };
      case 'municipal_staff':
        return {
          title: 'Staff Portal',
          description: 'Manage community issues, track resolutions, and coordinate with departments.',
          actions: [
            { label: 'Issue Queue', icon: InboxIcon, link: '/staff/issues' },
            { label: 'Assign Tasks', icon: UserPlusIcon, link: '/staff/assign' },
            { label: 'Reports', icon: ChartBarIcon, link: '/staff/reports' }
          ]
        };
      case 'community_advocate':
        return {
          title: 'Community Advocate Hub',
          description: 'Monitor trends, support residents, and coordinate community initiatives.',
          actions: [
            { label: 'Trend Analysis', icon: ChartBarIcon, link: '/advocate/trends' },
            { label: 'Community Support', icon: HeartIcon, link: '/advocate/support' },
            { label: 'Volunteer Coordination', icon: UserGroupIcon, link: '/advocate/volunteers' }
          ]
        };
      default:
        return {
          title: 'Resident Dashboard',
          description: 'Report issues, track their status, and stay informed about your community.',
          actions: [
            { label: 'Report Issue', icon: ExclamationTriangleIcon, link: '/report' },
            { label: 'My Reports', icon: DocumentTextIcon, link: '/my-reports' },
            { label: 'Community Alerts', icon: BellAlertIcon, link: '/alerts' }
          ]
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600">
              {roleContent.description}
            </p>
            <div className="mt-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roleContent.actions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <action.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{action.label}</h3>
                <p className="text-sm text-gray-500 mt-1">Click to access</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Issues</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalIssues}</p>
            </div>
            <DocumentTextIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingIssues}</p>
            </div>
            <ClockIcon className="h-10 w-10 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolvedIssues}</p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
            <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Issues</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    issue.priority === 'high' ? 'bg-red-100' :
                    issue.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <ExclamationTriangleIcon className={`h-5 w-5 ${
                      issue.priority === 'high' ? 'text-red-600' :
                      issue.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{issue.title}</h3>
                    <p className="text-sm text-gray-500">Reported on {issue.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;