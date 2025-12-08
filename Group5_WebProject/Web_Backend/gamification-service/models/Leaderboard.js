import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    timeRange: {
      type: String,
      enum: ['all_time', 'monthly', 'weekly', 'daily'],
      required: true,
    },
    period: {
      type: String, // e.g., "2025-12", "2025-W48", "2025-12-07"
      required: true,
    },
    rankings: [
      {
        rank: Number,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: String,
        xp: Number,
        level: Number,
        streak: Number,
        timestamp: Date,
      },
    ],
    totalParticipants: {
      type: Number,
      default: 0,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { updatedAt: 'updatedAt' } }
);

// Index for efficient querying
leaderboardSchema.index({ timeRange: 1, period: 1 });
leaderboardSchema.index({ 'rankings.rank': 1 });

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
