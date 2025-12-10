import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { gql } from 'graphql-tag';
import { useAuth } from '../../../shared/AuthContext';
import toast from 'react-hot-toast';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import './IssueListPage.css';

const GET_ISSUES_QUERY = gql`
  query GetIssues($status: IssueStatus, $category: IssueCategory, $limit: Int, $offset: Int) {
    issues(status: $status, category: $category, limit: $limit, offset: $offset) {
      id
      title
      description
      category
      priority
      status
      submitterName
      upvotes
      commentCount
      volunteers {
        userId
        name
      }
      location {
        address
        coordinates
      }
      createdAt
      updatedAt
    }
  }
`;

const IssueListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ISSUES_QUERY, {
    variables: {
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      limit: 50,
      offset: 0
    }
  });

  const issues = data?.issues || [];

  // Filter and sort locally
  const filteredIssues = useMemo(() => {
    let filtered = [...issues];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term) ||
        issue.submitterName?.toLowerCase().includes(term)
      );
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'upvotes':
        filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        break;
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      default:
        break;
    }

    return filtered;
  }, [issues, searchTerm, priorityFilter, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#3b82f6';
      case 'assigned':
        return '#8b5cf6';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return CheckCircleIcon;
      case 'in_progress':
        return ClockIcon;
      case 'open':
        return ExclamationTriangleIcon;
      default:
        return ExclamationTriangleIcon;
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="issue-list-container">
      {/* Header */}
      <div className="list-header">
        <div className="header-top">
          <h1 className="list-title">Community Issues</h1>
          <div className="view-toggle">
            <button className="toggle-btn active">List View</button>
            <button className="toggle-btn">Map View</button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="search-bar-wrapper">
          <div className="search-bar">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search issues by title, location, or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="icon" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                <option value="pothole">Pothole / Road Damage</option>
                <option value="streetlight">Street Light</option>
                <option value="debris">Garbage / Debris</option>
                <option value="drainage">Water / Drainage</option>
                <option value="graffiti">Graffiti</option>
                <option value="vegetation">Tree / Vegetation</option>
                <option value="sidewalk">Sidewalk Damage</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest</option>
                <option value="upvotes">Most Upvotes</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <button
              className="reset-filters-btn"
              onClick={() => {
                setStatusFilter('');
                setCategoryFilter('');
                setPriorityFilter('');
                setSortBy('recent');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="results-info">
          {filteredIssues.length === 0 ? (
            <p>No issues found</p>
          ) : (
            <p>
              Showing <strong>{filteredIssues.length}</strong> issue{filteredIssues.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading issues...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p className="error-text">Failed to load issues: {error.message}</p>
          <div className="error-help">
            <h3>Troubleshooting:</h3>
            <ul>
              <li>Make sure the Issue Service backend is running on port 4003</li>
              <li>Check that MongoDB is connected and has issue data</li>
              <li>Try seeding sample data by running: <code>node seed.js</code> in the issue-service folder</li>
            </ul>
          </div>
          <button className="retry-btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {/* Issues List */}
      {!loading && !error && (
        <div className="issues-list">
          {filteredIssues.length === 0 ? (
            <div className="empty-state">
              <ExclamationTriangleIcon className="empty-icon" />
              <h3>No Issues Found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredIssues.map(issue => {
              const StatusIcon = getStatusIcon(issue.status);
              return (
                <div key={issue.id} className="issue-card">
                  {/* Status Bar */}
                  <div
                    className="issue-status-bar"
                    style={{ backgroundColor: getStatusColor(issue.status) }}
                  ></div>

                  {/* Card Content */}
                  <div className="issue-card-content">
                    {/* Header */}
                    <div className="issue-card-header">
                      <div className="issue-title-section">
                        <h3 className="issue-title">{issue.title}</h3>
                        <div className="issue-badges">
                          {/* Priority Badge */}
                          <span
                            className="priority-badge"
                            style={{
                              backgroundColor: getPriorityBadgeColor(issue.priority),
                              color: 'white'
                            }}
                          >
                            {issue.priority?.toUpperCase()}
                          </span>

                          {/* Status Badge */}
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: `${getStatusColor(issue.status)}20`,
                              color: getStatusColor(issue.status),
                              borderColor: getStatusColor(issue.status)
                            }}
                          >
                            <StatusIcon className="badge-icon" />
                            {issue.status?.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="issue-description">
                      {issue.description?.length > 150
                        ? `${issue.description.substring(0, 150)}...`
                        : issue.description}
                    </p>

                    {/* Metadata */}
                    <div className="issue-metadata">
                      <div className="metadata-item">
                        <CalendarIcon className="metadata-icon" />
                        <span>{formatDate(issue.createdAt)}</span>
                      </div>

                      {issue.location?.address && (
                        <div className="metadata-item">
                          <MapPinIcon className="metadata-icon" />
                          <span>{issue.location.address}</span>
                        </div>
                      )}

                      <div className="metadata-item">
                        <span className="reporter">by {issue.submitterName || 'Anonymous'}</span>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="engagement-stats">
                      <div className="stat">
                        <HandThumbUpIcon className="stat-icon" />
                        <span>{issue.upvotes || 0}</span>
                      </div>

                      <div className="stat">
                        <ChatBubbleLeftIcon className="stat-icon" />
                        <span>{issue.commentCount || 0}</span>
                      </div>

                      {issue.volunteers && issue.volunteers.length > 0 && (
                        <div className="stat">
                          <UserGroupIcon className="stat-icon" />
                          <span>{issue.volunteers.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="issue-card-footer">
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default IssueListPage;
