import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Analytics Frontend App
 * Modern gamification dashboard with real-time metrics
 */
function App() {
  const [timeRange, setTimeRange] = useState('weekly');
  const [selectedMetric, setSelectedMetric] = useState('xp');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // For now, use mock data since backend REST API isn't set up
        // In production, this would query the GraphQL endpoint
        const mockData = {
          xpTrend: [
            { date: '2024-12-01', xp: 150 },
            { date: '2024-12-02', xp: 250 },
            { date: '2024-12-03', xp: 180 },
            { date: '2024-12-04', xp: 320 },
            { date: '2024-12-05', xp: 290 },
            { date: '2024-12-06', xp: 410 },
            { date: '2024-12-07', xp: 350 },
          ],
          engagementMetrics: {
            totalUsers: 12,
            activeUsers: 8,
            totalIssuesReported: 45,
            totalComments: 187,
            avgSessionTime: '34 mins',
          },
          achievementStats: {
            totalAchievements: 28,
            uniqueEarned: 15,
            averageEarned: 3.2,
          },
          leaderboardTop: [
            { rank: 1, username: 'alice_advocate', xp: 2450, level: 8 },
            { rank: 2, username: 'bob_builder', xp: 1890, level: 7 },
            { rank: 3, username: 'carol_citizen', xp: 1650, level: 6 },
          ]
        };
        
        setDashboardData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const renderXPTrend = () => {
    if (!dashboardData?.xpTrend) return null;

    const maxXP = Math.max(...dashboardData.xpTrend.map(d => d.xp));

    return (
      <div className="chart-container">
        <h3>XP Earned Over Time</h3>
        <div className="chart">
          {dashboardData.xpTrend.map((day, idx) => (
            <div key={idx} className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{
                  height: `${(day.xp / maxXP) * 100}%`,
                  backgroundColor: '#667eea',
                }}
                title={`${day.date}: ${day.xp} XP`}
              ></div>
              <span className="chart-label">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
        <div className="chart-stats">
          <div className="chart-stat">
            <span className="stat-label">Total XP</span>
            <span className="stat-value">
              {dashboardData.xpTrend.reduce((sum, d) => sum + d.xp, 0).toLocaleString()}
            </span>
          </div>
          <div className="chart-stat">
            <span className="stat-label">Average/Day</span>
            <span className="stat-value">
              {Math.round(
                dashboardData.xpTrend.reduce((sum, d) => sum + d.xp, 0) / dashboardData.xpTrend.length
              ).toLocaleString()}
            </span>
          </div>
          <div className="chart-stat">
            <span className="stat-label">Peak Day</span>
            <span className="stat-value">
              {Math.max(...dashboardData.xpTrend.map(d => d.xp)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderEngagementMetrics = () => {
    if (!dashboardData?.engagementMetrics) return null;

    const metrics = dashboardData.engagementMetrics;

    return (
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h4>📝 Issues Reported</h4>
            <span className={`metric-trend ${metrics.issuesChange > 0 ? 'up' : 'down'}`}>
              {metrics.issuesChange > 0 ? '↑' : '↓'} {Math.abs(metrics.issuesChange)}%
            </span>
          </div>
          <p className="metric-value">{metrics.issuesReported}</p>
          <p className="metric-period">{timeRange}</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h4>💬 Comments Written</h4>
            <span className={`metric-trend ${metrics.commentsChange > 0 ? 'up' : 'down'}`}>
              {metrics.commentsChange > 0 ? '↑' : '↓'} {Math.abs(metrics.commentsChange)}%
            </span>
          </div>
          <p className="metric-value">{metrics.commentsWritten}</p>
          <p className="metric-period">{timeRange}</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h4>👍 Helpful Votes</h4>
            <span className={`metric-trend ${metrics.votesChange > 0 ? 'up' : 'down'}`}>
              {metrics.votesChange > 0 ? '↑' : '↓'} {Math.abs(metrics.votesChange)}%
            </span>
          </div>
          <p className="metric-value">{metrics.helpfulVotes}</p>
          <p className="metric-period">{timeRange}</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h4>🎯 Active Users</h4>
            <span className={`metric-trend ${metrics.usersChange > 0 ? 'up' : 'down'}`}>
              {metrics.usersChange > 0 ? '↑' : '↓'} {Math.abs(metrics.usersChange)}%
            </span>
          </div>
          <p className="metric-value">{metrics.activeUsers}</p>
          <p className="metric-period">{timeRange}</p>
        </div>
      </div>
    );
  };

  const renderAchievementStats = () => {
    if (!dashboardData?.achievements) return null;

    const total = dashboardData.achievements.length;
    const unlocked = dashboardData.achievements.filter(a => a.isUnlocked).length;
    const percentage = Math.round((unlocked / total) * 100);

    return (
      <div className="achievement-stats">
        <h3>Achievement Unlock Rate</h3>
        <div className="unlock-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>{unlocked} unlocked</span>
            <span>/</span>
            <span>{total} total</span>
            <span>·</span>
            <span>{percentage}%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    if (!dashboardData?.leaderboard) return null;

    return (
      <div className="leaderboard-section">
        <h3>🏆 Top Players</h3>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Level</th>
              <th>XP</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.leaderboard.slice(0, 10).map((player, idx) => (
              <tr key={player.userId}>
                <td className="rank">#{idx + 1}</td>
                <td className="player">{player.username}</td>
                <td className="level">{player.currentLevel}</td>
                <td className="xp">{player.totalXP.toLocaleString()}</td>
                <td className="tier">{player.tier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="app-container loading">
        <div className="loading-spinner">
          <h2>📊 Loading Analytics Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container error">
        <div className="error-message">
          <h2>⚠️ Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🎮 Gamification Analytics</h1>
          <p>Track engagement, achievements, and community growth</p>
        </div>

        <div className="header-controls">
          <div className="control-group">
            <label>Time Range:</label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="all-time">All Time</option>
            </select>
          </div>

          <div className="control-group">
            <label>Metric:</label>
            <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
              <option value="xp">XP Trends</option>
              <option value="engagement">Engagement</option>
              <option value="achievements">Achievements</option>
              <option value="leaderboard">Leaderboard</option>
            </select>
          </div>
        </div>
      </header>

      <main className="app-main">
        {(selectedMetric === 'xp' || selectedMetric === 'all') && (
          <section className="dashboard-section">
            {renderXPTrend()}
          </section>
        )}

        {(selectedMetric === 'engagement' || selectedMetric === 'all') && (
          <section className="dashboard-section">
            {renderEngagementMetrics()}
          </section>
        )}

        {(selectedMetric === 'achievements' || selectedMetric === 'all') && (
          <section className="dashboard-section">
            {renderAchievementStats()}
          </section>
        )}

        {(selectedMetric === 'leaderboard' || selectedMetric === 'all') && (
          <section className="dashboard-section">
            {renderLeaderboard()}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}

export default App;
