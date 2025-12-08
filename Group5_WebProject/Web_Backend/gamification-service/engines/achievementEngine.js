import { GameProfile } from '../models/GameProfile.js';
import { Achievement } from '../models/Achievement.js';

/**
 * Achievement Engine - Manages achievement unlocking and badge system
 */
export class AchievementEngine {
  /**
   * Unlock an achievement for a user
   * @param {string} userId - user ID
   * @param {string} achievementId - achievement ID
   * @returns {Promise<object>} unlock result with achievement details
   */
  static async unlockAchievement(userId, achievementId) {
    const gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      throw new Error('Achievement not found');
    }

    // Check if already unlocked
    if (gameProfile.unlockedAchievements.includes(achievementId)) {
      return {
        success: false,
        message: 'Achievement already unlocked',
        achievement,
      };
    }

    // Add to unlocked achievements
    gameProfile.unlockedAchievements.push(achievementId);
    await gameProfile.save();

    // Increment unlock count on achievement
    achievement.unlockedCount = (achievement.unlockedCount || 0) + 1;
    await achievement.save();

    return {
      success: true,
      message: 'Achievement unlocked!',
      achievement,
      xpReward: achievement.xpReward,
    };
  }

  /**
   * Check and auto-unlock achievements based on user progress
   * @param {string} userId - user ID
   * @returns {Promise<array>} array of newly unlocked achievements
   */
  static async checkAndUnlockAchievements(userId) {
    const gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    const allAchievements = await Achievement.find({
      _id: { $nin: gameProfile.unlockedAchievements },
    });

    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      const shouldUnlock = await this.checkUnlockCondition(
        userId,
        gameProfile,
        achievement
      );

      if (shouldUnlock) {
        gameProfile.unlockedAchievements.push(achievement._id);
        achievement.unlockedCount = (achievement.unlockedCount || 0) + 1;

        newlyUnlocked.push({
          achievement,
          xpReward: achievement.xpReward,
        });

        await achievement.save();
      }
    }

    if (newlyUnlocked.length > 0) {
      await gameProfile.save();
    }

    return newlyUnlocked;
  }

  /**
   * Check if an achievement unlock condition is met
   * @param {string} userId - user ID
   * @param {object} gameProfile - game profile object
   * @param {object} achievement - achievement object
   * @returns {Promise<boolean>} whether condition is met
   */
  static async checkUnlockCondition(userId, gameProfile, achievement) {
    const { type, target, metric } = achievement.unlockCondition;

    switch (metric) {
      // Civic actions - based on issue reports
      case 'issues_reported':
        return (
          type === 'count' &&
          gameProfile.totalIssuesReported >= target
        );

      // Community engagement - based on upvotes
      case 'upvotes_received':
        return (
          type === 'count' &&
          gameProfile.totalUpvotesReceived >= target
        );

      // Consistency - based on streaks
      case 'day_streak':
        return type === 'streak' && gameProfile.currentStreak >= target;

      // Consistency - longest streak
      case 'longest_streak':
        return type === 'streak' && gameProfile.longestStreak >= target;

      // Level-based achievements
      case 'level_reached':
        return type === 'score' && gameProfile.currentLevel >= target;

      // Comments posted
      case 'comments_posted':
        return (
          type === 'count' &&
          gameProfile.totalCommentsPosted >= target
        );

      // Issue resolution contributions
      case 'resolution_contributions':
        return (
          type === 'count' &&
          gameProfile.issueResolutionContribution >= target
        );

      // Special conditions
      case 'special_event':
        // Handle special achievements (seasonal, timed, etc.)
        return await this.checkSpecialCondition(userId, achievement);

      default:
        return false;
    }
  }

  /**
   * Check special/custom unlock conditions
   * @param {string} userId - user ID
   * @param {object} achievement - achievement object
   * @returns {Promise<boolean>} whether condition is met
   */
  static async checkSpecialCondition(userId, achievement) {
    // Implement custom logic for special achievements
    // For now, return false - can be extended in future
    return false;
  }

  /**
   * Get all unlocked achievements for a user
   * @param {string} userId - user ID
   * @returns {Promise<array>} array of achievement objects
   */
  static async getUnlockedAchievements(userId) {
    const gameProfile = await GameProfile.findOne({ userId }).populate(
      'unlockedAchievements'
    );

    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    return gameProfile.unlockedAchievements;
  }

  /**
   * Get progress toward specific achievements
   * @param {string} userId - user ID
   * @param {string} achievementId - achievement ID
   * @returns {Promise<object>} progress details
   */
  static async getAchievementProgress(userId, achievementId) {
    const gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      throw new Error('Achievement not found');
    }

    const isUnlocked = gameProfile.unlockedAchievements.includes(achievementId);

    const { type, target, metric } = achievement.unlockCondition;
    let currentProgress = 0;

    switch (metric) {
      case 'issues_reported':
        currentProgress = gameProfile.totalIssuesReported;
        break;
      case 'upvotes_received':
        currentProgress = gameProfile.totalUpvotesReceived;
        break;
      case 'day_streak':
        currentProgress = gameProfile.currentStreak;
        break;
      case 'longest_streak':
        currentProgress = gameProfile.longestStreak;
        break;
      case 'level_reached':
        currentProgress = gameProfile.currentLevel;
        break;
      case 'comments_posted':
        currentProgress = gameProfile.totalCommentsPosted;
        break;
      case 'resolution_contributions':
        currentProgress = gameProfile.issueResolutionContribution;
        break;
    }

    const progressPercent = Math.min(100, Math.floor((currentProgress / target) * 100));

    return {
      achievement,
      isUnlocked,
      currentProgress,
      target,
      progressPercent,
      metric,
    };
  }

  /**
   * Get achievement statistics
   * @returns {Promise<object>} overall achievement stats
   */
  static async getAchievementStats() {
    const totalAchievements = await Achievement.countDocuments();
    const achievements = await Achievement.find({});

    const stats = {
      total: totalAchievements,
      byCategory: {},
      byRarity: {},
      averageUnlockCount: 0,
    };

    let totalUnlocks = 0;

    achievements.forEach((achievement) => {
      // By category
      if (!stats.byCategory[achievement.category]) {
        stats.byCategory[achievement.category] = 0;
      }
      stats.byCategory[achievement.category]++;

      // By rarity
      if (!stats.byRarity[achievement.rarity]) {
        stats.byRarity[achievement.rarity] = 0;
      }
      stats.byRarity[achievement.rarity]++;

      totalUnlocks += achievement.unlockedCount || 0;
    });

    stats.averageUnlockCount = Math.floor(totalUnlocks / totalAchievements);

    return stats;
  }
}

export default AchievementEngine;
