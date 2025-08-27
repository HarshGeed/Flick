"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Find genre name
  const genreName =
    movieGenres.find((g) => String(g.id) === String(genre_id))?.name || "Movies";

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [genre_id]);

  // Fetch movies by genre
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/movies_section/${genre_id}/movies_byGenre?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.length === 0) setHasMore(false);
        setMovies((prev) => [...prev, ...data]);
      })
      .catch(() => setError("Unable to show you currently."))
      .finally(() => setLoading(false));
  }, [genre_id, page]);

  return (
    <div className="w-full max-w-[60rem] mx-auto">
      <h2 className="text-2xl bg-linear-to-bl from-[#f2c530] to-[#3b343c] px-6 py-1 mb-6 rounded-lg shadow-lg font-medium">{genreName}</h2>

      {error && <div className="text-center text-stone-600 py-8">{error}</div>}

      <div className="grid grid-cols-4 gap-6">
        {movies.map((item, idx) => {
          if (idx === movies.length - 1) {
            return (
              <div
                ref={lastMovieRef}
                key={`${item.id}-${idx}`}
                className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col h-[340px] cursor-pointer"
                onClick={() => router.push(`/explore/movie/${item.id}`)}
              >
                <div className="relative w-full h-[220px] hover:opacity-80">
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
                <div className="flex-1 flex flex-col">
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
            );
          }
          return (
            <div
              key={`${item.id}-${idx}`}
              className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col h-[340px] cursor-pointer"
              onClick={() => router.push(`/explore/movie/${item.id}`)}
            >
              <div className="relative w-full h-[220px] hover:opacity-80">
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
          );
        })}
      </div>
      {loading && <div className="text-center text-gray-400 py-8">Loading...</div>}
      {!hasMore && <div className="text-center text-gray-400 py-8">No more movies.</div>}
    </div>
  );
}