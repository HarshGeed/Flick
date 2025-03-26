import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    likes: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
