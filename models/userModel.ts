import mongoose, { Document, Schema, Model, model, models } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"; // Import bcrypt

export interface IUser extends Document {
  username: string;
  userID: string;
  email: string;
  isOauth: boolean;
  password?: Promise<string> | string;
  passwordConfirm?: string;
  fullName?: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  watchlist: mongoose.Types.ObjectId[];
  reviews: {
    movieId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
  likedReviews: mongoose.Types.ObjectId[];
  likedPosts: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  isModified: (field: string) => boolean;
  savedPosts: mongoose.Types.ObjectId[];
  userCreatedPosts: mongoose.Types.ObjectId[];
  location?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    userID:{
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Please provide a valid email",
      },
    },
    isOauth: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.isOauth; // ✅ Corrected
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
      select: false,
    },
    fullName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    reviews: [
      {
        movieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
          required: true,
        },
        rating: { type: Number, min: 0, max: 5, required: true },
        comment: { type: String, default: "" },
      },
    ],
    likedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Corrected
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    userCreatedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    location: {
      type: String, // enhance it more
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(await this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Add Indexes

userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });
userSchema.index({ watchlist: 1 });

const User: Model<IUser> = models?.User || model<IUser>("User", userSchema);
export default User;
