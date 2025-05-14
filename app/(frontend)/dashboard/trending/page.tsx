"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Trending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTrendingMovies() {
      setLoading(true);
    try {
      const res = await fetch("/api/trendingMovies");

      if (!res.ok) {
        throw new Error("Failed to fetch trending movies");
      }

      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  fetchTrendingMovies();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full px-4">
      <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>
      {loading ? (
        <p className="text-gray-500">Loading trending movies...</p>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="rounded-lg shadow-lg bg-gray-800 text-white overflow-hidden"
            >
              <div className="relative w-full h-64">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || "image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{movie.title || movie.name}</h2>
                <p className="mt-2 text-sm opacity-70 line-clamp-3">
                  {movie.overview || "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No trending movies available.</p>
      )}
    </div>
  );
}
