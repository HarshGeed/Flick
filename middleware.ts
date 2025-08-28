import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Simple token check - for production, you might want to verify JWT differently
  const token = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");
  
  // If user is not authenticated, redirect to sign-in page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Allow access if authenticated
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/notifications/:path*", "/explore/:path*"],
};
