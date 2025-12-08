import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { JOIN_CHALLENGE } from '../../graphql/mutations';

/**
 * ChallengeCard Component
 * Displays challenge information with difficulty, progress, and join/update action
 */
const ChallengeCard = ({ challenge, userProgress = null, onJoin = null }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [joinChallenge] = useMutation(JOIN_CHALLENGE);

  const difficultyColors = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
    epic: '#9C27B0',
  };

  const difficultyEmojis = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐',
    epic: '⭐⭐⭐⭐',
  };

  const difficulty = challenge.difficulty || 'medium';
  const progress = userProgress?.progress || 0;
  const isActive = userProgress?.status === 'active';
  const isCompleted = userProgress?.status === 'completed';

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinChallenge({
        variables: {
          challengeId: challenge.id,
        },
      });
      if (onJoin) onJoin(challenge.id);
    } catch (error) {
      console.error('Failed to join challenge:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const daysRemaining = challenge.endDate
    ? Math.ceil(
        (new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className={`challenge-card ${isCompleted ? 'completed' : isActive ? 'active' : 'available'}`}>
      <div
        className="challenge-header"
        style={{ borderLeftColor: difficultyColors[difficulty] }}
      >
        <div className="challenge-title">
          <h3>{challenge.name}</h3>
          <span className="difficulty-badge">{difficultyEmojis[difficulty]}</span>
        </div>
        {daysRemaining !== null && (
          <span className={`time-remaining ${daysRemaining <= 3 ? 'urgent' : ''}`}>
            {daysRemaining} days left
          </span>
        )}
      </div>

      <div className="challenge-description">
        <p>{challenge.description}</p>
      </div>

      <div className="challenge-stats">
        <div className="stat">
          <span className="stat-label">Difficulty</span>
          <span className="stat-value" style={{ color: difficultyColors[difficulty] }}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Reward</span>
          <span className="stat-value">+{challenge.xpReward} XP</span>
        </div>
        <div className="stat">
          <span className="stat-label">Participants</span>
          <span className="stat-value">{challenge.participantCount || 0}</span>
        </div>
      </div>

      {isActive && userProgress && (
        <div className="challenge-progress">
          <div className="progress-header">
            <span className="progress-label">Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {userProgress.objectivesMet} / {userProgress.totalObjectives} objectives completed
          </p>
        </div>
      )}

      <div className="challenge-action">
        {isCompleted ? (
          <button className="btn-completed" disabled>
            ✓ Completed
          </button>
        ) : isActive ? (
          <button className="btn-active" disabled>
            ✓ Joined
          </button>
        ) : (
          <button
            className="btn-join"
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Challenge'}
          </button>
        )}
      </div>

      <style>{`
        .challenge-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 1.25rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .challenge-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .challenge-card.active {
          border-color: #4A90E2;
          background: linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(74, 144, 226, 0.02) 100%);
        }

        .challenge-card.completed {
          border-color: #4CAF50;
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%);
        }

        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-left: 4px solid;
          padding-left: 1rem;
          margin: -1.25rem -1.25rem 1rem -1.25rem;
          padding: 1rem 1.25rem 1rem 1.25rem;
          background: rgba(0, 0, 0, 0.02);
        }

        .challenge-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .challenge-title h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .difficulty-badge {
          font-size: 1rem;
          white-space: nowrap;
        }

        .time-remaining {
          font-size: 0.8rem;
          background: #FFF3CD;
          color: #856404;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .time-remaining.urgent {
          background: #F8D7DA;
          color: #721C24;
        }

        .challenge-description {
          margin-bottom: 1rem;
        }

        .challenge-description p {
          margin: 0;
          font-size: 0.95rem;
          color: #666;
          line-height: 1.4;
        }

        .challenge-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.35rem;
          font-weight: 600;
        }

        .stat-value {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: #333;
        }

        .challenge-progress {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .progress-label {
          color: #666;
        }

        .progress-percentage {
          color: #4A90E2;
        }

        .progress-bar {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          background: linear-gradient(90deg, #4A90E2 0%, #357ABD 100%);
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          margin: 0;
          font-size: 0.8rem;
          color: #999;
        }

        .challenge-action {
          display: flex;
          gap: 0.75rem;
        }

        .btn-join,
        .btn-active,
        .btn-completed {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-join {
          background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
          color: white;
        }

        .btn-join:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }

        .btn-join:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-active,
        .btn-completed {
          background: #f0f0f0;
          color: #666;
          cursor: default;
        }

        .btn-completed {
          background: #E8F5E9;
          color: #4CAF50;
        }

        @media (max-width: 600px) {
          .challenge-card {
            padding: 1rem;
          }

          .challenge-header {
            flex-direction: column;
            gap: 0.5rem;
            margin: -1rem -1rem 0.75rem -1rem;
            padding: 0.75rem 1rem;
          }

          .challenge-title {
            flex-direction: column;
            align-items: flex-start;
          }

          .challenge-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ChallengeCard;
