import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPVOTE_ISSUE, UPDATE_ISSUE_STATUS } from '../graphql/queries';
import './IssueCard.css';

const STATUS_COLORS = {
  OPEN: '#ef4444',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#10b981',
};

const CATEGORY_ICONS = {
  ACCESSIBILITY: '♿',
  SAFETY: '🚨',
  INFRASTRUCTURE: '🏗️',
  CLEANLINESS: '🧹',
  TRAFFIC: '🚗',
  OTHER: '⭐',
};

export default function IssueCard({ issue }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [upvote] = useMutation(UPVOTE_ISSUE, {
    variables: { id: issue.id },
    optimisticResponse: {
      upvoteIssue: {
        __typename: 'Issue',
        id: issue.id,
        upvotes: issue.upvotes + 1,
      },
    },
  });

  const [updateStatus] = useMutation(UPDATE_ISSUE_STATUS);

  const handleStatusChange = (newStatus) => {
    updateStatus({
      variables: { id: issue.id, status: newStatus },
    });
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return '#6b7280';
    const score = typeof sentiment === 'number' ? sentiment : 0;
    if (score > 0.5) return '#10b981'; // positive
    if (score < -0.5) return '#ef4444'; // negative
    return '#f59e0b'; // neutral
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="issue-card">
      <div className="card-header">
        <div className="card-title-section">
          <span className="category-icon">
            {CATEGORY_ICONS[issue.category] || '⭐'}
          </span>
          <div className="title-content">
            <h3>{issue.title}</h3>
            <span
              className="status-badge"
              style={{ backgroundColor: STATUS_COLORS[issue.status] }}
            >
              {issue.status}
            </span>
          </div>
        </div>
        <button
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <div className="card-description">
        <p>{issue.description.substring(0, 150)}...</p>
      </div>

      <div className="card-meta">
        <span className="meta-item">
          👤 {issue.creator?.name || 'Anonymous'}
        </span>
        <span className="meta-item">
          📅 {formatDate(issue.createdAt)}
        </span>
        <span
          className="meta-item sentiment"
          style={{ color: getSentimentColor(issue.sentiment) }}
        >
          💬 Sentiment: {issue.sentiment ? (issue.sentiment > 0 ? 'Positive' : 'Negative') : 'Neutral'}
        </span>
      </div>

      <div className="card-actions">
        <button className="action-btn upvote-btn" onClick={() => upvote()}>
          👍 {issue.upvotes}
        </button>
        <button className="action-btn comment-btn">
          💬 {issue.commentCount || 0}
        </button>
        <span className="location-badge">
          📍 {Math.random().toFixed(1)} km away
        </span>
      </div>

      {isExpanded && (
        <div className="card-expanded">
          <div className="expanded-section">
            <h4>Details</h4>
            <p>{issue.description}</p>
          </div>

          {issue.aiClassification && (
            <div className="expanded-section">
              <h4>🤖 AI Analysis</h4>
              <p className="ai-classification">
                <strong>Classification:</strong> {issue.aiClassification}
              </p>
              {issue.aiSummary && (
                <p className="ai-summary">
                  <strong>Summary:</strong> {issue.aiSummary}
                </p>
              )}
            </div>
          )}

          <div className="expanded-section">
            <h4>Location</h4>
            <p>
              {issue.location?.address || `${issue.location?.latitude.toFixed(4)}, ${issue.location?.longitude.toFixed(4)}`}
            </p>
          </div>

          {issue.status !== 'RESOLVED' && (
            <div className="expanded-section">
              <h4>Status Update</h4>
              <div className="status-buttons">
                <button
                  className="status-update-btn"
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  disabled={issue.status === 'IN_PROGRESS'}
                >
                  Start Work
                </button>
                <button
                  className="status-update-btn resolve"
                  onClick={() => handleStatusChange('RESOLVED')}
                  disabled={issue.status === 'RESOLVED'}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
