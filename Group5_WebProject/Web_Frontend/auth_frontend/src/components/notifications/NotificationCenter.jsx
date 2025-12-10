import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  BellIcon,
  BellAlertIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import './NotificationCenter.css';

const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: ID!) {
    getNotifications(userId: $userId, limit: 50) {
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

const GET_UNREAD_COUNT = gql`
  query GetUnreadCount($userId: ID!) {
    getUnreadCount(userId: $userId) {
      unreadCount
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

const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsRead($userId: ID!) {
    markAllAsRead(userId: $userId) {
      success
      markedCount
    }
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

const NotificationCenter = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const wsRef = useRef(null);

  const { data: notificationData, refetch: refetchNotifications } = useQuery(
    GET_NOTIFICATIONS,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
      pollInterval: 5000,
    }
  );

  const { data: unreadData, refetch: refetchUnreadCount } = useQuery(
    GET_UNREAD_COUNT,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
      pollInterval: 3000,
    }
  );

  const [markAsRead] = useMutation(MARK_AS_READ, {
    onCompleted: () => {
      refetchNotifications();
      refetchUnreadCount();
    },
  });

  const [markAllAsRead] = useMutation(MARK_ALL_AS_READ, {
    onCompleted: () => {
      refetchNotifications();
      refetchUnreadCount();
    },
  });

  const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
    onCompleted: () => {
      refetchNotifications();
      refetchUnreadCount();
    },
  });

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user?.id) return;

    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8080');

      ws.onopen = () => {
        console.log('WebSocket connected');
        ws.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id
        }));
      };

      ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          if (type === 'notification' || type === 'urgent_alert') {
            // Refetch notifications when new one arrives
            refetchNotifications();
            refetchUnreadCount();
            // Play notification sound
            playNotificationSound();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, reconnecting in 3s...');
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user?.id, refetchNotifications, refetchUnreadCount]);

  // Update unread count
  useEffect(() => {
    if (unreadData?.getUnreadCount?.unreadCount !== undefined) {
      setUnreadCount(unreadData.getUnreadCount.unreadCount);
    }
  }, [unreadData]);

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
    audio.play().catch(() => {});
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent_alert':
        return 'bg-red-50 border-red-200';
      case 'ai_insight':
        return 'bg-yellow-50 border-yellow-200';
      case 'status_change':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
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

  const notifications = notificationData?.getNotifications?.notifications || [];
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="notification-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell-button"
        title={`${unreadCount} unread notifications`}
      >
        <BellAlertIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3 className="notification-title">
              Notifications
              {unreadCount > 0 && (
                <span className="notification-count">({unreadCount})</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead({ variables: { userId: user?.id } })}
                className="mark-all-read-btn"
              >
                <CheckIcon className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <BellIcon className="w-8 h-8" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <h4 className="notification-item-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        onClick={() =>
                          markAsRead({ variables: { id: notification.id } })
                        }
                        className="action-btn mark-read"
                        title="Mark as read"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        deleteNotification({ variables: { id: notification.id } })
                      }
                      className="action-btn delete"
                      title="Delete"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <a href="/notifications" className="view-all-link">
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
