import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['infrastructure', 'safety', 'accessibility', 'sustainability', 'other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed', 'archived'],
        default: 'open'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    location: {
        address: String,
        latitude: Number,
        longitude: Number,
        city: String,
        neighborhood: String
    },
    attachments: [{
        url: String,
        fileType: String,
        uploadedAt: Date
    }],
    tags: [String],
    estimatedResolution: Date,
    
    // AI-generated fields
    aiClassification: {
        category: String,
        confidence: Number,
        suggestedPriority: String
    },
    aiSummary: String,
    sentiment: {
        score: Number,
        label: String
    },
    
    // Community engagement
    upvotes: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    
    resolvedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for geospatial queries
issueSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
// Index for status and category queries
issueSchema.index({ status: 1, category: 1 });
// Index for reported by
issueSchema.index({ reportedBy: 1 });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
export { issueSchema };
