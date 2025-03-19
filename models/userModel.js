import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"; // Import bcrypt

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    isOauth: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: function () {
        return !this.get("isOauth"); // ✅ Corrected
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
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Add Indexes

userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });
userSchema.index({ watchlist: 1 });

const User = mongoose.models?.User || mongoose.model("User", userSchema);
export default User;
