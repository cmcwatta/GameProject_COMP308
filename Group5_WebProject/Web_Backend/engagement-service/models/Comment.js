import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    issueId: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
