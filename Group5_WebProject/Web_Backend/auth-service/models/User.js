//id, username, email, role, created
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Resident', 'Municipal Staff', 'Community Advocate', 'Admin'],
        default: 'Resident'
    },
    phone: String,
    avatar: {
        type: String,
        default: null
    },
    location: {
        address: String,
        latitude: Number,
        longitude: Number,
        city: String,
        postalCode: String
    },
    preferences: {
        notificationFrequency: {
            type: String,
            enum: ['instant', 'daily', 'weekly'],
            default: 'instant'
        },
        categories: [String],
        radius: { type: Number, default: 5 } // km for alerts
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    
    // OAuth integration
    oauthProviders: [{
        provider: { type: String, enum: ['google', 'github'] },
        externalId: String,
        email: String
    }],
    
    // Staff-specific fields
    department: String,
    staffId: String,
    
    // Volunteer-specific fields
    volunteerSkills: [String],
    hoursContributed: { type: Number, default: 0 },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: null
    }
});

// Index for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'oauthProviders.externalId': 1 });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;
export { userSchema };
