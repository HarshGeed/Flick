import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch popular movies" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.results) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    return NextResponse.json(data.results);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
