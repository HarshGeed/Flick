import { syncToSanity } from "@/sanity/sanity-utils";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await syncToSanity();
    return NextResponse.json({ message: "News synced successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error syncing news to Sanity:", error);
    return NextResponse.json({ error: "Failed to sync the news" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}