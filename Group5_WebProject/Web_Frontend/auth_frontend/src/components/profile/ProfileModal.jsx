import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, gql } from '@apollo/client';
import {
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MapPinIcon,
  UserCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import './ProfileModal.css';

const GET_USER_ISSUES = gql`
  query GetUserIssues($submitterId: String!) {
    issuesBySubmitter(submitterId: $submitterId) {
      id
      title
      status
      priority
      createdAt
    }
  }
`;

const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    highPriorityIssues: 0,
    joinDate: null
  });

  const { data: userIssuesData } = useQuery(GET_USER_ISSUES, {
    variables: { submitterId: user?.id },
    skip: !user?.id || !isOpen,
  });

  useEffect(() => {
    if (userIssuesData?.issuesBySubmitter) {
      const issues = userIssuesData.issuesBySubmitter;
      const resolved = issues.filter(i => i.status === 'resolved').length;
      const pending = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
      const highPriority = issues.filter(i => i.priority === 'critical' || i.priority === 'high').length;

      setUserStats({
        totalIssues: issues.length,
        resolvedIssues: resolved,
        pendingIssues: pending,
        highPriorityIssues: highPriority,
        joinDate: user?.createdAt || new Date().toISOString()
      });
    }
  }, [userIssuesData, user?.createdAt, user?.id]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getResolutionRate = () => {
    if (userStats.totalIssues === 0) return 0;
    return Math.round((userStats.resolvedIssues / userStats.totalIssues) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="profile-modal-close" onClick={onClose}>
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            <UserIcon className="w-12 h-12" />
          </div>
          <div className="profile-basic-info">
            <h2 className="profile-name">{user?.username || 'User'}</h2>
            <div 
              className="profile-role-badge" 
              style={{ borderColor: getRoleColor(), backgroundColor: `${getRoleColor()}15` }}
            >
              <span className="role-indicator" style={{ backgroundColor: getRoleColor() }}></span>
              <span>{getRoleLabel()}</span>
            </div>
          </div>
        </div>

        {/* User Details Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">Contact Information</h3>
          <div className="profile-details">
            <div className="detail-item">
              <UserCircleIcon className="detail-icon" />
              <div>
                <p className="detail-label">Email</p>
                <p className="detail-value">{user?.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="detail-item">
              <CalendarIcon className="detail-icon" />
              <div>
                <p className="detail-label">Member Since</p>
                <p className="detail-value">{formatDate(userStats.joinDate)}</p>
              </div>
            </div>
            {user?.location && (
              <div className="detail-item">
                <MapPinIcon className="detail-icon" />
                <div>
                  <p className="detail-label">Location</p>
                  <p className="detail-value">{user.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Issues Statistics Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">Your Issue Activity</h3>
          <div className="profile-stats-grid">
            <div className="profile-stat-card total">
              <div className="profile-stat-icon">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <p className="profile-stat-label">Total Issues</p>
              <p className="profile-stat-value">{userStats.totalIssues}</p>
            </div>

            <div className="profile-stat-card resolved">
              <div className="profile-stat-icon">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <p className="profile-stat-label">Resolved</p>
              <p className="profile-stat-value">{userStats.resolvedIssues}</p>
            </div>

            <div className="profile-stat-card pending">
              <div className="profile-stat-icon">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <p className="profile-stat-label">Pending</p>
              <p className="profile-stat-value">{userStats.pendingIssues}</p>
            </div>

            <div className="profile-stat-card highpriority">
              <div className="profile-stat-icon">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <p className="profile-stat-label">High Priority</p>
              <p className="profile-stat-value">{userStats.highPriorityIssues}</p>
            </div>
          </div>
        </div>

        {/* Resolution Rate Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">Resolution Overview</h3>
          <div className="resolution-rate-container">
            <div className="resolution-rate-visual">
              <div className="resolution-rate-bar">
                <div 
                  className="resolution-rate-fill" 
                  style={{ width: `${getResolutionRate()}%` }}
                ></div>
              </div>
              <p className="resolution-rate-text">
                {getResolutionRate()}% of your issues have been resolved
              </p>
            </div>
            <div className="resolution-stats">
              <div className="resolution-stat">
                <span className="resolution-label">Resolved:</span>
                <span className="resolution-number green">{userStats.resolvedIssues}</span>
              </div>
              <div className="resolution-stat">
                <span className="resolution-label">Pending:</span>
                <span className="resolution-number amber">{userStats.pendingIssues}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="profile-action-btn view-issues" onClick={() => {
            const token = localStorage.getItem('token');
            window.location.href = token 
              ? `http://localhost:5174/issues?token=${encodeURIComponent(token)}`
              : 'http://localhost:5174/issues';
          }}>
            View My Issues
          </button>
          <button className="profile-action-btn close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
