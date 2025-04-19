import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // If it's a top-level comment
    },
    text: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: [0, "Likes cannot be negative"],
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replyCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
