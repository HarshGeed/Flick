import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://api.themoviedb.org/3/trending/all/day?language=en-US";

  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch trending movies" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data.results.slice(0, 20)); // Return top 20 movies
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error fetching movies" }, { status: 500 });
  }
}
