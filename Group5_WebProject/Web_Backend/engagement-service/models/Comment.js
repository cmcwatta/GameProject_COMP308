import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [{
      url: String,
      fileType: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Gamification fields
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0
    },
    isResolved: {
      type: Boolean,
      default: false,
      description: 'Marked as helpful for resolving the issue'
    },
    sentiment: {
      score: { type: Number, min: -1, max: 1 },
      label: { type: String, enum: ['positive', 'neutral', 'negative'] }
    },
    xpAwarded: {
      type: Boolean,
      default: false
    },
    xpAwardedAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ issueId: 1 });
commentSchema.index({ authorId: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ helpfulVotes: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
