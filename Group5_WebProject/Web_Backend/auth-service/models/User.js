import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['resident', 'staff', 'community_advocate', 'admin'],
        default: 'resident'
    },
    permissions: [String],
    avatar: String,
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    oauthProviders: [{
        provider: String,
        providerId: String,
        email: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) return next();
    try {
        if (this.passwordHash) {
            this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User;
export { userSchema };
