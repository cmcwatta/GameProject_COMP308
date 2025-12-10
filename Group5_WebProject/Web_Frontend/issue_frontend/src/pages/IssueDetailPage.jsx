import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useAuth } from '../../../shared/AuthContext';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XMarkIcon,
  PaperClipIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconFilled } from '@heroicons/react/24/solid';
import './IssueDetailPage.css';

const GET_ISSUE_DETAIL_QUERY = gql`
  query GetIssueDetail($id: ID!) {
    issue(id: $id) {
      id
      title
      description
      category
      priority
      status
      submitterName
      submitterId
      upvotes
      commentCount
      volunteers {
        userId
        name
      }
      attachments {
        url
        type
        filename
      }
      location {
        address
        coordinates
      }
      createdAt
      updatedAt
    }
    comments(issueId: $id) {
      id
      content
      author
      authorId
      createdAt
      replies {
        id
        content
        author
        authorId
        createdAt
      }
    }
  }
`;

const ADD_COMMENT_MUTATION = gql`
  mutation AddComment($issueId: ID!, $content: String!, $author: String!, $authorId: ID!) {
    addComment(issueId: $issueId, content: $content, author: $author, authorId: $authorId) {
      id
      content
      author
      authorId
      createdAt
    }
  }
`;

const UPVOTE_ISSUE_MUTATION = gql`
  mutation UpvoteIssue($issueId: ID!, $userId: ID!) {
    upvoteIssue(issueId: $issueId, userId: $userId) {
      id
      upvotes
    }
  }
`;

const VOLUNTEER_MUTATION = gql`
  mutation VolunteerForIssue($issueId: ID!, $userId: ID!, $name: String!) {
    volunteersForIssue(issueId: $issueId, userId: $userId, name: $name) {
      id
      volunteers {
        userId
        name
      }
    }
  }
`;

const UPDATE_ISSUE_STATUS_MUTATION = gql`
  mutation UpdateIssueStatus($issueId: ID!, $status: IssueStatus!) {
    updateIssueStatus(issueId: $issueId, status: $status) {
      id
      status
    }
  }
`;

const IssueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_ISSUE_DETAIL_QUERY, {
    variables: { id }
  });

  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT_MUTATION, {
    onSuccess: () => {
      toast.success('Comment added successfully!');
      setCommentText('');
      refetch();
    },
    onError: (err) => toast.error(`Failed to add comment: ${err.message}`)
  });

  const [upvoteIssue, { loading: upvoteLoading }] = useMutation(UPVOTE_ISSUE_MUTATION, {
    onSuccess: () => {
      setHasUpvoted(true);
      toast.success('Issue upvoted!');
      refetch();
    },
    onError: (err) => toast.error(`Failed to upvote: ${err.message}`)
  });

  const [volunteerForIssue, { loading: volunteerLoading }] = useMutation(VOLUNTEER_MUTATION, {
    onSuccess: () => {
      toast.success('You volunteered for this issue!');
      refetch();
    },
    onError: (err) => toast.error(`Failed to volunteer: ${err.message}`)
  });

  const [updateStatus, { loading: statusLoading }] = useMutation(UPDATE_ISSUE_STATUS_MUTATION, {
    onSuccess: () => {
      toast.success('Issue status updated!');
      setSelectedStatus('');
      refetch();
    },
    onError: (err) => toast.error(`Failed to update status: ${err.message}`)
  });

  const issue = data?.issue;
  const comments = data?.comments || [];

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Loading issue details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-error">
        <p>Failed to load issue: {error.message}</p>
        <button onClick={() => navigate('/issues')}>Go Back</button>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="detail-error">
        <p>Issue not found</p>
        <button onClick={() => navigate('/issues')}>Go Back</button>
      </div>
    );
  }

  const isStaff = user?.role === 'admin' || user?.role === 'municipal_staff';
  const isSubmitter = user?.id === issue.submitterId;
  const hasVolunteered = issue.volunteers?.some(v => v.userId === user?.id);

  const getStatusColor = (status) => {
    const colors = {
      open: '#3b82f6',
      assigned: '#8b5cf6',
      in_progress: '#f59e0b',
      resolved: '#10b981',
      closed: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return CheckCircleIcon;
      case 'in_progress':
        return ClockIcon;
      default:
        return ExclamationTriangleIcon;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#dc2626',
      high: '#f97316',
      medium: '#eab308',
      low: '#22c55e'
    };
    return colors[priority] || '#6b7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    addComment({
      variables: {
        issueId: issue.id,
        content: commentText,
        author: user?.username || 'Anonymous',
        authorId: user?.id
      }
    });
  };

  const handleUpvote = () => {
    upvoteIssue({
      variables: {
        issueId: issue.id,
        userId: user?.id
      }
    });
  };

  const handleVolunteer = () => {
    volunteerForIssue({
      variables: {
        issueId: issue.id,
        userId: user?.id,
        name: user?.username || 'Volunteer'
      }
    });
  };

  const handleStatusUpdate = (newStatus) => {
    updateStatus({
      variables: {
        issueId: issue.id,
        status: newStatus
      }
    });
  };

  const StatusIcon = getStatusIcon(issue.status);

  return (
    <div className="detail-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/issues')}>
        <ArrowLeftIcon className="icon" />
        Back to Issues
      </button>

      <div className="detail-layout">
        {/* Main Content */}
        <div className="detail-main">
          {/* Header */}
          <div className="detail-header">
            <div className="header-title-section">
              <h1 className="detail-title">{issue.title}</h1>
              <div className="header-badges">
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(issue.priority) }}
                >
                  {issue.priority?.toUpperCase()}
                </span>
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

            {/* Status Update (Staff Only) */}
            {isStaff && (
              <div className="status-update-section">
                <label className="status-label">Update Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleStatusUpdate(newStatus);
                  }}
                  className="status-select"
                >
                  <option value="">Select new status...</option>
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
          </div>

          {/* Metadata Bar */}
          <div className="metadata-bar">
            <div className="metadata-item">
              <CalendarIcon className="metadata-icon" />
              <div className="metadata-text">
                <span className="metadata-label">Reported</span>
                <span className="metadata-value">{formatDate(issue.createdAt)}</span>
              </div>
            </div>

            {issue.location?.address && (
              <div className="metadata-item">
                <MapPinIcon className="metadata-icon" />
                <div className="metadata-text">
                  <span className="metadata-label">Location</span>
                  <span className="metadata-value">{issue.location.address}</span>
                </div>
              </div>
            )}

            <div className="metadata-item">
              <UserCircleIcon className="metadata-icon" />
              <div className="metadata-text">
                <span className="metadata-label">Reported By</span>
                <span className="metadata-value">{issue.submitterName || 'Anonymous'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h2 className="section-title">Description</h2>
            <p className="description-text">{issue.description}</p>
          </div>

          {/* Attachments */}
          {issue.attachments && issue.attachments.length > 0 && (
            <div className="attachments-section">
              <h2 className="section-title">Attachments</h2>
              <div className="attachments-list">
                {issue.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-item"
                  >
                    <PaperClipIcon className="attachment-icon" />
                    <span>{attachment.filename}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <h2 className="section-title">Comments ({comments.length})</h2>

            {/* Add Comment Form */}
            <div className="add-comment-form">
              <div className="comment-input-wrapper">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or updates..."
                  className="comment-textarea"
                  rows="3"
                />
              </div>
              <button
                onClick={handleAddComment}
                disabled={commentLoading || !commentText.trim()}
                className="comment-submit-btn"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <ChatBubbleLeftIcon className="no-comments-icon" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author || 'Anonymous'}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>

                    {/* Comment Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="comment-replies">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="reply-item">
                            <div className="comment-header">
                              <span className="comment-author">{reply.author || 'Anonymous'}</span>
                              <span className="comment-date">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="comment-content">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleUpvote}
              disabled={upvoteLoading || hasUpvoted}
              className={`action-btn upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
            >
              {hasUpvoted ? (
                <HandThumbUpIconFilled className="btn-icon" />
              ) : (
                <HandThumbUpIcon className="btn-icon" />
              )}
              <span>{issue.upvotes || 0}</span>
              <span className="btn-label">{hasUpvoted ? 'Upvoted' : 'Upvote'}</span>
            </button>

            <button
              onClick={handleVolunteer}
              disabled={volunteerLoading || hasVolunteered}
              className={`action-btn volunteer-btn ${hasVolunteered ? 'volunteered' : ''}`}
            >
              <UserGroupIcon className="btn-icon" />
              <span>{issue.volunteers?.length || 0}</span>
              <span className="btn-label">{hasVolunteered ? 'Volunteering' : 'Volunteer'}</span>
            </button>
          </div>

          {/* Issue Stats */}
          <div className="stats-card">
            <h3 className="stats-title">Issue Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Category</span>
              <span className="stat-value">{issue.category?.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Priority</span>
              <span
                className="stat-value priority-value"
                style={{ color: getPriorityColor(issue.priority) }}
              >
                {issue.priority?.toUpperCase()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span
                className="stat-value status-value"
                style={{ color: getStatusColor(issue.status) }}
              >
                {issue.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Days Open</span>
              <span className="stat-value">
                {Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
          </div>

          {/* Volunteers */}
          {issue.volunteers && issue.volunteers.length > 0 && (
            <div className="volunteers-card">
              <h3 className="card-title">Volunteers ({issue.volunteers.length})</h3>
              <div className="volunteers-list">
                {issue.volunteers.map(volunteer => (
                  <div key={volunteer.userId} className="volunteer-item">
                    <div className="volunteer-avatar">
                      {volunteer.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="volunteer-name">{volunteer.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Summary */}
          <div className="engagement-card">
            <h3 className="card-title">Engagement</h3>
            <div className="engagement-item">
              <HandThumbUpIcon className="engagement-icon" />
              <span>{issue.upvotes || 0} Upvotes</span>
            </div>
            <div className="engagement-item">
              <ChatBubbleLeftIcon className="engagement-icon" />
              <span>{comments.length} Comments</span>
            </div>
            <div className="engagement-item">
              <UserGroupIcon className="engagement-icon" />
              <span>{issue.volunteers?.length || 0} Volunteers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;
