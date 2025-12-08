import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['civic', 'community', 'consistency', 'quality', 'special'],
      required: true,
    },
    badge: {
      type: String, // emoji or icon
      required: true,
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'legendary'],
      default: 'common',
    },
    xpReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    unlockCondition: {
      type: {
        type: String,
        enum: ['count', 'streak', 'score', 'special'],
        required: true,
      },
      target: {
        type: Number,
        required: true,
      },
      metric: {
        type: String,
        required: true,
      },
    },
    icon: String, // URL to icon
    displayOrder: {
      type: Number,
      default: 0,
    },
    isHidden: {
      type: Boolean,
      default: false, // hidden until unlocked
    },
    unlockedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster lookups
achievementSchema.index({ category: 1 });
achievementSchema.index({ rarity: 1 });

export const Achievement = mongoose.model('Achievement', achievementSchema);
