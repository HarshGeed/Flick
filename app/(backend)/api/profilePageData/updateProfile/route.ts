import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConn";
import User from "@/models/userModel";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const PUT = async (req) => {
  try {
    await connect();

    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      username,
      bio,
      location,
      coverImage,
      profileImage,
      previousCoverImage,
      previousProfileImage,
    } = await req.json();

    // Delete previous images if new ones are uploaded
    if (previousCoverImage && previousCoverImage !== coverImage) {
      const publicId = extractPublicId(previousCoverImage);
      await cloudinary.uploader.destroy(publicId);
    }
    if (previousProfileImage && previousProfileImage !== profileImage) {
      const publicId = extractPublicId(previousProfileImage);
      await cloudinary.uploader.destroy(publicId);
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { username, bio, location, coverImage, profileImage },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// Helper function to extract the public ID from the Cloudinary URL
const extractPublicId = (url) => {
  const withoutBase = url.split("/upload/")[1]; // gets everything after /upload/
  const publicIdWithExt = withoutBase.split("?")[0]; // strip query params if any
  const parts = publicIdWithExt.split(".");
  parts.pop(); // remove file extension
  return parts.join("."); // rejoin in case filename has dots
};