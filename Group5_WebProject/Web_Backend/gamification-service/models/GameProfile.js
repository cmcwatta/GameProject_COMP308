import mongoose from 'mongoose';

const gameProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 50,
    },
    currentXPInLevel: {
      type: Number,
      default: 0,
      min: 0,
    },
    title: {
      type: String,
      default: 'Rookie',
    },
    unlockedAchievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
      },
    ],
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalIssuesReported: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCommentsPosted: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalUpvotesReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    issueResolutionContribution: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinedChallenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
      },
    ],
    completedChallenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
      },
    ],
    leaderboardRank: {
      type: Number,
      default: 0,
    },
    leaderboardTier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    gameStats: {
      favoriteCategory: String,
      mostActiveDay: String,
      engagementScore: {
        type: Number,
        default: 0,
      },
      trustScore: {
        type: Number,
        default: 0,
      },
    },
    lastActivityDate: Date,
    lastLoginDate: Date,
  },
  { timestamps: true }
);

// Index for faster lookups
gameProfileSchema.index({ userId: 1 });
gameProfileSchema.index({ totalXP: -1 });
gameProfileSchema.index({ currentLevel: -1 });
gameProfileSchema.index({ leaderboardRank: 1 });

export const GameProfile = mongoose.model('GameProfile', gameProfileSchema);
