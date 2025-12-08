import config from '../config/config.js';
import { GameProfile } from '../models/GameProfile.js';
import { PointsLog } from '../models/PointsLog.js';

/**
 * Points Engine - Manages XP calculation, level progression, and streaks
 */
export class PointsEngine {
  /**
   * Calculate XP for issue report based on quality score
   * @param {number} qualityScore - 0-100 quality rating of the issue
   * @returns {number} XP amount to award
   */
  static calculateIssueXP(qualityScore = 50) {
    const baseXP = config.game.xp.baseIssueXP;
    const qualityMultiplier = this.getQualityMultiplier(qualityScore);
    return Math.floor(baseXP * qualityMultiplier);
  }

  /**
   * Get quality multiplier based on issue quality score
   * @param {number} score - 0-100 quality score
   * @returns {number} multiplier 1.0-2.0
   */
  static getQualityMultiplier(score) {
    const min = config.game.xp.qualityMultiplierMin;
    const max = config.game.xp.qualityMultiplierMax;
    const normalized = Math.min(100, Math.max(0, score)) / 100;
    return min + normalized * (max - min);
  }

  /**
   * Calculate XP for helpful votes
   * @param {number} voteCount - number of helpful votes
   * @returns {number} XP amount
   */
  static calculateHelpfulVotesXP(voteCount) {
    const xpPerVote = config.game.xp.helpfulVoteXP;
    const cap = config.game.xp.helpfulVoteCapPerPost;
    const cappedVotes = Math.min(voteCount, cap);
    return cappedVotes * xpPerVote;
  }

  /**
   * Calculate streak bonus XP
   * @param {number} streakDays - current streak days
   * @returns {number} bonus XP
   */
  static calculateStreakBonusXP(streakDays) {
    return streakDays * config.game.xp.streakBonusXP;
  }

  /**
   * Award XP to a user and handle level ups
   * @param {string} userId - user ID
   * @param {number} xpAmount - XP to award
   * @param {string} source - source of XP
   * @param {string} reason - detailed reason for XP
   * @param {string} sourceId - reference to the source entity
   * @returns {Promise<object>} updated game profile and awarded details
   */
  static async awardXP(userId, xpAmount, source, reason, sourceId = null) {
    // Prevent null amounts
    if (!xpAmount || xpAmount <= 0) {
      throw new Error('Invalid XP amount');
    }

    // Get current game profile
    let gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      gameProfile = new GameProfile({ userId, totalXP: 0, currentLevel: 1 });
      await gameProfile.save();
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = await PointsLog.find({
      userId,
      createdAt: { $gte: today },
    });

    const totalTodayXP = todayLogs.reduce((sum, log) => sum + log.xpAmount, 0);
    const dailyLimit = config.game.xp.dailyMaxXP;

    const allowedXP = Math.min(xpAmount, Math.max(0, dailyLimit - totalTodayXP));
    if (allowedXP <= 0) {
      return {
        success: false,
        message: 'Daily XP limit reached',
        awardedXP: 0,
      };
    }

    // Store before state
    const beforeState = {
      level: gameProfile.currentLevel,
      xpInLevel: gameProfile.currentXPInLevel,
      totalXP: gameProfile.totalXP,
    };

    // Award XP
    gameProfile.totalXP += allowedXP;
    gameProfile.currentXPInLevel += allowedXP;

    // Check for level up
    const xpPerLevel = config.game.xp.xpPerLevel;
    let leveledUp = false;
    let newAchievements = [];

    while (
      gameProfile.currentXPInLevel >= xpPerLevel &&
      gameProfile.currentLevel < config.game.xp.maxLevel
    ) {
      gameProfile.currentXPInLevel -= xpPerLevel;
      gameProfile.currentLevel += 1;
      leveledUp = true;

      // Update title based on level
      gameProfile.title = this.getLevelTitle(gameProfile.currentLevel);
    }

    // Update game profile
    gameProfile.lastActivityDate = new Date();
    await gameProfile.save();

    // Log the transaction
    const afterState = {
      level: gameProfile.currentLevel,
      xpInLevel: gameProfile.currentXPInLevel,
      totalXP: gameProfile.totalXP,
    };

    const log = new PointsLog({
      userId,
      xpAmount: allowedXP,
      source,
      sourceId,
      reason,
      before: beforeState,
      after: afterState,
    });
    await log.save();

    return {
      success: true,
      awardedXP: allowedXP,
      leveledUp,
      newLevel: gameProfile.currentLevel,
      newTitle: gameProfile.title,
      gameProfile,
    };
  }

  /**
   * Get title for a given level
   * @param {number} level - player level
   * @returns {string} title name
   */
  static getLevelTitle(level) {
    if (level <= 5) return 'Rookie';
    if (level <= 15) return 'Contributor';
    if (level <= 30) return 'Advocate';
    if (level <= 50) return 'Champion';
    return 'Legend';
  }

  /**
   * Update streak for a user
   * @param {string} userId - user ID
   * @returns {Promise<object>} updated streak info
   */
  static async updateStreak(userId) {
    const gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    const now = new Date();
    const lastActivity = gameProfile.lastActivityDate || new Date();

    // Calculate hours since last activity
    const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
    const expiryHours = config.game.xp.streakExpiryHours;

    if (hoursSinceActivity > expiryHours) {
      // Streak expired, reset to 0
      gameProfile.currentStreak = 0;
    } else if (hoursSinceActivity >= 24) {
      // One day passed, increment streak (first activity of the day)
      gameProfile.currentStreak += 1;
      if (gameProfile.currentStreak > gameProfile.longestStreak) {
        gameProfile.longestStreak = gameProfile.currentStreak;
      }
    }

    gameProfile.lastActivityDate = now;
    await gameProfile.save();

    return {
      currentStreak: gameProfile.currentStreak,
      longestStreak: gameProfile.longestStreak,
      streakActive: gameProfile.currentStreak > 0,
    };
  }

  /**
   * Get XP history for a user
   * @param {string} userId - user ID
   * @param {number} skip - pagination skip
   * @param {number} limit - pagination limit
   * @returns {Promise<array>} array of point logs
   */
  static async getXPHistory(userId, skip = 0, limit = 20) {
    const logs = await PointsLog.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return logs;
  }

  /**
   * Get XP summary for a specific period
   * @param {string} userId - user ID
   * @param {Date} startDate - period start
   * @param {Date} endDate - period end
   * @returns {Promise<object>} XP summary
   */
  static async getXPSummary(userId, startDate, endDate) {
    const logs = await PointsLog.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const summary = {
      totalXP: 0,
      bySource: {},
      transactionCount: logs.length,
    };

    logs.forEach((log) => {
      summary.totalXP += log.xpAmount;
      if (!summary.bySource[log.source]) {
        summary.bySource[log.source] = 0;
      }
      summary.bySource[log.source] += log.xpAmount;
    });

    return summary;
  }
}

export default PointsEngine;
