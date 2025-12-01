const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile data
  profile: {
    displayName: String,
    avatar: String,
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 }
  },

  // Game progress
  gameProgress: {
    currentLevel: { type: Number, default: 1 },
    completedLevels: [Number],
    unlockedItems: [String]
  },

  // Scores
  scores: [{
    gameMode: String,
    score: Number,
    date: { type: Date, default: Date.now }
  }],

  // Achievements
  achievements: [{
    id: String,
    name: String,
    unlockedAt: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);