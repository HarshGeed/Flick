import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import NextAuth authentication function

export async function middleware(req) {
  const session = await auth();

  // If user is not authenticated, redirect to sign-in page
  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", req.url)); // Redirect to actual auth page
  }

  return NextResponse.next(); // Allow access if authenticated
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect the dashboard route
};
