import { GameProfile } from '../models/GameProfile.js';
import { Leaderboard } from '../models/Leaderboard.js';

/**
 * Leaderboard Engine - Manages leaderboard calculations and rankings
 */
export class LeaderboardEngine {
  /**
   * Get leaderboard for a specific time range
   * @param {string} timeRange - 'all_time', 'monthly', 'weekly', 'daily'
   * @param {number} limit - number of top players to return
   * @param {number} skip - offset for pagination
   * @returns {Promise<object>} leaderboard with rankings
   */
  static async getLeaderboard(timeRange = 'all_time', limit = 100, skip = 0) {
    const period = this.getCurrentPeriod(timeRange);

    // Try to get cached leaderboard
    let leaderboard = await Leaderboard.findOne({ timeRange, period });

    if (!leaderboard) {
      // Recalculate if not cached
      leaderboard = await this.calculateLeaderboard(timeRange, period);
    }

    // Extract rankings with pagination
    const paginatedRankings = (leaderboard.rankings || [])
      .slice(skip, skip + limit)
      .map((ranking, index) => ({
        ...ranking,
        rank: skip + index + 1,
      }));

    return {
      timeRange,
      period,
      rankings: paginatedRankings,
      total: leaderboard.rankings?.length || 0,
      generatedAt: leaderboard.generatedAt,
    };
  }

  /**
   * Calculate leaderboard rankings
   * @param {string} timeRange - time range type
   * @param {string} period - specific period string
   * @returns {Promise<object>} calculated leaderboard document
   */
  static async calculateLeaderboard(timeRange, period) {
    let gameProfiles;

    if (timeRange === 'all_time') {
      // Get all profiles sorted by XP
      gameProfiles = await GameProfile.find({})
        .sort({ totalXP: -1 })
        .limit(1000);
    } else {
      // For other time ranges, would need to query from PointsLog
      // For now, use all-time as fallback
      gameProfiles = await GameProfile.find({})
        .sort({ totalXP: -1 })
        .limit(1000);
    }

    const rankings = gameProfiles.map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId,
      username: profile.username || `User${profile.userId}`,
      xp: profile.totalXP,
      level: profile.currentLevel,
      streak: profile.currentStreak,
      timestamp: new Date(),
    }));

    // Assign tiers based on rank
    rankings.forEach((ranking) => {
      if (ranking.rank <= 10) {
        ranking.tier = 'platinum';
      } else if (ranking.rank <= 100) {
        ranking.tier = 'gold';
      } else if (ranking.rank <= 500) {
        ranking.tier = 'silver';
      } else {
        ranking.tier = 'bronze';
      }
    });

    // Save or update leaderboard
    const leaderboard = await Leaderboard.findOneAndUpdate(
      { timeRange, period },
      {
        rankings,
        totalParticipants: rankings.length,
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return leaderboard;
  }

  /**
   * Get user's rank and position
   * @param {string} userId - user ID
   * @param {string} timeRange - time range type
   * @returns {Promise<object>} user's rank info
   */
  static async getUserRank(userId, timeRange = 'all_time') {
    const period = this.getCurrentPeriod(timeRange);
    let leaderboard = await Leaderboard.findOne({ timeRange, period });

    if (!leaderboard) {
      leaderboard = await this.calculateLeaderboard(timeRange, period);
    }

    const ranking = leaderboard.rankings.find(
      (r) => r.userId.toString() === userId
    );

    if (!ranking) {
      return {
        rank: null,
        xp: 0,
        level: 1,
        tier: 'bronze',
        message: 'User not ranked',
      };
    }

    // Get nearby rankings for context
    const rank = leaderboard.rankings.indexOf(ranking) + 1;
    const nearbyRankings = leaderboard.rankings.slice(
      Math.max(0, rank - 3),
      Math.min(leaderboard.rankings.length, rank + 3)
    );

    return {
      rank,
      xp: ranking.xp,
      level: ranking.level,
      tier: ranking.tier,
      streak: ranking.streak,
      pointsToNextRank: rank > 1 ? leaderboard.rankings[rank - 2].xp - ranking.xp : 0,
      nearbyRankings: nearbyRankings.map((r, i) => ({
        ...r,
        rank: Math.max(0, rank - 3) + i + 1,
      })),
    };
  }

  /**
   * Get leaderboard for a specific tier
   * @param {string} tier - 'bronze', 'silver', 'gold', 'platinum'
   * @param {string} timeRange - time range type
   * @returns {Promise<array>} rankings in the specified tier
   */
  static async getTierLeaderboard(tier, timeRange = 'all_time') {
    const period = this.getCurrentPeriod(timeRange);
    const leaderboard = await Leaderboard.findOne({ timeRange, period });

    if (!leaderboard) {
      throw new Error('Leaderboard not found');
    }

    const tierRankings = leaderboard.rankings
      .filter((r) => r.tier === tier)
      .map((r, index) => ({
        ...r,
        tierRank: index + 1,
      }));

    return tierRankings;
  }

  /**
   * Get top players by category
   * @param {number} limit - number of top players
   * @returns {Promise<array>} top players
   */
  static async getTopPlayers(limit = 10) {
    const gameProfiles = await GameProfile.find({})
      .sort({ totalXP: -1 })
      .limit(limit);

    return gameProfiles.map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId,
      xp: profile.totalXP,
      level: profile.currentLevel,
      title: profile.title,
      streak: profile.currentStreak,
    }));
  }

  /**
   * Get players by achievement unlock count
   * @param {number} limit - number of players
   * @returns {Promise<array>} players sorted by achievements
   */
  static async getTopAchievers(limit = 10) {
    const gameProfiles = await GameProfile.find({})
      .sort({ 'unlockedAchievements': -1 })
      .limit(limit);

    return gameProfiles.map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId,
      achievementsUnlocked: profile.unlockedAchievements.length,
      level: profile.currentLevel,
      xp: profile.totalXP,
    }));
  }

  /**
   * Get players by longest streak
   * @param {number} limit - number of players
   * @returns {Promise<array>} players sorted by longest streak
   */
  static async getTopStreamers(limit = 10) {
    const gameProfiles = await GameProfile.find({})
      .sort({ longestStreak: -1 })
      .limit(limit);

    return gameProfiles.map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId,
      longestStreak: profile.longestStreak,
      currentStreak: profile.currentStreak,
      xp: profile.totalXP,
    }));
  }

  /**
   * Get leaderboard statistics
   * @returns {Promise<object>} overall leaderboard stats
   */
  static async getLeaderboardStats() {
    const allProfiles = await GameProfile.find({});

    const stats = {
      totalPlayers: allProfiles.length,
      averageXP: 0,
      averageLevel: 0,
      maxXP: 0,
      maxLevel: 0,
      tierDistribution: {
        bronze: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
      },
    };

    let totalXP = 0;
    let totalLevel = 0;

    allProfiles.forEach((profile) => {
      totalXP += profile.totalXP;
      totalLevel += profile.currentLevel;

      if (profile.totalXP > stats.maxXP) {
        stats.maxXP = profile.totalXP;
      }
      if (profile.currentLevel > stats.maxLevel) {
        stats.maxLevel = profile.currentLevel;
      }
    });

    stats.averageXP = Math.floor(totalXP / allProfiles.length);
    stats.averageLevel = (totalLevel / allProfiles.length).toFixed(1);

    // Calculate tier distribution
    const tierLimits = {
      platinum: Infinity,
      gold: 100,
      silver: 500,
      bronze: 1000,
    };

    allProfiles.forEach((profile) => {
      if (profile.leaderboardRank <= 10) {
        stats.tierDistribution.platinum++;
      } else if (profile.leaderboardRank <= 100) {
        stats.tierDistribution.gold++;
      } else if (profile.leaderboardRank <= 500) {
        stats.tierDistribution.silver++;
      } else {
        stats.tierDistribution.bronze++;
      }
    });

    return stats;
  }

  /**
   * Recalculate all leaderboards (batch operation)
   * Should be run periodically (hourly, daily, etc.)
   * @returns {Promise<object>} recalculation results
   */
  static async recalculateAllLeaderboards() {
    const timeRanges = ['all_time', 'monthly', 'weekly', 'daily'];
    const results = {};

    for (const timeRange of timeRanges) {
      const period = this.getCurrentPeriod(timeRange);
      results[timeRange] = await this.calculateLeaderboard(timeRange, period);
    }

    return results;
  }

  /**
   * Get current period string for a time range
   * @param {string} timeRange - time range type
   * @returns {string} period identifier
   */
  static getCurrentPeriod(timeRange) {
    const now = new Date();

    switch (timeRange) {
      case 'daily':
        return now.toISOString().split('T')[0]; // YYYY-MM-DD

      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekNum = Math.ceil(now.getDate() / 7);
        const year = now.getFullYear();
        return `${year}-W${weekNum}`;

      case 'monthly':
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      case 'all_time':
      default:
        return 'all_time';
    }
  }
}

export default LeaderboardEngine;
