import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery, gql } from '@apollo/client';
import NotificationsDashboard from '../components/notifications/NotificationsDashboard';
import ProfileModal from '../components/profile/ProfileModal';
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BellAlertIcon,
  ArrowUpRightIcon,
  ArrowTrendingUpIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import './DashboardPage.css';

// GraphQL Query to fetch recent issues
const GET_RECENT_ISSUES = gql`
  query GetRecentIssues {
    issues(limit: 10) {
      id
      title
      status
      priority
      location {
        address
      }
      createdAt
      upvotes
    }
  }
`;

const GET_ISSUE_STATS = gql`
  query GetIssueStats {
    issues {
      id
      status
      priority
    }
  }
`;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    highPriority: 0,
    assignedIssues: 0,
    inProgressIssues: 0,
    resolutionRate: 0,
    trend: '+0 this month'
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch recent issues
  const { data: issuesData, loading: issuesLoading } = useQuery(GET_RECENT_ISSUES);
  
  // Fetch stats
  const { data: statsData } = useQuery(GET_ISSUE_STATS);

  // Calculate stats from data
  useEffect(() => {
    if (statsData?.issues) {
      const issues = statsData.issues;
      const resolved = issues.filter(i => i.status === 'resolved').length;
      const pending = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
      const inProgress = issues.filter(i => i.status === 'in_progress').length;
      const assigned = issues.filter(i => i.status === 'assigned').length;
      const highPriority = issues.filter(i => i.priority === 'critical' || i.priority === 'high').length;
      const total = issues.length;
      
      // Calculate resolution rate
      const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
      
      // Calculate trend (issues created this month - simplified as percentage growth)
      const thisMonth = issues.filter(i => {
        const createdDate = new Date(i.createdAt);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear();
      }).length;

      setStats({
        totalIssues: total,
        resolvedIssues: resolved,
        pendingIssues: pending,
        inProgressIssues: inProgress,
        assignedIssues: assigned,
        highPriority: highPriority,
        resolutionRate: resolutionRate,
        trend: `+${thisMonth} this month`
      });
    }
  }, [statsData]);

  const recentIssues = issuesData?.issues || [];

  const handleLogout = () => {
    toast.success('Logged out successfully');
    logout();
    navigate('/login');
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'resident':
        return '#3b82f6';
      case 'community_advocate':
        return '#10b981';
      case 'municipal_staff':
        return '#f43f5e';
      case 'admin':
        return '#667eea';
      default:
        return '#667eea';
    }
  };

  const getRoleLabel = () => {
    return user?.role?.replace('_', ' ').toUpperCase() || 'User';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const getSubmittedTime = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCreateIssue = () => {
    window.location.href = 'http://localhost:5174/report';
  };

  const handleViewAnalytics = () => {
    window.location.href = 'http://localhost:5175/analytics';
  };

  const handleViewIssues = () => {
    window.location.href = 'http://localhost:5174/issues';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.username || 'User'}</p>
          </div>
          
          <div className="header-right">
            <div className="role-badge-large" style={{ borderColor: getRoleColor(), backgroundColor: `${getRoleColor()}15` }}>
              <span className="role-dot" style={{ backgroundColor: getRoleColor() }}></span>
              <span className="role-text">{getRoleLabel()}</span>
            </div>
            
            <div className="header-actions">
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="header-action-btn profile-btn"
                title="Profile"
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="header-action-btn logout-btn"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={DocumentTextIcon}
          label="Total Issues"
          value={stats.totalIssues}
          color="#3b82f6"
          trend={stats.trend}
        />
        <StatCard
          icon={ExclamationTriangleIcon}
          label="Pending"
          value={stats.pendingIssues}
          color="#f59e0b"
          trend={`${stats.highPriority} high priority issues`}
        />
        <StatCard
          icon={CheckCircleIcon}
          label="Resolved"
          value={stats.resolvedIssues}
          color="#10b981"
          trend={`${stats.resolutionRate}% resolution rate`}
        />
        <StatCard
          icon={BellAlertIcon}
          label="High Priority"
          value={stats.highPriority}
          color="#ef4444"
          trend={stats.highPriority > 0 ? "⚠️ Requires attention" : "✓ All clear"}
        />
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Notifications Section - Featured at Top */}
        <NotificationsDashboard />

        {/* Action Bar - Quick Access */}
        <div className="quick-action-bar">
          <button
            onClick={handleViewIssues}
            className="quick-action-btn view-all-btn"
          >
            <ExclamationTriangleIcon className="action-icon" />
            <div className="action-text">
              <span className="action-label">View All Issues</span>
              <span className="action-desc">Browse and track community issues</span>
            </div>
            <ArrowUpRightIcon className="arrow-icon" />
          </button>

          {(user?.role === 'admin' || user?.role === 'municipal_staff') && (
            <button
              onClick={handleViewAnalytics}
              className="quick-action-btn analytics-btn"
            >
              <ArrowTrendingUpIcon className="action-icon" />
              <div className="action-text">
                <span className="action-label">Analytics & Reports</span>
                <span className="action-desc">View insights and statistics</span>
              </div>
              <ArrowUpRightIcon className="arrow-icon" />
            </button>
          )}
        </div>

        {/* Recent Issues Section */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Issues</h2>
            {user?.role === 'resident' && (
              <button
                onClick={handleCreateIssue}
                className="create-button"
                style={{ backgroundColor: getRoleColor() }}
              >
                + Report Issue
              </button>
            )}
          </div>

          <div className="issues-list">
            {issuesLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                Loading issues...
              </div>
            ) : recentIssues.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                No issues found
              </div>
            ) : (
              recentIssues.map((issue) => (
                <div key={issue.id} className="issue-item">
                  <div className="issue-left">
                    <div
                      className="issue-status-indicator"
                      style={{ backgroundColor: getStatusColor(issue.status) }}
                    ></div>
                    <div className="issue-info">
                      <h3 className="issue-title">{issue.title}</h3>
                      <p className="issue-location">{issue.location?.address || 'Location not specified'}</p>
                      <div className="issue-meta">
                        <span className="meta-badge">{getSubmittedTime(issue.createdAt)}</span>
                        <span className="meta-badge">
                          <UserGroupIcon className="meta-icon" />
                          {issue.upvotes || 0} upvotes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="issue-right">
                    <div
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(issue.status)}20`,
                        color: getStatusColor(issue.status),
                        borderColor: getStatusColor(issue.status)
                      }}
                    >
                      {getStatusLabel(issue.status)}
                    </div>
                    <div
                      className={`priority-badge priority-${issue.priority}`}
                    >
                      {issue.priority.toUpperCase()}
                    </div>
                    <button
                      onClick={() => {
                        window.location.href = `http://localhost:5174/issues/${issue.id}`;
                      }}
                      className="view-button"
                    >
                      View →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-box">
            <div className="stat-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
              <ClockIcon />
            </div>
            <div>
              <p className="stat-label">In Progress</p>
              <p className="stat-value">{stats.inProgressIssues}</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
              <CheckCircleIcon />
            </div>
            <div>
              <p className="stat-label">Resolution Rate</p>
              <p className="stat-value">{stats.resolutionRate}%</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ backgroundColor: '#f5a9a915', color: '#f43f5e' }}>
              <ArrowTrendingUpIcon />
            </div>
            <div>
              <p className="stat-label">Assigned Issues</p>
              <p className="stat-value">{stats.assignedIssues}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon-container" style={{ backgroundColor: `${color}20`, color }}>
          <Icon className="stat-icon" />
        </div>
        <ArrowUpRightIcon className="trend-icon" />
      </div>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-trend">{trend}</p>
    </div>
  );
};

export default DashboardPage;