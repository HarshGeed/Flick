"use server";

import { connect } from "@/app/lib/dbConn";
import User from "@/app/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { catchAsync } from "@/app/utils/catchAsync";
import jwt from "jsonwebtoken";

connect();

export const POST = catchAsync(async (req) => {
  const reqBody = await req.json();
  const { email, password } = reqBody;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User does not exist" }, { status: 400 });
  }
  console.log("User exists");

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }
  console.log("Password is valid");

  // Ensure TOKEN_SECRET is defined
  if (!process.env.TOKEN_SECRET) {
    return NextResponse.json({ error: "Server error: Missing TOKEN_SECRET" }, { status: 500 });
  }

  // Create JWT token
  const tokenData = {
    id: user._id,
    username: user.username,
    email: user.email,
  };
  const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

  // Set token in HttpOnly cookie
  const response = NextResponse.json({
    message: "Login successful",
    success: true,
  });

  response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);

  return response;
});
