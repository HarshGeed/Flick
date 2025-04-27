import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String, // we will do referencing here from user db.
    },
    content: {
      type: String,
      trim: true,
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
    commentCount: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    reposts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saveCounts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
