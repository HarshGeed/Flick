import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ genre_id: string }> }
) {
  const { genre_id } = await params;

  if (!genre_id) {
    return NextResponse.json({ error: "Genre ID is required" }, { status: 400 });
  }

  const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre_id}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movies by genre" },
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