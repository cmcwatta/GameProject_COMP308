import mongoose from 'mongoose';

const notificationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  // Email preferences
  emailNotifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    issueUpdates: {
      type: Boolean,
      default: true
    },
    comments: {
      type: Boolean,
      default: true
    },
    volunteerMatches: {
      type: Boolean,
      default: true
    },
    urgentAlerts: {
      type: Boolean,
      default: true
    },
    digestFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'never'],
      default: 'weekly'
    }
  },

  // In-app notification preferences
  inAppNotifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    issueUpdates: {
      type: Boolean,
      default: true
    },
    comments: {
      type: Boolean,
      default: true
    },
    volunteerMatches: {
      type: Boolean,
      default: true
    },
    urgentAlerts: {
      type: Boolean,
      default: true
    }
  },

  // Issue watching/muting
  watchedIssues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }],

  mutedIssues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }],

  // Category preferences
  preferredCategories: [{
    type: String,
    enum: ['pothole', 'streetlight', 'debris', 'drainage', 'other']
  }],

  mutedCategories: [{
    type: String,
    enum: ['pothole', 'streetlight', 'debris', 'drainage', 'other']
  }],

  // Location-based preferences
  notificationRadius: {
    type: Number,
    default: 5, // km
    min: 1,
    max: 50
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
notificationPreferenceSchema.index({ userId: 1 });

const NotificationPreference = mongoose.model('NotificationPreference', notificationPreferenceSchema);
export default NotificationPreference;
