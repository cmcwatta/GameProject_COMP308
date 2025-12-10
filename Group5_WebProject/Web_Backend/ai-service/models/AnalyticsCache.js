import mongoose from 'mongoose';

const analyticsCacheSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['dashboard_metrics', 'trend_analysis', 'heatmap_data'],
        required: true
    },
    data: mongoose.Schema.Types.Mixed,
    generatedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
});

// TTL index for auto-cleanup
analyticsCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AnalyticsCache = mongoose.model('AnalyticsCache', analyticsCacheSchema);

export default AnalyticsCache;
