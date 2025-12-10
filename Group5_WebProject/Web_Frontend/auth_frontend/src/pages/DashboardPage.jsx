import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BellAlertIcon,
  ArrowUpRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalIssues: 24,
    resolvedIssues: 15,
    pendingIssues: 6,
    highPriority: 3
  });
  const [recentIssues] = useState([
    {
      id: 1,
      title: 'Pothole on Main Street',
      status: 'in_progress',
      priority: 'high',
      location: 'Main St & 5th Ave',
      submittedDate: '2 hours ago',
      upvotes: 12
    },
    {
      id: 2,
      title: 'Street light out',
      status: 'open',
      priority: 'medium',
      location: 'Oak Boulevard',
      submittedDate: '5 hours ago',
      upvotes: 8
    },
    {
      id: 3,
      title: 'Debris cleanup needed',
      status: 'resolved',
      priority: 'low',
      location: 'Park Avenue',
      submittedDate: '1 day ago',
      upvotes: 5
    },
    {
      id: 4,
      title: 'Drainage issue',
      status: 'in_progress',
      priority: 'high',
      location: 'Riverside Drive',
      submittedDate: '3 days ago',
      upvotes: 18
    }
  ]);

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

  const handleViewIssue = (issueId) => {
    toast.success(`Opening issue ${issueId}`);
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
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.username || 'User'}</p>
          </div>
          <div className="role-badge-large" style={{ borderColor: getRoleColor(), backgroundColor: `${getRoleColor()}15` }}>
            <span className="role-dot" style={{ backgroundColor: getRoleColor() }}></span>
            <span className="role-text">{getRoleLabel()}</span>
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
          trend="+5 this month"
        />
        <StatCard
          icon={ExclamationTriangleIcon}
          label="Pending"
          value={stats.pendingIssues}
          color="#f59e0b"
          trend={`${stats.highPriority} high priority`}
        />
        <StatCard
          icon={CheckCircleIcon}
          label="Resolved"
          value={stats.resolvedIssues}
          color="#10b981"
          trend="62.5% resolution rate"
        />
        <StatCard
          icon={BellAlertIcon}
          label="High Priority"
          value={stats.highPriority}
          color="#ef4444"
          trend="Requires attention"
        />
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
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
            {recentIssues.map((issue) => (
              <div key={issue.id} className="issue-item">
                <div className="issue-left">
                  <div
                    className="issue-status-indicator"
                    style={{ backgroundColor: getStatusColor(issue.status) }}
                  ></div>
                  <div className="issue-info">
                    <h3 className="issue-title">{issue.title}</h3>
                    <p className="issue-location">{issue.location}</p>
                    <div className="issue-meta">
                      <span className="meta-badge">{issue.submittedDate}</span>
                      <span className="meta-badge">
                        <UserGroupIcon className="meta-icon" />
                        {issue.upvotes} upvotes
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
                    onClick={() => handleViewIssue(issue.id)}
                    className="view-button"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-box">
            <div className="stat-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
              <ClockIcon />
            </div>
            <div>
              <p className="stat-label">Average Resolution Time</p>
              <p className="stat-value">3-5 days</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
              <CheckCircleIcon />
            </div>
            <div>
              <p className="stat-label">Satisfaction Rate</p>
              <p className="stat-value">92%</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ backgroundColor: '#f5a9a915', color: '#f43f5e' }}>
              <ArrowTrendingUpIcon />
            </div>
            <div>
              <p className="stat-label">This Month</p>
              <p className="stat-value">+18 new issues</p>
            </div>
          </div>
        </div>
      </div>
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