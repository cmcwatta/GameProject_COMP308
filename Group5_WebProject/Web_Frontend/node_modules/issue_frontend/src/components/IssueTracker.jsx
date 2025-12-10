import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ISSUES_NEARBY } from '../graphql/queries';
import IssueCard from './IssueCard';
import './IssueTracker.css';

export default function IssueTracker() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(5); // km
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Get user's current location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to city center if geolocation fails
          setLatitude(40.7128);
          setLongitude(-74.006);
          setLoading(false);
        }
      );
    }
  }, []);

  const { data, loading: queryLoading, error, refetch } = useQuery(GET_ISSUES_NEARBY, {
    variables: {
      latitude: latitude || 40.7128,
      longitude: longitude || -74.006,
      radius,
    },
    skip: !latitude || !longitude,
  });

  const issues = data?.getIssuesNearby || [];

  const filteredIssues = filter === 'ALL'
    ? issues
    : issues.filter((issue) => issue.status === filter);

  if (loading) {
    return <div className="tracker-loading">Getting your location...</div>;
  }

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <h2>Issues Near You</h2>
        <p className="subtitle">
          {latitude && longitude
            ? `📍 Showing issues within ${radius} km of your location`
            : 'Loading location...'}
        </p>
      </div>

      <div className="tracker-controls">
        <div className="control-group">
          <label htmlFor="radius">Radius (km):</label>
          <input
            id="radius"
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="radius-slider"
          />
          <span className="radius-value">{radius} km</span>
        </div>

        <div className="control-group filters">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All ({issues.length})
          </button>
          <button
            className={`filter-btn ${filter === 'OPEN' ? 'active' : ''}`}
            onClick={() => setFilter('OPEN')}
          >
            Open ({issues.filter((i) => i.status === 'OPEN').length})
          </button>
          <button
            className={`filter-btn ${filter === 'IN_PROGRESS' ? 'active' : ''}`}
            onClick={() => setFilter('IN_PROGRESS')}
          >
            In Progress ({issues.filter((i) => i.status === 'IN_PROGRESS').length})
          </button>
          <button
            className={`filter-btn ${filter === 'RESOLVED' ? 'active' : ''}`}
            onClick={() => setFilter('RESOLVED')}
          >
            Resolved ({issues.filter((i) => i.status === 'RESOLVED').length})
          </button>
        </div>

        <button onClick={() => refetch()} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {queryLoading ? (
        <div className="tracker-loading">Loading issues...</div>
      ) : error ? (
        <div className="tracker-error">Error loading issues: {error.message}</div>
      ) : filteredIssues.length === 0 ? (
        <div className="tracker-empty">
          <p>📍 No issues found in your area</p>
          <p className="subtitle">Be the first to report one!</p>
        </div>
      ) : (
        <div className="issues-grid">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
