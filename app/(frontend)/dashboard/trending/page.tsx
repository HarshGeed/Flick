"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Play, Calendar, Filter, TrendingUp, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  first_air_date?: string;
  media_type: string;
  genre_ids: number[];
}

const genreMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default function Trending() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<"trending" | "rating" | "date">("trending");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchTrendingMovies() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/movies_section/trendingMovies");

        if (!res.ok) {
          throw new Error("Failed to fetch trending movies");
        }

        const data = await res.json();
        setMovies(data || []);
      } catch (error) {
        console.error(error);
        setError("Failed to load trending movies. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingMovies();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("trendingFavorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (movieId: number, movieTitle: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(movieId)) {
      newFavorites.delete(movieId);
      toast.success(`Removed ${movieTitle} from favorites`);
    } else {
      newFavorites.add(movieId);
      toast.success(`Added ${movieTitle} to favorites`);
    }
    setFavorites(newFavorites);
    localStorage.setItem("trendingFavorites", JSON.stringify([...newFavorites]));
  };

  // Filter and sort movies
  const filteredAndSortedMovies = movies
    .filter(movie => {
      if (filterType === "movie") return movie.media_type === "movie";
      if (filterType === "tv") return movie.media_type === "tv";
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.vote_average - a.vote_average;
        case "date":
          const dateA = new Date(a.release_date || a.first_air_date || "").getTime();
          const dateB = new Date(b.release_date || b.first_air_date || "").getTime();
          return dateB - dateA;
        default:
          return 0; // Keep trending order as returned by API
      }
    });

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-700/50 rounded-lg w-64 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-700/50 rounded-lg w-48 animate-pulse"></div>
        </div>
        
        {/* Filter Bar Skeleton */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="h-12 bg-gray-700/50 rounded-xl w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-700/50 rounded-xl w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-700/50 rounded-xl w-32 animate-pulse"></div>
          </div>
        </div>
        
                 {/* Movie Row Skeleton */}
         <div className="space-y-6">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50">
               <div className="flex">
                 <div className="w-48 h-72 bg-gray-700/50 animate-pulse flex-shrink-0"></div>
                 <div className="p-6 flex-1">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <div className="h-8 bg-gray-700/50 rounded mb-2 animate-pulse w-64"></div>
                       <div className="h-4 bg-gray-700/50 rounded w-20 animate-pulse"></div>
                     </div>
                     <div className="h-10 bg-gray-700/50 rounded w-24 animate-pulse"></div>
                   </div>
                   <div className="flex gap-2 mb-4">
                     <div className="h-6 bg-gray-700/50 rounded w-16 animate-pulse"></div>
                     <div className="h-6 bg-gray-700/50 rounded w-20 animate-pulse"></div>
                     <div className="h-6 bg-gray-700/50 rounded w-16 animate-pulse"></div>
                   </div>
                   <div className="space-y-2">
                     <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                     <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
                     <div className="h-4 bg-gray-700/50 rounded w-2/3 animate-pulse"></div>
                   </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-amber-500" />
            Trending Now
          </h1>
          <p className="text-gray-400 text-lg">
            Discover what&apos;s hot in movies and TV shows
            {filterType !== "all" && (
              <span className="text-amber-400 ml-2">
                • Showing {filteredAndSortedMovies.length} {filterType === "movie" ? "movies" : "TV shows"}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          
          {favorites.size > 0 && (
            <button
              onClick={() => {
                const favoritesText = Array.from(favorites)
                  .map(id => {
                    const movie = movies.find(m => m.id === id);
                    return movie ? movie.title || movie.name : "";
                  })
                  .filter(Boolean)
                  .join('\n');
                navigator.clipboard.writeText(`My Trending Favorites:\n\n${favoritesText}`);
                toast.success('Favorites copied to clipboard!');
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Copy Favorites
            </button>
          )}
        </div>
      </div>

      

      {/* Filter and Sort Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "movie" | "tv")}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Content</option>
              <option value="movie">Movies Only</option>
              <option value="tv">TV Shows Only</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "trending" | "rating" | "date")}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="trending">Sort by Trending</option>
            <option value="rating">Sort by Rating</option>
            <option value="date">Sort by Date</option>
          </select>

          {/* Clear Filters */}
          {(filterType !== "all" || sortBy !== "trending") && (
            <button
              onClick={() => {
                setFilterType("all");
                setSortBy("trending");
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      {filteredAndSortedMovies.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <TrendingUp className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No trending content found</h3>
          <p className="text-gray-500 mb-6">
            {filterType !== "all" 
              ? `No trending ${filterType === "movie" ? "movies" : "TV shows"} available` 
              : "No trending content available at the moment"
            }
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      ) : (
        <div className="space-y-6">
                     {filteredAndSortedMovies.map((movie, index) => (
             <Link
               key={movie.id}
               href={`/explore/movie/${movie.id}`}
               className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl block"
             >
              <div className="flex">
                {/* Movie Poster */}
                <div className="relative w-48 h-72 flex-shrink-0">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name || "Movie"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-userImg.png';
                    }}
                  />
                  
                  {/* Trending Badge */}
                  <div className="absolute top-3 left-3 bg-amber-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    #{index + 1}
                  </div>
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 bg-amber-500 text-black px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </div>

                  {/* Media Type Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {movie.media_type === "movie" ? "MOVIE" : "TV SHOW"}
                  </div>
                  
                  
                </div>

                {/* Movie Info */}
                <div className="p-6 flex-1">
                                     <div className="mb-4">
                     <div>
                       <h3 className="font-bold text-2xl text-white mb-2 group-hover:text-amber-400 transition-colors">
                         {movie.title || movie.name}
                       </h3>
                       
                       <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                         <Calendar className="w-4 h-4" />
                         <span>
                           {(movie.release_date || movie.first_air_date) 
                             ? new Date(movie.release_date || movie.first_air_date || "").getFullYear()
                             : "N/A"
                           }
                         </span>
                       </div>
                     </div>
                   </div>
                  
                  {/* Genre Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genre_ids?.slice(0, 4).map((genreId) => (
                      <span
                        key={genreId}
                        className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full border border-amber-500/30"
                      >
                        {genreMap[genreId] || "Unknown"}
                      </span>
                    ))}
                  </div>
                  
                                     <p className="text-gray-300 text-base leading-relaxed line-clamp-4">
                     {movie.overview || "No overview available."}
                   </p>
                 </div>
               </div>
             </Link>
           ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-12 text-center text-gray-400">
        <p>Showing {filteredAndSortedMovies.length} of {movies.length} trending items</p>
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
