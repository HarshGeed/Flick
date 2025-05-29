import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing NEWS_API_KEY" }, { status: 500 });
    }

    const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&category=entertainment&language=en`;
    const res = await fetch(url, {next: { revalidate: 3600 }});
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch news" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ results: data.results || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}