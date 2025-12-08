import React, { useState } from 'react';

/**
 * LeaderboardTable Component
 * Displays ranked list of players with XP, level, and tier information
 */
const LeaderboardTable = ({ players = [], timeRange = 'all-time', currentUserId = null }) => {
  const [sortBy, setSortBy] = useState('xp');
  const [filterTier, setFilterTier] = useState('all');

  const tierColors = {
    platinum: { bg: '#E8D5FF', text: '#7B2CBF', border: '#B088D9' },
    gold: { bg: '#FFF4E6', text: '#E67E22', border: '#FFD89B' },
    silver: { bg: '#F0F4FF', text: '#5DADE2', border: '#AED6F1' },
    bronze: { bg: '#F5F5F5', text: '#7F8C8D', border: '#BDC3C7' },
  };

  const tierEmojis = {
    platinum: '💎',
    gold: '🥇',
    silver: '🥈',
    bronze: '🥉',
  };

  const tierIcons = {
    platinum: '★★★★★',
    gold: '★★★★',
    silver: '★★★',
    bronze: '★★',
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortBy === 'xp') return b.totalXP - a.totalXP;
    if (sortBy === 'level') return b.currentLevel - a.currentLevel;
    return 0;
  });

  const filteredPlayers = filterTier === 'all'
    ? sortedPlayers
    : sortedPlayers.filter(p => p.tier === filterTier);

  const getPlayerRank = (index) => {
    if (index < 10) return 'platinum';
    if (index < 100) return 'gold';
    if (index < 500) return 'silver';
    return 'bronze';
  };

  return (
    <div className="leaderboard-table">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <span className="time-range">{timeRange}</span>
      </div>

      <div className="leaderboard-controls">
        <div className="control-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="xp">Total XP</option>
            <option value="level">Level</option>
          </select>
        </div>

        <div className="control-group">
          <label>Filter by tier:</label>
          <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
            <option value="all">All Tiers</option>
            <option value="platinum">Platinum (Top 10)</option>
            <option value="gold">Gold (Top 100)</option>
            <option value="silver">Silver (Top 500)</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="leaderboard-data">
          <thead>
            <tr>
              <th className="col-rank">Rank</th>
              <th className="col-player">Player</th>
              <th className="col-level">Level</th>
              <th className="col-xp">Total XP</th>
              <th className="col-tier">Tier</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player, index) => {
                const rank = index + 1;
                const tier = getPlayerRank(rank - 1);
                const tierStyle = tierColors[tier] || tierColors.bronze;
                const isCurrentUser = player.userId === currentUserId;

                return (
                  <tr
                    key={player.userId}
                    className={`player-row ${isCurrentUser ? 'current-user' : ''}`}
                    style={{
                      backgroundColor: isCurrentUser ? '#FFFACD' : 'transparent',
                    }}
                  >
                    <td className="col-rank">
                      <span className="rank-badge" style={{ backgroundColor: tierStyle.bg }}>
                        <span className="rank-emoji">{tierEmojis[tier]}</span>
                        <span className="rank-number">#{rank}</span>
                      </span>
                    </td>
                    <td className="col-player">
                      <div className="player-info">
                        <span className="player-name">{player.username}</span>
                        {player.title && <span className="player-title">{player.title}</span>}
                      </div>
                    </td>
                    <td className="col-level">
                      <span className="level-badge">{player.currentLevel}</span>
                    </td>
                    <td className="col-xp">
                      <span className="xp-value">{player.totalXP.toLocaleString()}</span>
                    </td>
                    <td className="col-tier">
                      <span
                        className="tier-badge"
                        style={{
                          backgroundColor: tierStyle.bg,
                          color: tierStyle.text,
                          borderColor: tierStyle.border,
                        }}
                      >
                        {tierIcons[tier]}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No players found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .leaderboard-table {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          border-bottom: 3px solid #5a4a9a;
        }

        .leaderboard-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .time-range {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .leaderboard-controls {
          display: flex;
          gap: 2rem;
          padding: 1rem 1.5rem;
          background: #f9f9f9;
          border-bottom: 1px solid #e0e0e0;
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .control-group label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .control-group select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          color: #333;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .control-group select:hover,
        .control-group select:focus {
          border-color: #667eea;
          outline: none;
        }

        .table-container {
          overflow-x: auto;
        }

        .leaderboard-data {
          width: 100%;
          border-collapse: collapse;
        }

        .leaderboard-data thead {
          background: #f5f5f5;
          border-bottom: 2px solid #ddd;
        }

        .leaderboard-data th {
          padding: 1rem;
          text-align: left;
          font-weight: 700;
          color: #333;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .col-rank { width: 12%; }
        .col-player { width: 35%; }
        .col-level { width: 15%; }
        .col-xp { width: 20%; }
        .col-tier { width: 18%; }

        .leaderboard-data tbody tr {
          border-bottom: 1px solid #e8e8e8;
          transition: background-color 0.2s;
        }

        .leaderboard-data tbody tr:hover {
          background-color: #fafafa;
        }

        .player-row.current-user {
          font-weight: 600;
          border-left: 4px solid #FFD700;
        }

        .leaderboard-data td {
          padding: 1rem;
        }

        .rank-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .rank-emoji {
          font-size: 1.2rem;
        }

        .rank-number {
          white-space: nowrap;
        }

        .player-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .player-name {
          font-weight: 700;
          color: #333;
        }

        .player-title {
          font-size: 0.8rem;
          color: #999;
          font-style: italic;
          font-weight: 500;
        }

        .level-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .xp-value {
          font-weight: 700;
          color: #667eea;
          font-size: 1rem;
        }

        .tier-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border: 2px solid;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }

        .no-data {
          text-align: center;
          color: #999;
          padding: 3rem 1rem !important;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .leaderboard-header {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }

          .leaderboard-header h2 {
            font-size: 1.25rem;
          }

          .leaderboard-controls {
            flex-direction: column;
            gap: 0.75rem;
          }

          .col-rank { width: 10%; }
          .col-player { width: 40%; }
          .col-level { width: 12%; }
          .col-xp { width: 18%; }
          .col-tier { width: 20%; }

          .leaderboard-data th,
          .leaderboard-data td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }

          .player-name {
            font-size: 0.9rem;
          }

          .player-title {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .leaderboard-header h2 {
            font-size: 1.1rem;
          }

          .time-range {
            padding: 0.35rem 0.75rem;
            font-size: 0.8rem;
          }

          .col-rank { width: 15%; }
          .col-player { width: 35%; }
          .col-level { width: 15%; }
          .col-xp { width: 20%; }
          .col-tier { width: 15%; }

          .rank-emoji {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardTable;
