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
    enum: ['Pothole', 'Streetlight', 'Flooding', 'Safety Hazard', 'Accessibility', 'Other'],
    required: true
  },
  subcategory: String,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: { 
    type: String, 
    enum: ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Duplicate', 'Closed'], 
    default: 'Reported' 
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
  photos: [{
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    caption: String
  }],
  location: {
    address: String,
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    city: String,
    ward: String,
    geopoint: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  severity: { type: Number, min: 1, max: 10, default: 5 },
  estimatedResolution: Date,
  resolvedAt: Date,
  
  // Community engagement
  upvotes: { type: Number, default: 0, min: 0 },
  commentCount: { type: Number, default: 0, min: 0 },
  siteVisits: [{
    userId: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // AI Analysis
  aiSummary: String,
  aiClassification: {
    category: String,
    confidence: { type: Number, min: 0, max: 1 }
  },
  sentiment: {
    score: { type: Number, min: -1, max: 1 },
    label: { type: String, enum: ['positive', 'neutral', 'negative'] }
  },
  
  // SLA & Tracking
  slaDeadline: Date,
  slaStatus: { type: String, enum: ['On Track', 'At Risk', 'Overdue'], default: 'On Track' },
  statusHistory: [{
    status: String,
    changedBy: mongoose.Schema.Types.ObjectId,
    changedAt: { type: Date, default: Date.now },
    reason: String,
    comment: String
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
issueSchema.index({ category: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ assignedTo: 1 });
issueSchema.index({ 'location.geopoint': '2dsphere' }); // Geospatial index
issueSchema.index({ createdAt: -1 });
issueSchema.index({ slaDeadline: 1 });
issueSchema.index({ createdAt: -1 });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
export { issueSchema };
