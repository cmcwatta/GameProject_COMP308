import mongoose from 'mongoose';

const aiSummarySchema = new mongoose.Schema({
    sourceType: {
        type: String,
        enum: ['issue', 'discussion', 'comment_thread'],
        required: true
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    summary: String,
    keyPoints: [String],
    confidence: Number,
    model: String,
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

const AISummary = mongoose.model('AISummary', aiSummarySchema);

export default AISummary;
