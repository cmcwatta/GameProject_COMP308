import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photoUrl: { type: String },
  geotag: {
    lat: { type: Number },
    lng: { type: Number }
  },
  category: { type: String }, // For AI categorization
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: {type: Number,default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

issueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
export { issueSchema };
