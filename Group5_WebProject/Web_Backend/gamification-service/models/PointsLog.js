import mongoose from 'mongoose';

const pointsLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    xpAmount: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: [
        'issue_report',
        'comment',
        'helpful_vote',
        'challenge_complete',
        'achievement_unlock',
        'streak_bonus',
        'quality_bonus',
        'admin_award',
      ],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        switch (this.source) {
          case 'issue_report':
            return 'Issue';
          case 'comment':
            return 'Comment';
          case 'challenge_complete':
            return 'Challenge';
          default:
            return null;
        }
      },
    },
    reason: {
      type: String,
      required: true,
    },
    before: {
      level: Number,
      xpInLevel: Number,
      totalXP: Number,
    },
    after: {
      level: Number,
      xpInLevel: Number,
      totalXP: Number,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

// Indexes for fast lookups
pointsLogSchema.index({ userId: 1, createdAt: -1 });
pointsLogSchema.index({ source: 1 });
pointsLogSchema.index({ createdAt: -1 });

export const PointsLog = mongoose.model('PointsLog', pointsLogSchema);
