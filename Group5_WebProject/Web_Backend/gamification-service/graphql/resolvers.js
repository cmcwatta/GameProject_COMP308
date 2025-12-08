import { GameProfile } from '../models/GameProfile.js';
import { Achievement } from '../models/Achievement.js';
import { Challenge } from '../models/Challenge.js';
import { PointsLog } from '../models/PointsLog.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { PointsEngine } from '../engines/pointsEngine.js';
import { AchievementEngine } from '../engines/achievementEngine.js';
import { ChallengeEngine } from '../engines/challengeEngine.js';
import { LeaderboardEngine } from '../engines/leaderboardEngine.js';

export const resolvers = {
  Query: {
    // ============ Game Profile Queries ============
    async gameProfile(_, { userId }) {
      try {
        const profile = await GameProfile.findOne({ userId })
          .populate('unlockedAchievements')
          .populate('joinedChallenges')
          .populate('completedChallenges');

        if (!profile) {
          // Create default profile if doesn't exist
          const newProfile = new GameProfile({ userId });
          await newProfile.save();
          return newProfile;
        }

        return profile;
      } catch (error) {
        throw new Error(`Failed to fetch game profile: ${error.message}`);
      }
    },

    async gameProfileByCurrentUser(_, __, { userId }) {
      if (!userId) throw new Error('User not authenticated');
      return resolvers.Query.gameProfile(_, { userId });
    },

    // ============ Achievement Queries ============
    async achievement(_, { id }) {
      try {
        return await Achievement.findById(id);
      } catch (error) {
        throw new Error(`Failed to fetch achievement: ${error.message}`);
      }
    },

    async achievements(_, { category }) {
      try {
        const query = category ? { category } : {};
        return await Achievement.find(query).sort({ displayOrder: 1 });
      } catch (error) {
        throw new Error(`Failed to fetch achievements: ${error.message}`);
      }
    },

    async userAchievements(_, { userId }) {
      try {
        return await AchievementEngine.getUnlockedAchievements(userId);
      } catch (error) {
        throw new Error(`Failed to fetch user achievements: ${error.message}`);
      }
    },

    async achievementProgress(_, { userId, achievementId }) {
      try {
        return await AchievementEngine.getAchievementProgress(
          userId,
          achievementId
        );
      } catch (error) {
        throw new Error(`Failed to fetch achievement progress: ${error.message}`);
      }
    },

    async achievementStats() {
      try {
        return await AchievementEngine.getAchievementStats();
      } catch (error) {
        throw new Error(`Failed to fetch achievement stats: ${error.message}`);
      }
    },

    // ============ Challenge Queries ============
    async challenge(_, { id }) {
      try {
        return await Challenge.findById(id);
      } catch (error) {
        throw new Error(`Failed to fetch challenge: ${error.message}`);
      }
    },

    async challenges(_, { status, category, difficulty }) {
      try {
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        return await Challenge.find(query).sort({ startDate: -1 });
      } catch (error) {
        throw new Error(`Failed to fetch challenges: ${error.message}`);
      }
    },

    async activeChallenges(_, { category }) {
      try {
        return await ChallengeEngine.getActiveChallenges(category);
      } catch (error) {
        throw new Error(`Failed to fetch active challenges: ${error.message}`);
      }
    },

    async upcomingChallenges(_, { limit = 5 }) {
      try {
        return await ChallengeEngine.getUpcomingChallenges(limit);
      } catch (error) {
        throw new Error(`Failed to fetch upcoming challenges: ${error.message}`);
      }
    },

    async userChallenges(_, { userId, status = 'active' }) {
      try {
        return await ChallengeEngine.getUserChallenges(userId, status);
      } catch (error) {
        throw new Error(`Failed to fetch user challenges: ${error.message}`);
      }
    },

    async challengeProgress(_, { userId, challengeId }) {
      try {
        return await ChallengeEngine.getChallengeProgress(userId, challengeId);
      } catch (error) {
        throw new Error(`Failed to fetch challenge progress: ${error.message}`);
      }
    },

    async challengeStats() {
      try {
        return await ChallengeEngine.getChallengeStats();
      } catch (error) {
        throw new Error(`Failed to fetch challenge stats: ${error.message}`);
      }
    },

    // ============ Leaderboard Queries ============
    async leaderboard(_, { timeRange = 'all_time', limit = 100, skip = 0 }) {
      try {
        return await LeaderboardEngine.getLeaderboard(timeRange, limit, skip);
      } catch (error) {
        throw new Error(`Failed to fetch leaderboard: ${error.message}`);
      }
    },

    async userRank(_, { userId, timeRange = 'all_time' }) {
      try {
        return await LeaderboardEngine.getUserRank(userId, timeRange);
      } catch (error) {
        throw new Error(`Failed to fetch user rank: ${error.message}`);
      }
    },

    async topPlayers(_, { limit = 10 }) {
      try {
        return await LeaderboardEngine.getTopPlayers(limit);
      } catch (error) {
        throw new Error(`Failed to fetch top players: ${error.message}`);
      }
    },

    async topAchievers(_, { limit = 10 }) {
      try {
        return await LeaderboardEngine.getTopAchievers(limit);
      } catch (error) {
        throw new Error(`Failed to fetch top achievers: ${error.message}`);
      }
    },

    async topStreamers(_, { limit = 10 }) {
      try {
        return await LeaderboardEngine.getTopStreamers(limit);
      } catch (error) {
        throw new Error(`Failed to fetch top streamers: ${error.message}`);
      }
    },

    async leaderboardStats() {
      try {
        return await LeaderboardEngine.getLeaderboardStats();
      } catch (error) {
        throw new Error(`Failed to fetch leaderboard stats: ${error.message}`);
      }
    },

    // ============ Points Log Queries ============
    async xpHistory(_, { userId, skip = 0, limit = 20 }) {
      try {
        return await PointsEngine.getXPHistory(userId, skip, limit);
      } catch (error) {
        throw new Error(`Failed to fetch XP history: ${error.message}`);
      }
    },

    async xpSummary(_, { userId, startDate, endDate }) {
      try {
        return await PointsEngine.getXPSummary(
          userId,
          new Date(startDate),
          new Date(endDate)
        );
      } catch (error) {
        throw new Error(`Failed to fetch XP summary: ${error.message}`);
      }
    },
  },

  Mutation: {
    // ============ Points Mutations ============
    async awardXP(_, { userId, amount, source, reason, sourceId }) {
      try {
        return await PointsEngine.awardXP(
          userId,
          amount,
          source,
          reason,
          sourceId
        );
      } catch (error) {
        throw new Error(`Failed to award XP: ${error.message}`);
      }
    },

    async updateStreak(_, { userId }) {
      try {
        return await PointsEngine.updateStreak(userId);
      } catch (error) {
        throw new Error(`Failed to update streak: ${error.message}`);
      }
    },

    // ============ Achievement Mutations ============
    async unlockAchievement(_, { userId, achievementId }) {
      try {
        return await AchievementEngine.unlockAchievement(userId, achievementId);
      } catch (error) {
        throw new Error(`Failed to unlock achievement: ${error.message}`);
      }
    },

    async checkAndUnlockAchievements(_, { userId }) {
      try {
        const newlyUnlocked = await AchievementEngine.checkAndUnlockAchievements(
          userId
        );
        return newlyUnlocked;
      } catch (error) {
        throw new Error(
          `Failed to check and unlock achievements: ${error.message}`
        );
      }
    },

    // ============ Challenge Mutations ============
    async createChallenge(_, { input }) {
      try {
        const challengeData = {
          ...input,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          status: 'upcoming',
        };
        return await ChallengeEngine.createChallenge(challengeData);
      } catch (error) {
        throw new Error(`Failed to create challenge: ${error.message}`);
      }
    },

    async updateChallenge(_, { id, input }) {
      try {
        return await ChallengeEngine.updateChallenge(id, input);
      } catch (error) {
        throw new Error(`Failed to update challenge: ${error.message}`);
      }
    },

    async joinChallenge(_, { userId, challengeId }) {
      try {
        return await ChallengeEngine.joinChallenge(userId, challengeId);
      } catch (error) {
        throw new Error(`Failed to join challenge: ${error.message}`);
      }
    },

    async updateChallengeProgress(_, { userId, challengeId, progressAmount }) {
      try {
        return await ChallengeEngine.updateChallengeProgress(
          userId,
          challengeId,
          progressAmount
        );
      } catch (error) {
        throw new Error(
          `Failed to update challenge progress: ${error.message}`
        );
      }
    },

    async completeChallenge(_, { userId, challengeId }) {
      try {
        return await ChallengeEngine.completeChallenge(userId, challengeId);
      } catch (error) {
        throw new Error(`Failed to complete challenge: ${error.message}`);
      }
    },

    // ============ Leaderboard Mutations ============
    async recalculateLeaderboards() {
      try {
        const results = await LeaderboardEngine.recalculateAllLeaderboards();
        return {
          success: true,
          message: 'Leaderboards recalculated successfully',
          calculatedTimeRanges: Object.keys(results),
        };
      } catch (error) {
        throw new Error(`Failed to recalculate leaderboards: ${error.message}`);
      }
    },
  },

  // ============ Type Resolvers ============
  GameProfile: {
    id: (parent) => parent._id,
    async unlockedAchievements(parent) {
      if (parent.unlockedAchievements) {
        return parent.unlockedAchievements;
      }
      const profile = await GameProfile.findById(parent._id).populate(
        'unlockedAchievements'
      );
      return profile.unlockedAchievements;
    },
    async joinedChallenges(parent) {
      if (parent.joinedChallenges) {
        return parent.joinedChallenges;
      }
      const profile = await GameProfile.findById(parent._id).populate(
        'joinedChallenges'
      );
      return profile.joinedChallenges;
    },
    async completedChallenges(parent) {
      if (parent.completedChallenges) {
        return parent.completedChallenges;
      }
      const profile = await GameProfile.findById(parent._id).populate(
        'completedChallenges'
      );
      return profile.completedChallenges;
    },
  },

  Achievement: {
    id: (parent) => parent._id,
  },

  Challenge: {
    id: (parent) => parent._id,
  },

  PointsLog: {
    id: (parent) => parent._id,
  },

  Leaderboard: {
    id: (parent) => parent._id,
  },
};

export default resolvers;
