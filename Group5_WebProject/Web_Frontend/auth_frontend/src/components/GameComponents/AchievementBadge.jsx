import React, { useState } from 'react';

/**
 * AchievementBadge Component
 * Displays individual achievement with rarity indicator and unlock status
 */
const AchievementBadge = ({ achievement, isUnlocked = false, onClick = null }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const rarityColors = {
    common: '#8B8B8B',
    rare: '#4A90E2',
    epic: '#9C27B0',
    legendary: '#FFD700',
  };

  const rarityBorders = {
    common: '#5A5A5A',
    rare: '#2E5C8A',
    epic: '#6B1B6B',
    legendary: '#B8A600',
  };

  const rarityLevel = achievement.rarity || 'common';
  const borderColor = rarityBorders[rarityLevel] || rarityBorders.common;
  const backgroundColor = rarityColors[rarityLevel] || rarityColors.common;

  return (
    <div
      className={`achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        className="achievement-icon"
        style={{
          background: isUnlocked ? backgroundColor : '#404040',
          borderColor: isUnlocked ? borderColor : '#606060',
        }}
      >
        <span className="icon-symbol">{achievement.symbol || '🏆'}</span>
        {isUnlocked && <div className="unlock-checkmark">✓</div>}
      </div>

      <div className={`achievement-label ${isUnlocked ? 'unlocked' : 'locked'}`}>
        <h4>{achievement.name}</h4>
        {isUnlocked && <span className="unlock-date">{achievement.unlockedDate}</span>}
      </div>

      {showTooltip && (
        <div className="achievement-tooltip">
          <div className="tooltip-title">{achievement.name}</div>
          <div className="tooltip-rarity">{rarityLevel.toUpperCase()}</div>
          <div className="tooltip-description">{achievement.description}</div>
          {achievement.reward && (
            <div className="tooltip-reward">+{achievement.reward} XP</div>
          )}
          {!isUnlocked && achievement.progress !== undefined && (
            <div className="tooltip-progress">
              Progress: {achievement.progress}%
            </div>
          )}
        </div>
      )}

      <style>{`
        .achievement-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .achievement-badge:hover {
          transform: translateY(-4px);
        }

        .achievement-badge.locked {
          opacity: 0.6;
        }

        .achievement-icon {
          position: relative;
          width: 70px;
          height: 70px;
          border: 3px solid;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .achievement-badge.locked .achievement-icon {
          filter: grayscale(100%);
        }

        .achievement-icon:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .icon-symbol {
          display: block;
          line-height: 1;
        }

        .unlock-checkmark {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #4CAF50;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          border: 2px solid white;
        }

        .achievement-label {
          flex: 1;
        }

        .achievement-label h4 {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 600;
          word-wrap: break-word;
          line-height: 1.2;
        }

        .achievement-label.locked h4 {
          color: #999;
        }

        .unlock-date {
          display: block;
          font-size: 0.7rem;
          color: #4CAF50;
          margin-top: 0.25rem;
          font-weight: 500;
        }

        .achievement-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          width: 180px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          text-align: left;
        }

        .achievement-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #333;
        }

        .tooltip-title {
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
          color: #333;
        }

        .tooltip-rarity {
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tooltip-description {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 0.35rem;
          line-height: 1.3;
        }

        .tooltip-reward {
          font-size: 0.8rem;
          color: #4CAF50;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .tooltip-progress {
          font-size: 0.75rem;
          color: #999;
        }

        @media (max-width: 600px) {
          .achievement-icon {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          .achievement-label h4 {
            font-size: 0.75rem;
          }

          .achievement-tooltip {
            width: 160px;
            padding: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AchievementBadge;
