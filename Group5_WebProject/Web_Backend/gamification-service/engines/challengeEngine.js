import { GameProfile } from '../models/GameProfile.js';
import { Challenge } from '../models/Challenge.js';
import config from '../config/config.js';

/**
 * Challenge Engine - Manages challenge tracking and completion
 */
export class ChallengeEngine {
  /**
   * Get active challenges
   * @param {string} category - filter by category (optional)
   * @returns {Promise<array>} array of active challenges
   */
  static async getActiveChallenges(category = null) {
    const query = {
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    };

    if (category) {
      query.category = category;
    }

    const challenges = await Challenge.find(query).sort({ difficulty: 1 });
    return challenges;
  }

  /**
   * Get upcoming challenges
   * @param {number} limit - number of challenges to return
   * @returns {Promise<array>} array of upcoming challenges
   */
  static async getUpcomingChallenges(limit = 5) {
    const now = new Date();
    const challenges = await Challenge.find({
      status: 'upcoming',
      startDate: { $gte: now },
    })
      .sort({ startDate: 1 })
      .limit(limit);

    return challenges;
  }

  /**
   * Get challenges for a specific user
   * @param {string} userId - user ID
   * @param {string} status - filter by status ('active', 'completed', etc.)
   * @returns {Promise<array>} user's challenges with progress
   */
  static async getUserChallenges(userId, status = 'active') {
    const gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    let challengeIds = [];

    if (status === 'active') {
      challengeIds = gameProfile.joinedChallenges;
    } else if (status === 'completed') {
      challengeIds = gameProfile.completedChallenges;
    }

    const challenges = await Challenge.find({
      _id: { $in: challengeIds },
      status: 'active',
    });

    // Enrich with user progress
    const enriched = challenges.map((challenge) => {
      const participant = challenge.participants.find(
        (p) => p.userId.toString() === userId
      );
      return {
        ...challenge.toObject(),
        userProgress: participant?.progress || 0,
        userCompleted: participant?.completed || false,
      };
    });

    return enriched;
  }

  /**
   * Join a challenge for a user
   * @param {string} userId - user ID
   * @param {string} challengeId - challenge ID
   * @returns {Promise<object>} join result
   */
  static async joinChallenge(userId, challengeId) {
    const gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Check if already joined
    const alreadyJoined = challenge.participants.some(
      (p) => p.userId.toString() === userId
    );

    if (alreadyJoined) {
      return {
        success: false,
        message: 'Already joined this challenge',
      };
    }

    // Add to challenge participants
    challenge.participants.push({
      userId,
      joinedDate: new Date(),
      progress: 0,
      completed: false,
    });
    await challenge.save();

    // Add to game profile
    gameProfile.joinedChallenges.push(challengeId);
    await gameProfile.save();

    return {
      success: true,
      message: 'Challenge joined successfully',
      challenge,
    };
  }

  /**
   * Update challenge progress for a user
   * @param {string} userId - user ID
   * @param {string} challengeId - challenge ID
   * @param {number} progressAmount - amount to increase progress
   * @returns {Promise<object>} update result with completion status
   */
  static async updateChallengeProgress(userId, challengeId, progressAmount) {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const participant = challenge.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (!participant) {
      throw new Error('User not joined to this challenge');
    }

    // Update progress
    participant.progress += progressAmount;

    // Check for completion
    let completed = false;
    if (
      challenge.progressMetric &&
      participant.progress >= challenge.progressMetric.target
    ) {
      completed = true;
      participant.completed = true;
      participant.completedDate = new Date();
      challenge.completionCount = (challenge.completionCount || 0) + 1;
    }

    await challenge.save();

    return {
      success: true,
      currentProgress: participant.progress,
      targetProgress: challenge.progressMetric?.target,
      completed,
      xpReward: completed ? challenge.xpReward : 0,
    };
  }

  /**
   * Complete a challenge for a user
   * @param {string} userId - user ID
   * @param {string} challengeId - challenge ID
   * @returns {Promise<object>} completion result with rewards
   */
  static async completeChallenge(userId, challengeId) {
    const gameProfile = await GameProfile.findOne({ userId });
    if (!gameProfile) {
      throw new Error('Game profile not found');
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const participant = challenge.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (!participant) {
      throw new Error('User not joined to this challenge');
    }

    if (participant.completed) {
      return {
        success: false,
        message: 'Challenge already completed',
      };
    }

    // Mark as completed
    participant.completed = true;
    participant.completedDate = new Date();
    challenge.completionCount = (challenge.completionCount || 0) + 1;
    await challenge.save();

    // Update game profile
    gameProfile.completedChallenges.push(challengeId);
    await gameProfile.save();

    // Calculate rewards
    let totalReward = challenge.xpReward;
    const bonusRewards = [];

    // Check for bonus rewards
    if (challenge.bonusRewards && challenge.bonusRewards.length > 0) {
      challenge.bonusRewards.forEach((bonus) => {
        // Simplified bonus evaluation - can be extended
        totalReward += bonus.xpBonus;
        bonusRewards.push(bonus);
      });
    }

    return {
      success: true,
      message: 'Challenge completed!',
      challenge,
      totalXPReward: totalReward,
      bonusRewards,
    };
  }

  /**
   * Get challenge progress for a user
   * @param {string} userId - user ID
   * @param {string} challengeId - challenge ID
   * @returns {Promise<object>} detailed progress info
   */
  static async getChallengeProgress(userId, challengeId) {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const participant = challenge.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (!participant) {
      return {
        joined: false,
        progress: 0,
        completed: false,
      };
    }

    const target = challenge.progressMetric?.target || 0;
    const progressPercent = Math.min(100, Math.floor((participant.progress / target) * 100));

    return {
      joined: true,
      challenge,
      currentProgress: participant.progress,
      targetProgress: target,
      progressPercent,
      completed: participant.completed,
      completedDate: participant.completedDate,
      xpReward: challenge.xpReward,
    };
  }

  /**
   * Get challenge statistics
   * @returns {Promise<object>} overall challenge stats
   */
  static async getChallengeStats() {
    const total = await Challenge.countDocuments();
    const active = await Challenge.countDocuments({
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    const challenges = await Challenge.find({});

    const stats = {
      total,
      active,
      byDifficulty: {},
      byCategory: {},
      averageCompletionCount: 0,
    };

    let totalCompletions = 0;

    challenges.forEach((challenge) => {
      // By difficulty
      if (!stats.byDifficulty[challenge.difficulty]) {
        stats.byDifficulty[challenge.difficulty] = 0;
      }
      stats.byDifficulty[challenge.difficulty]++;

      // By category
      if (!stats.byCategory[challenge.category]) {
        stats.byCategory[challenge.category] = 0;
      }
      stats.byCategory[challenge.category]++;

      totalCompletions += challenge.completionCount || 0;
    });

    stats.averageCompletionCount = Math.floor(totalCompletions / total);

    return stats;
  }

  /**
   * Create a new challenge
   * @param {object} challengeData - challenge configuration
   * @returns {Promise<object>} created challenge
   */
  static async createChallenge(challengeData) {
    const challenge = new Challenge({
      ...challengeData,
      participants: [],
      completionCount: 0,
    });

    await challenge.save();
    return challenge;
  }

  /**
   * Update an existing challenge
   * @param {string} challengeId - challenge ID
   * @param {object} updateData - data to update
   * @returns {Promise<object>} updated challenge
   */
  static async updateChallenge(challengeId, updateData) {
    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    return challenge;
  }
}

export default ChallengeEngine;
