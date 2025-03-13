import { connect } from "@/app/lib/dbConn";
import User from "@/app/models/userModel";
import { NextResponse } from "next/server";
import { catchAsync } from "@/app/utils/catchAsync";

connect();

export const POST = catchAsync(async (req) => {
    const reqBody = await req.json();
    const { username, email, password, passwordConfirm, fullName, bio, profileImage, coverImage } = reqBody;

    console.log(reqBody);
    console.log(password)
    console.log(passwordConfirm)

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Validate password
    if (password !== passwordConfirm) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    try {
        const newUser = new User({
            username,
            email,
            password, // No need to hash it manually
            fullName,
            bio,
            profileImage,
            coverImage
        });

        await newUser.save();

        return NextResponse.json({
            message: "User created successfully",
            success: true,
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Server error, try again later" }, { status: 500 });
    }
});
