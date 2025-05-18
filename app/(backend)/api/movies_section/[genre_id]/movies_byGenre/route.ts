import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { genre_id: string } }
) {
  const { genre_id } = await params;
  const {searchParams} = new URL(req.url);
  const page = searchParams.get("page") || "1";

  if (!genre_id) {
    return NextResponse.json({ error: "Genre ID is required" }, { status: 400 });
  }

  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genre_id}`;

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