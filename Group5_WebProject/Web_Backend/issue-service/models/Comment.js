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
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [{
      url: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Community engagement
    upvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    isStaffResponse: {
      type: Boolean,
      default: false
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    
    // Sentiment analysis
    sentiment: {
      score: { type: Number, min: -1, max: 1 },
      label: { type: String, enum: ['positive', 'neutral', 'negative'] }
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
commentSchema.index({ isStaffResponse: 1 });
commentSchema.index({ isPinned: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
