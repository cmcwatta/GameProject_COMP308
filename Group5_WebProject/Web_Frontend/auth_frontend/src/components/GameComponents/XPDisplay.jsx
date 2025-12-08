import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GAME_PROFILE } from '../../graphql/queries';

/**
 * XPDisplay Component
 * Shows current XP, progress to next level, and daily XP earned
 */
const XPDisplay = ({ userId }) => {
  const [xpData, setXpData] = useState(null);
  const { data, loading, error } = useQuery(GET_GAME_PROFILE, {
    variables: { userId },
    pollInterval: 5000, // Update every 5 seconds
  });

  useEffect(() => {
    if (data?.getGameProfile) {
      const profile = data.getGameProfile;
      const nextLevelXP = (profile.currentLevel + 1) * 1000;
      const currentLevelXP = profile.currentLevel * 1000;
      const xpInLevel = profile.totalXP - currentLevelXP;
      const xpToNextLevel = nextLevelXP - profile.totalXP;
      const xpProgress = (xpInLevel / (nextLevelXP - currentLevelXP)) * 100;

      setXpData({
        totalXP: profile.totalXP,
        currentLevel: profile.currentLevel,
        xpProgress,
        xpInLevel,
        xpToNextLevel,
        nextLevelXP,
        currentLevelXP,
      });
    }
  }, [data]);

  if (loading) return <div className="xp-display loading">Loading XP data...</div>;
  if (error) return <div className="xp-display error">Error loading XP</div>;
  if (!xpData) return null;

  return (
    <div className="xp-display">
      <div className="xp-header">
        <h3>Experience Points</h3>
        <span className="total-xp">{xpData.totalXP.toLocaleString()} XP</span>
      </div>

      <div className="level-section">
        <div className="level-badge">
          <span className="level-number">{xpData.currentLevel}</span>
          <span className="level-label">Level</span>
        </div>
        <div className="xp-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${xpData.xpProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="xp-current">{xpData.xpInLevel.toLocaleString()}</span>
            <span className="xp-separator">/</span>
            <span className="xp-next">{(xpData.nextLevelXP - xpData.currentLevelXP).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="xp-milestone">
        <p>
          <strong>{xpData.xpToNextLevel.toLocaleString()}</strong> XP until Level {xpData.currentLevel + 1}
        </p>
      </div>

      <style>{`
        .xp-display {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 1.5rem;
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .xp-display.loading,
        .xp-display.error {
          background: linear-gradient(135deg, #ccc 0%, #999 100%);
          text-align: center;
          padding: 2rem;
        }

        .xp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 0.75rem;
        }

        .xp-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .total-xp {
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .level-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .level-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border: 3px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .level-number {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }

        .level-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.25rem;
          opacity: 0.9;
        }

        .xp-progress {
          flex: 1;
        }

        .progress-bar {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          height: 24px;
          overflow: hidden;
          margin-bottom: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .progress-fill {
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          height: 100%;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .xp-separator {
          margin: 0 0.35rem;
        }

        .xp-milestone {
          background: rgba(0, 0, 0, 0.1);
          border-left: 3px solid #4facfe;
          padding: 0.75rem;
          border-radius: 4px;
          text-align: center;
        }

        .xp-milestone p {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .xp-display {
            padding: 1rem;
          }

          .level-section {
            flex-direction: column;
            align-items: center;
          }

          .xp-progress {
            width: 100%;
          }

          .level-badge {
            width: 70px;
            height: 70px;
          }

          .level-number {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default XPDisplay;
