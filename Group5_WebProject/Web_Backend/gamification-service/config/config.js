import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.GAMIFICATION_SERVICE_PORT || 4003,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-platform',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
  
  // Game Economy
  game: {
    xp: {
      baseIssueXP: parseInt(process.env.BASE_ISSUE_XP) || 10,
      qualityMultiplierMin: parseFloat(process.env.QUALITY_MULTIPLIER_MIN) || 1.0,
      qualityMultiplierMax: parseFloat(process.env.QUALITY_MULTIPLIER_MAX) || 2.0,
      commentXP: parseInt(process.env.COMMENT_XP) || 5,
      issueResolutionXP: parseInt(process.env.ISSUE_RESOLUTION_XP) || 50,
      helpfulVoteXP: parseInt(process.env.HELPFUL_VOTE_XP) || 1,
      helpfulVoteCapPerPost: parseInt(process.env.HELPFUL_VOTE_CAP_PER_POST) || 10,
      xpPerLevel: parseInt(process.env.XP_PER_LEVEL) || 100,
      maxLevel: parseInt(process.env.MAX_LEVEL) || 50,
      dailyMaxXP: parseInt(process.env.DAILY_MAX_XP) || 500,
      streakBonusXP: parseInt(process.env.STREAK_BONUS_XP) || 5,
      streakExpiryHours: parseInt(process.env.STREAK_EXPIRY_HOURS) || 48,
    },
    challenges: {
      easyXP: parseInt(process.env.EASY_CHALLENGE_XP) || 25,
      mediumXP: parseInt(process.env.MEDIUM_CHALLENGE_XP) || 50,
      hardXP: parseInt(process.env.HARD_CHALLENGE_XP) || 100,
      epicXP: parseInt(process.env.EPIC_CHALLENGE_XP) || 200,
    },
    leaderboard: {
      updateFrequency: process.env.LEADERBOARD_UPDATE_FREQUENCY || 'hourly',
      displayTop: parseInt(process.env.LEADERBOARD_DISPLAY_TOP) || 100,
    }
  }
};

export default config;
