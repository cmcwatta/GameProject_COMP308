//id, username, email, role, created
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Resident', 'Municipal Staff', 'Admin', 'user', 'staff', 'admin'],
        default: 'Resident'
    },
    gameProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameProfile',
        description: 'Reference to user game profile in gamification service'
    },
    avatar: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
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

// Index for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ gameProfileId: 1 });

const User = mongoose.model('User', userSchema);

export default User;
export { userSchema };
