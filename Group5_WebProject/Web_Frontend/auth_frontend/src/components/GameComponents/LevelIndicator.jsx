import React, { useState } from 'react';

/**
 * LevelIndicator Component
 * Shows level progression with visual representation and stats
 */
const LevelIndicator = ({ level = 1, totalXP = 0, nextLevelXP = 1000 }) => {
  const [showDetails, setShowDetails] = useState(false);

  const levelTitles = {
    1: 'Novice',
    5: 'Apprentice',
    10: 'Journeyman',
    20: 'Master',
    30: 'Expert',
    40: 'Legendary',
    50: 'Mythic',
  };

  const getLevelTitle = () => {
    for (let threshold = 50; threshold >= 1; threshold--) {
      if (level >= threshold && levelTitles[threshold]) {
        return levelTitles[threshold];
      }
    }
    return 'Novice';
  };

  const currentLevelXP = level * 1000;
  const xpInLevel = totalXP - currentLevelXP;
  const maxXPInLevel = nextLevelXP - currentLevelXP;
  const progressPercent = (xpInLevel / maxXPInLevel) * 100;

  const getLevelColor = (lvl) => {
    if (lvl < 5) return '#4A90E2'; // Blue
    if (lvl < 10) return '#9C27B0'; // Purple
    if (lvl < 20) return '#F44336'; // Red
    if (lvl < 30) return '#FF9800'; // Orange
    if (lvl < 40) return '#FFD700'; // Gold
    if (lvl === 50) return '#00FF00'; // Green
    return '#E91E63'; // Pink
  };

  const getRewardMilestones = () => {
    const milestones = [];
    for (let i = 5; i <= Math.min(level + 5, 50); i += 5) {
      milestones.push({
        level: i,
        bonus: i * 50,
        unlocked: level >= i,
      });
    }
    return milestones;
  };

  const getAbilityUnlocks = () => {
    const abilities = {
      5: 'Unlock: Advanced Reporting',
      10: 'Unlock: Community Voting',
      15: 'Unlock: Custom Challenges',
      20: 'Unlock: Mentorship Program',
      30: 'Unlock: Leaderboard Ranking',
      40: 'Unlock: Special Badge',
      50: 'Unlock: Legend Status',
    };
    return abilities[level] || null;
  };

  const levelColor = getLevelColor(level);

  return (
    <div className="level-indicator">
      <div className="level-header" onClick={() => setShowDetails(!showDetails)}>
        <div className="level-display" style={{ borderColor: levelColor }}>
          <div className="level-number" style={{ color: levelColor }}>
            {level}
          </div>
          <div className="level-title">{getLevelTitle()}</div>
        </div>

        <div className="level-progress">
          <div className="progress-header">
            <span className="progress-xp">{xpInLevel.toLocaleString()}</span>
            <span className="progress-slash">/</span>
            <span className="progress-max">{maxXPInLevel.toLocaleString()}</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(progressPercent, 100)}%`,
                background: levelColor,
              }}
            ></div>
          </div>
          <div className="progress-percent">{Math.round(progressPercent)}%</div>
        </div>

        <div className="expand-icon">{showDetails ? '▼' : '▶'}</div>
      </div>

      {showDetails && (
        <div className="level-details">
          <div className="details-section">
            <h4>Milestone Rewards</h4>
            <div className="milestones-list">
              {getRewardMilestones().map((milestone) => (
                <div
                  key={milestone.level}
                  className={`milestone ${milestone.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <span className="milestone-level">Level {milestone.level}</span>
                  <span className="milestone-bonus">+{milestone.bonus} XP Bonus</span>
                  {milestone.unlocked && <span className="milestone-check">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {getAbilityUnlocks() && (
            <div className="details-section">
              <h4>Next Unlock</h4>
              <div className="ability-unlock">
                <span className="unlock-emoji">✨</span>
                <span className="unlock-text">{getAbilityUnlocks()}</span>
              </div>
            </div>
          )}

          <div className="details-section">
            <h4>Level Stats</h4>
            <div className="level-stats">
              <div className="stat-item">
                <span className="stat-name">Total XP Earned</span>
                <span className="stat-value">{totalXP.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">XP to Next Level</span>
                <span className="stat-value">{(nextLevelXP - totalXP).toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Level Progress</span>
                <span className="stat-value">{Math.round(progressPercent)}%</span>
              </div>
            </div>
          </div>

          <div className="details-section info-section">
            <p>
              Level represents your overall engagement and contribution level. Each level brings new
              features, rewards, and opportunities to engage with the community!
            </p>
          </div>
        </div>
      )}

      <style>{`
        .level-indicator {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .level-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem;
          cursor: pointer;
          user-select: none;
          background: linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(148, 39, 177, 0.05) 100%);
          transition: background 0.2s;
        }

        .level-header:hover {
          background: linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(148, 39, 177, 0.1) 100%);
        }

        .level-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          border: 3px solid;
          border-radius: 50%;
          background: white;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .level-header:hover .level-display {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .level-number {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .level-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.35rem;
          color: #666;
        }

        .level-progress {
          flex: 1;
          min-width: 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .progress-xp {
          color: #333;
        }

        .progress-slash {
          color: #999;
          margin: 0 0.25rem;
        }

        .progress-max {
          color: #999;
        }

        .progress-percent {
          text-align: right;
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.35rem;
          font-weight: 600;
        }

        .progress-bar-container {
          background: #e0e0e0;
          border-radius: 10px;
          height: 12px;
          overflow: hidden;
          border: 1px solid #ccc;
        }

        .progress-bar {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 10px;
        }

        .expand-icon {
          font-size: 1.2rem;
          color: #666;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .level-header:hover .expand-icon {
          color: #333;
        }

        .level-details {
          background: #f9f9f9;
          border-top: 1px solid #e0e0e0;
          padding: 1.5rem;
          max-height: 500px;
          overflow-y: auto;
        }

        .details-section {
          margin-bottom: 1.5rem;
        }

        .details-section:last-child {
          margin-bottom: 0;
        }

        .details-section h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #333;
        }

        .milestones-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .milestone {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .milestone.unlocked {
          background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
          border-color: #4CAF50;
        }

        .milestone.locked {
          opacity: 0.6;
        }

        .milestone-level {
          font-weight: 600;
          color: #333;
        }

        .milestone-bonus {
          color: #666;
        }

        .milestone-check {
          color: #4CAF50;
          font-weight: 700;
        }

        .ability-unlock {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%);
          border: 2px solid #FFB74D;
          border-radius: 8px;
          padding: 1rem;
        }

        .unlock-emoji {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .unlock-text {
          font-weight: 600;
          color: #E65100;
        }

        .level-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          background: white;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }

        .stat-name {
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: #333;
        }

        .info-section {
          background: #E3F2FD;
          border-left: 3px solid #2196F3;
          padding: 0.75rem;
          border-radius: 4px;
        }

        .info-section p {
          margin: 0;
          font-size: 0.85rem;
          color: #1565C0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .level-header {
            gap: 1rem;
            padding: 1rem;
            flex-wrap: wrap;
          }

          .level-display {
            width: 90px;
            height: 90px;
          }

          .level-number {
            font-size: 2rem;
          }

          .level-progress {
            width: 100%;
          }

          .level-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .level-display {
            width: 80px;
            height: 80px;
          }

          .level-number {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LevelIndicator;
