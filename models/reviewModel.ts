import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  movieId: string;
  user: Types.ObjectId;
  username: string;
  review: string;
  likesNum: number;
  likedBy: Types.ObjectId[];
}

const reviewSchema = new Schema<IReview>(
  {
    movieId: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    likesNum: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", reviewSchema);
