import { NextResponse } from "next/server";

export async function fetchMovieData(url: string, errorMsg = "Failed to fetch data") {
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
        { error: errorMsg },
        { status: res.status }
      );
    }

    const data = await res.json();

    // If TMDB returns paginated results
    if (data.results) {
      return NextResponse.json(data.results);
    }

    // If TMDB returns a single object (like details)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}