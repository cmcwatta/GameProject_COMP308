import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Ensure one user can only volunteer once per issue
volunteerSchema.index({ issueId: 1, userId: 1 }, { unique: true });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;