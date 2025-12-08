import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  previousStatus: {
    type: String,
    required: true
  },
  newStatus: {
    type: String,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  reason: String,
  comment: String,
  metadata: mongoose.Schema.Types.Mixed
});

// Indexes
statusHistorySchema.index({ issueId: 1, changedAt: -1 });
statusHistorySchema.index({ changedBy: 1 });
statusHistorySchema.index({ newStatus: 1 });

const StatusHistory = mongoose.model('StatusHistory', statusHistorySchema);
export default StatusHistory;
