import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  BellAlertIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import './NotificationsDashboard.css';

const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: ID!) {
    getNotifications(userId: $userId, limit: 10) {
      notifications {
        id
        userId
        type
        title
        message
        data
        read
        createdAt
      }
      total
      hasMore
    }
  }
`;

const MARK_AS_READ = gql`
  mutation MarkAsRead($id: ID!) {
    markAsRead(id: $id) {
      id
      read
    }
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

const NotificationsDashboard = () => {
  const { user } = useAuth();

  const { data: notificationData, refetch: refetchNotifications } = useQuery(
    GET_NOTIFICATIONS,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
    }
  );

  const [markAsRead] = useMutation(MARK_AS_READ, {
    onCompleted: () => {
      refetchNotifications();
    },
  });

  const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
    onCompleted: () => {
      refetchNotifications();
    },
  });

  const notifications = notificationData?.getNotifications?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'issue_update':
        return <DocumentTextIcon className="w-5 h-5 text-blue-500" />;
      case 'urgent_alert':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'status_change':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'new_comment':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-purple-500" />;
      case 'volunteer_match':
        return <UserGroupIcon className="w-5 h-5 text-orange-500" />;
      case 'ai_insight':
        return <SparklesIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <BellAlertIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent_alert':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'ai_insight':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'status_change':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'issue_update':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      case 'new_comment':
        return 'border-l-4 border-l-purple-500 bg-purple-50';
      case 'volunteer_match':
        return 'border-l-4 border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-4 border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notifications-dashboard-section">
      <div className="notifications-header">
        <h2 className="notifications-title">
          <BellAlertIcon className="w-6 h-6" />
          Recent Activity
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h2>
        <a href="/notifications" className="view-all-notifications-link">
          View All →
        </a>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications-state">
          <BellAlertIcon className="w-12 h-12" />
          <p>No notifications yet</p>
          <p className="empty-text">You'll see updates about your issues here</p>
        </div>
      ) : (
        <div className="notifications-list-dashboard">
          {notifications.slice(0, 6).map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${getNotificationColor(
                notification.type
              )} ${!notification.read ? 'unread-notification' : ''}`}
            >
              <div className="notification-card-icon">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="notification-card-content">
                <h3 className="notification-card-title">{notification.title}</h3>
                <p className="notification-card-message">{notification.message}</p>
                <span className="notification-card-time">
                  {formatTime(notification.createdAt)}
                </span>
              </div>

              <div className="notification-card-actions">
                {!notification.read && (
                  <button
                    onClick={() =>
                      markAsRead({ variables: { id: notification.id } })
                    }
                    className="notification-action-btn mark-read"
                    title="Mark as read"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() =>
                    deleteNotification({ variables: { id: notification.id } })
                  }
                  className="notification-action-btn delete"
                  title="Delete"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsDashboard;
