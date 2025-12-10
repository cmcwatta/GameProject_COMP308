import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: String,
    },
    category: {
      type: String,
      enum: ['pothole', 'streetlight', 'debris', 'drainage', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    submitterId: {
      type: String,
      required: true,
    },
    submitterName: String,
    attachments: [
      {
        filename: String,
        fileUrl: String,
        uploadedAt: Date,
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    volunteers: [
      {
        userId: String,
        name: String,
        joinedAt: Date,
      },
    ],
    assignedTo: String,
    assignedAt: Date,
    completedAt: Date,
    aiClassification: {
      category: String,
      confidence: Number,
      suggestedPriority: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

issueSchema.index({ location: '2dsphere' });
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ submitterId: 1 });
issueSchema.index({ createdAt: -1 });

export default mongoose.model('Issue', issueSchema);
