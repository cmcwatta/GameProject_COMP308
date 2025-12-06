import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        enum: ['pothole', 'streetlight', 'flooding', 'safety', 'graffiti', 'garbage', 'vandalism', 'other'],
        default: 'other'
    },
    aiCategory: {
        type: String,
        default: 'uncategorized'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['reported', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'],
        default: 'reported'
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required']
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: [true, 'Coordinates are required']
            }
        },
        ward: String,
        neighborhood: String
    },
    photos: [{
        url: String,
        publicId: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    reporterId: {
        type: String,
        required: true
    },
    reporter: {
        username: String,
        email: String,
        role: String
    },
    assignedTo: {
        userId: String,
        username: String,
        email: String
    },
    aiMetadata: {
        sentiment: {
            type: Number,
            min: -1,
            max: 1,
            default: 0
        },
        keywords: [String],
        urgencyScore: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.8
        }
    },
    votes: {
        upvotes: {
            type: Number,
            default: 0
        },
        downvotes: {
            type: Number,
            default: 0
        }
    },
    comments: [{
        userId: String,
        username: String,
        text: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolution: {
        notes: String,
        resolvedAt: Date,
        resolvedBy: {
            userId: String,
            username: String
        },
        beforePhotos: [String],
        afterPhotos: [String]
    },
    estimatedResolutionTime: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create 2dsphere index for geospatial queries
issueSchema.index({ 'location.coordinates': '2dsphere' });
issueSchema.index({ status: 1, priority: -1, createdAt: -1 });
issueSchema.index({ category: 1, createdAt: -1 });

// Pre-save middleware
issueSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
export { issueSchema };