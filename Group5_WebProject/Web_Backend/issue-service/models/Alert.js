import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['status_update', 'urgent_alert', 'neighborhood_alert', 'resolution_notification'],
        required: true
    },
    issueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    location: {
        latitude: Number,
        longitude: Number,
        radius: Number
    },
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'critical'],
        default: 'normal'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
});

// TTL index to auto-delete expired alerts
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
alertSchema.index({ userId: 1, isRead: 1 });
alertSchema.index({ issueId: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
export { alertSchema };
