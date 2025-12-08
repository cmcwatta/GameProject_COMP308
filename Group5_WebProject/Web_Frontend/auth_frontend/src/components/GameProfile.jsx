import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GAME_PROFILE } from '../../graphql/queries';
import XPDisplay from './XPDisplay';
import LevelIndicator from './LevelIndicator';
import StreakDisplay from './StreakDisplay';
import AchievementBadge from './AchievementBadge';

/**
 * GameProfile Component
 * Comprehensive game profile dashboard showing all gamification stats and achievements
 */
const GameProfile = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { data, loading, error } = useQuery(GET_GAME_PROFILE, {
    variables: { userId },
  });

  if (loading) return <div className="game-profile loading">Loading game profile...</div>;
  if (error) return <div className="game-profile error">Error loading profile: {error.message}</div>;
  if (!data?.getGameProfile) return <div className="game-profile error">No profile found</div>;

  const profile = data.getGameProfile;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
  ];

  const renderOverview = () => (
    <div className="profile-tab-content">
      <div className="overview-grid">
        <div className="overview-item">
          <XPDisplay userId={userId} />
        </div>

        <div className="overview-item">
          <LevelIndicator
            level={profile.currentLevel}
            totalXP={profile.totalXP}
            nextLevelXP={(profile.currentLevel + 1) * 1000}
          />
        </div>
      </div>

      <div className="overview-section">
        <h3>Current Status</h3>
        <div className="status-grid">
          <div className="status-card">
            <span className="status-icon">📝</span>
            <div className="status-info">
              <p className="status-label">Issues Reported</p>
              <p className="status-value">{profile.stats?.issuesReported || 0}</p>
            </div>
          </div>

          <div className="status-card">
            <span className="status-icon">💬</span>
            <div className="status-info">
              <p className="status-label">Comments Written</p>
              <p className="status-value">{profile.stats?.commentsWritten || 0}</p>
            </div>
          </div>

          <div className="status-card">
            <span className="status-icon">🎯</span>
            <div className="status-info">
              <p className="status-label">Challenges Completed</p>
              <p className="status-value">{profile.stats?.challengesCompleted || 0}</p>
            </div>
          </div>

          <div className="status-card">
            <span className="status-icon">👍</span>
            <div className="status-info">
              <p className="status-label">Helpful Votes</p>
              <p className="status-value">{profile.stats?.helpfulVotes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {profile.streaks && (
        <div className="overview-section">
          <StreakDisplay streak={profile.streaks} />
        </div>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className="profile-tab-content">
      <div className="achievements-container">
        {profile.unlockedAchievements && profile.unlockedAchievements.length > 0 ? (
          <>
            <h3>Unlocked Achievements ({profile.unlockedAchievements.length})</h3>
            <div className="achievements-grid">
              {profile.unlockedAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={true}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="no-data">No achievements unlocked yet. Keep contributing!</p>
        )}

        {profile.lockedAchievements && profile.lockedAchievements.length > 0 && (
          <>
            <h3 className="locked-title">Next Achievements</h3>
            <div className="achievements-grid">
              {profile.lockedAchievements.slice(0, 6).map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={false}
                  onClick={() => console.log('Achievement details:', achievement)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="profile-tab-content">
      <div className="statistics-grid">
        <div className="stat-section">
          <h3>Engagement Metrics</h3>
          <div className="stat-list">
            <div className="stat-row">
              <span className="stat-name">Average Rating</span>
              <span className="stat-number">{(profile.averageRating || 0).toFixed(2)} / 5.0</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Total Comments</span>
              <span className="stat-number">{profile.stats?.commentsWritten || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Helpful Votes Received</span>
              <span className="stat-number">{profile.stats?.helpfulVotes || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Community Impact Score</span>
              <span className="stat-number">{profile.communityImpactScore || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-section">
          <h3>Game Progression</h3>
          <div className="stat-list">
            <div className="stat-row">
              <span className="stat-name">Current Level</span>
              <span className="stat-number">{profile.currentLevel}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Total XP</span>
              <span className="stat-number">{profile.totalXP.toLocaleString()}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Achievements Unlocked</span>
              <span className="stat-number">
                {profile.unlockedAchievements?.length || 0}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Challenges Completed</span>
              <span className="stat-number">{profile.stats?.challengesCompleted || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-section">
          <h3>Ranking</h3>
          <div className="stat-list">
            <div className="stat-row">
              <span className="stat-name">Leaderboard Rank</span>
              <span className="stat-number">#{profile.leaderboardRank || 'N/A'}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Current Tier</span>
              <span className="stat-number" style={{ textTransform: 'capitalize' }}>
                {profile.currentTier || 'Bronze'}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Weekly Rank</span>
              <span className="stat-number">#{profile.weeklyRank || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="game-profile">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{profile.username}</h1>
          {profile.title && <p className="profile-title">{profile.title}</p>}
          <div className="profile-badges">
            <span className="badge level-badge">Level {profile.currentLevel}</span>
            {profile.currentTier && (
              <span className="badge tier-badge">{profile.currentTier}</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="profile-content">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'achievements' && renderAchievements()}
        {selectedTab === 'statistics' && renderStatistics()}
      </div>

      <style>{`
        .game-profile {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .game-profile.loading,
        .game-profile.error {
          padding: 3rem 2rem;
          text-align: center;
          color: #666;
          font-size: 1.1rem;
        }

        .game-profile.error {
          color: #d32f2f;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-bottom: 3px solid #5a4a9a;
        }

        .profile-info h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .profile-title {
          margin: 0.35rem 0;
          font-size: 1rem;
          font-style: italic;
          opacity: 0.9;
        }

        .profile-badges {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.75rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .level-badge {
          background: rgba(255, 255, 255, 0.3);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .tier-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .profile-tabs {
          display: flex;
          border-bottom: 2px solid #e0e0e0;
          background: #f9f9f9;
        }

        .tab-button {
          flex: 1;
          padding: 1rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .tab-button:hover {
          color: #333;
          background: #f0f0f0;
        }

        .tab-button.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .profile-content {
          padding: 2rem;
        }

        .profile-tab-content h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .overview-item {
          width: 100%;
        }

        .overview-section {
          margin-top: 2rem;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }

        .status-card {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: transform 0.2s;
        }

        .status-card:hover {
          transform: translateY(-2px);
        }

        .status-icon {
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .status-info {
          flex: 1;
          min-width: 0;
        }

        .status-label {
          margin: 0;
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-value {
          margin: 0.35rem 0 0 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }

        .achievements-container {
          padding: 1rem 0;
        }

        .locked-title {
          margin-top: 2rem;
          color: #999;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .no-data {
          text-align: center;
          color: #999;
          padding: 2rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .statistics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .stat-section {
          background: #f9f9f9;
          border-radius: 10px;
          padding: 1.5rem;
          border-left: 4px solid #667eea;
        }

        .stat-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #333;
        }

        .stat-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }

        .stat-name {
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .stat-number {
          color: #667eea;
          font-weight: 700;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .profile-header {
            padding: 1.5rem;
          }

          .profile-info h1 {
            font-size: 1.5rem;
          }

          .tab-label {
            display: none;
          }

          .profile-content {
            padding: 1rem;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .status-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .statistics-grid {
            grid-template-columns: 1fr;
          }

          .achievements-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default GameProfile;
