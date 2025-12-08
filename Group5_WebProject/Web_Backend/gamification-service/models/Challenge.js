import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['accessibility', 'infrastructure', 'safety', 'sustainability', 'general'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'epic'],
      default: 'medium',
    },
    xpReward: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in days
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'upcoming', 'completed', 'archived'],
      default: 'upcoming',
    },
    objective: {
      type: String,
      required: true,
    },
    progressMetric: {
      type: {
        type: String,
        enum: ['count', 'score', 'completion'],
      },
      target: Number,
    },
    successCriteria: {
      type: String,
      required: true,
    },
    participants: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        joinedDate: Date,
        progress: Number,
        completed: Boolean,
        completedDate: Date,
      },
    ],
    bonusRewards: [
      {
        condition: String,
        xpBonus: Number,
      },
    ],
    completionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster lookups
challengeSchema.index({ status: 1 });
challengeSchema.index({ category: 1 });
challengeSchema.index({ startDate: 1, endDate: 1 });

export const Challenge = mongoose.model('Challenge', challengeSchema);
