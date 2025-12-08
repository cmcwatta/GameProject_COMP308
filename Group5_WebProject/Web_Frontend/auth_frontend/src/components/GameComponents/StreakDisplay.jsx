import React, { useState, useEffect } from 'react';

/**
 * StreakDisplay Component
 * Shows current streak count with visual representation and streak history
 */
const StreakDisplay = ({ streak = {} }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [streak.currentStreak]);

  const streakData = {
    currentStreak: streak.currentStreak || 0,
    longestStreak: streak.longestStreak || 0,
    totalIssuesContributed: streak.totalIssuesContributed || 0,
    lastActivityDate: streak.lastActivityDate || null,
    streakStartDate: streak.streakStartDate || null,
  };

  const hoursUntilExpiry = 48;
  const streakPercentage =
    ((24 - (new Date().getHours() % 24)) / hoursUntilExpiry) * 100;

  const getStreakLevel = (count) => {
    if (count === 0) return 'cold';
    if (count < 7) return 'warm';
    if (count < 30) return 'hot';
    if (count < 100) return 'blazing';
    return 'legendary';
  };

  const getStreakEmoji = (level) => {
    const emojis = {
      cold: '❄️',
      warm: '🔥',
      hot: '🔥🔥',
      blazing: '🔥🔥🔥',
      legendary: '✨🔥✨',
    };
    return emojis[level] || '❄️';
  };

  const streakLevel = getStreakLevel(streakData.currentStreak);
  const streakEmoji = getStreakEmoji(streakLevel);

  return (
    <div className={`streak-display ${isAnimating ? 'animating' : ''}`}>
      <div className={`streak-icon ${streakLevel}`}>
        <span className="emoji">{streakEmoji}</span>
      </div>

      <div className="streak-info">
        <div className="streak-main">
          <h3>Contribution Streak</h3>
          <div className="streak-count">
            <span className={`count-number ${streakLevel}`}>
              {streakData.currentStreak}
            </span>
            <span className="count-label">days</span>
          </div>
        </div>

        <div className="streak-level-badge" data-level={streakLevel}>
          {streakLevel.charAt(0).toUpperCase() + streakLevel.slice(1)}
        </div>
      </div>

      <div className="streak-expiry">
        <p className="expiry-label">Time until streak expires:</p>
        <div className="expiry-bar">
          <div
            className="expiry-fill"
            style={{ width: `${Math.min(streakPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="expiry-text">
          {Math.ceil((hoursUntilExpiry * (100 - streakPercentage)) / 100)} hours remaining
        </p>
      </div>

      <div className="streak-stats">
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <div>
            <p className="stat-label">Personal Best</p>
            <p className="stat-value">{streakData.longestStreak} days</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div>
            <p className="stat-label">Total Contributions</p>
            <p className="stat-value">{streakData.totalIssuesContributed}</p>
          </div>
        </div>
      </div>

      {streakData.currentStreak > 0 && (
        <div className="streak-message">
          {streakData.currentStreak === 1 && (
            <p>🌟 You've started a new streak! Keep going!</p>
          )}
          {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && (
            <p>🔥 Impressive! You're on fire! {streakData.currentStreak} days strong!</p>
          )}
          {streakData.currentStreak >= 30 && streakData.currentStreak < 100 && (
            <p>🔥🔥 Unstoppable! {streakData.currentStreak} days of dedication!</p>
          )}
          {streakData.currentStreak >= 100 && (
            <p>✨ LEGENDARY! {streakData.currentStreak} days of incredible engagement!</p>
          )}
        </div>
      )}

      <style>{`
        .streak-display {
          background: white;
          border: 2px solid #FFA500;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(255, 165, 0, 0.2);
          transition: all 0.3s ease;
        }

        .streak-display.animating {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(255, 165, 0, 0.3);
        }

        .streak-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 2rem;
          margin-bottom: 1rem;
          border: 3px solid;
          transition: all 0.3s ease;
        }

        .streak-icon.cold {
          background: #E3F2FD;
          border-color: #90CAF9;
        }

        .streak-icon.warm {
          background: #FFF3E0;
          border-color: #FFB74D;
        }

        .streak-icon.hot {
          background: #FFEBEE;
          border-color: #EF5350;
        }

        .streak-icon.blazing {
          background: #FF6F00;
          border-color: #E65100;
          animation: pulse-glow 2s infinite;
        }

        .streak-icon.legendary {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border-color: #FF6F00;
          animation: legendary-pulse 1.5s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
          }
        }

        @keyframes legendary-pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.1);
          }
        }

        .emoji {
          display: block;
          line-height: 1;
        }

        .streak-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .streak-main h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.95rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .streak-count {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }

        .count-number {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .count-number.cold {
          color: #90CAF9;
        }

        .count-number.warm {
          color: #FFB74D;
        }

        .count-number.hot {
          color: #EF5350;
        }

        .count-number.blazing {
          color: #FF6F00;
        }

        .count-number.legendary {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .count-label {
          font-size: 0.9rem;
          color: #999;
          font-weight: 600;
          text-transform: uppercase;
        }

        .streak-level-badge {
          background: #FFF8DC;
          color: #FF8C00;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 2px solid #FFB74D;
        }

        .streak-level-badge[data-level="legendary"] {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          border-color: #FF6F00;
        }

        .streak-expiry {
          margin-bottom: 1.5rem;
        }

        .expiry-label {
          margin: 0 0 0.5rem 0;
          font-size: 0.85rem;
          color: #666;
          font-weight: 600;
        }

        .expiry-bar {
          background: #f0f0f0;
          border-radius: 6px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 0.5rem;
          border: 1px solid #e0e0e0;
        }

        .expiry-fill {
          background: linear-gradient(90deg, #FFA500 0%, #FF6F00 100%);
          height: 100%;
          transition: width 0.3s ease;
        }

        .expiry-text {
          margin: 0;
          font-size: 0.8rem;
          color: #999;
          text-align: right;
        }

        .streak-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-card {
          display: flex;
          gap: 0.75rem;
          background: #f9f9f9;
          padding: 0.75rem;
          border-radius: 8px;
          border-left: 3px solid #FFA500;
        }

        .stat-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .stat-label {
          margin: 0;
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stat-value {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
        }

        .streak-message {
          background: linear-gradient(135deg, #FFF8DC, #FFFACD);
          border: 2px solid #FFD700;
          border-radius: 8px;
          padding: 0.75rem;
          text-align: center;
        }

        .streak-message p {
          margin: 0;
          font-weight: 600;
          color: #CC8800;
        }

        @media (max-width: 600px) {
          .streak-display {
            padding: 1rem;
          }

          .streak-icon {
            width: 70px;
            height: 70px;
            font-size: 1.5rem;
          }

          .count-number {
            font-size: 2rem;
          }

          .streak-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .streak-level-badge {
            align-self: flex-start;
          }

          .streak-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StreakDisplay;
