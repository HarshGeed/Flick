"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// Movie genres for name lookup
const movieGenres = [
  { name: "Action", id: 28 },
  { name: "Adventure", id: 12 },
  { name: "Romance", id: 10749 },
  { name: "Animation", id: 16 },
  { name: "Comedy", id: 35 },
  { name: "Thriller", id: 53 },
  { name: "Drama", id: 18 },
  { name: "Horror", id: 27 },
];

export default function GenrePage() {
  const { genre_id } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find genre name
  const genreName =
    movieGenres.find((g) => String(g.id) === String(genre_id))?.name || "Movies";

  // Fetch movies by genre
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/movies_section/${genre_id}/movies_byGenre`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setMovies(data))
      .catch(() => setError("Unable to show you currently."))
      .finally(() => setLoading(false));
  }, [genre_id]);

  return (
    <div className="w-full max-w-[60rem] mx-auto">
      <h2 className="text-2xl bg-gray-800 w-[10rem] px-6 py-1 mb-6 rounded-lg shadow-lg font-medium">{genreName}</h2>

      {loading && <div className="text-center text-gray-400 py-8">Loading...</div>}
      {error && <div className="text-center text-stone-600 py-8">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-4 grid-rows-5 gap-6">
          {movies.slice(0, 20).map((item: any) => (
            <div
              key={item.id}
              className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col h-[340px]"
            >
              <div className="relative w-full h-[220px] cursor-pointer hover:opacity-80">
                <Image
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : "/placeholder.jpg"
                  }
                  alt={item.title || item.name || "Untitled"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-white text-base font-semibold line-clamp-2">
                  {item.title || item.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {item.overview || "No description."}
                </p>
                <span className="mt-auto text-xs text-yellow-400">
                  ⭐ {item.vote_average}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}