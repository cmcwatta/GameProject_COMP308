import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    issueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue',
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [String],
    sentiment: {
        score: Number,
        label: String
    },
    reactions: {
        type: Map,
        of: Number,
        default: new Map()
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    isResolved: {
        type: Boolean,
        default: false
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

commentSchema.index({ issueId: 1, createdAt: -1 });
commentSchema.index({ authorId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
export { commentSchema };
