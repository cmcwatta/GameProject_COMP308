import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photoUrl: { type: String },
  geotag: {
    lat: { type: Number },
    lng: { type: Number }
  },
  category: { 
    type: String,
    enum: ['accessibility', 'infrastructure', 'safety', 'sustainability', 'other'],
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
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attachments: [{
    url: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  estimatedResolution: Date,
  resolvedAt: Date,
  
  // Gamification fields
  reportQualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  communityHelpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  aiSummary: String,
  aiClassification: String,
  sentiment: {
    score: { type: Number, min: -1, max: 1 },
    label: { type: String, enum: ['positive', 'neutral', 'negative'] }
  },
  xpAwarded: {
    type: Boolean,
    default: false,
    description: 'Whether XP has been awarded for this issue'
  },
  xpAwardedAmount: {
    type: Number,
    default: 0
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
issueSchema.index({ category: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ createdBy: 1 });
issueSchema.index({ reportQualityScore: -1 });
issueSchema.index({ createdAt: -1 });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
export { issueSchema };
