"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Filter, Star, Trash2, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
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

interface WatchlistItem {
  _id: string;
  movieId: string;
}

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "rating" | "date">("title");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [removingMovies, setRemovingMovies] = useState<Set<string>>(new Set());

  // Fetch session user ID
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setSessionUserId(data.userId);
        } else {
          setSessionUserId(null);
        }
      } catch (err) {
        setSessionUserId(null);
      }
    };
    
    fetchSession();
  }, []);

  // Fetch watchlist data
  useEffect(() => {
    if (!sessionUserId) return;

    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await fetch(`/api/profilePageData/watchlist/${sessionUserId}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch watchlist");
        }
        
        const watchlistData: WatchlistItem[] = await res.json();
        
        if (!Array.isArray(watchlistData) || watchlistData.length === 0) {
          setWatchlist([]);
          return;
        }
        
        // Fetch movie details for each watchlist item
        const moviePromises = watchlistData.map(async (item) => {
          try {
            const movieRes = await fetch(`/api/movies_section/movie_details/${item.movieId}/details`);
            if (movieRes.ok) {
              const movieData = await movieRes.json();
              return {
                id: movieData.id,
                title: movieData.title,
                poster_path: movieData.poster_path,
                release_date: movieData.release_date,
                vote_average: movieData.vote_average,
                overview: movieData.overview,
                genre_ids: movieData.genre_ids || [],
              };
            }
            return null;
          } catch (err) {
            return null;
          }
        });

        const movies = (await Promise.all(moviePromises)).filter(Boolean) as Movie[];
        setWatchlist(movies);
      } catch (err) {
        setError("Failed to load watchlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [sessionUserId]);

  // Navigate to movie details
  const navigateToMovie = (movieId: string) => {
    router.push(`/explore/movie/${movieId}`);
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId: string) => {
    if (!sessionUserId) return;

    const movie = watchlist.find(m => m.id === movieId);
    const movieTitle = movie?.title || "Movie";

    setRemovingMovies(prev => new Set(prev).add(movieId));

    try {
      const res = await fetch(`/api/movies_section/watchlistMovie/${movieId}`, {
        method: "POST",
      });

      if (res.ok) {
        setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
        toast.success(`${movieTitle} removed from watchlist`);
      } else {
        toast.error("Failed to remove movie from watchlist");
      }
    } catch (err) {
      console.error("Error removing movie from watchlist:", err);
      toast.error("Failed to remove movie from watchlist");
    } finally {
      setRemovingMovies(prev => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
    }
  };

  // Filter and sort movies
  const filteredAndSortedMovies = watchlist
    .filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = filterGenre === "all" || movie.genre_ids.includes(parseInt(filterGenre));
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return b.vote_average - a.vote_average;
        case "date":
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-700/50 rounded-lg w-64 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-700/50 rounded-lg w-48 animate-pulse"></div>
        </div>
        
        {/* Search Bar Skeleton */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="h-12 bg-gray-700/50 rounded-xl w-full max-w-md animate-pulse"></div>
            <div className="h-10 bg-gray-700/50 rounded-lg w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-700/50 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>
        
        {/* Movie Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50">
              <div className="aspect-[2/3] bg-gray-700/50 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-700/50 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-700/50 rounded mb-3 w-20 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
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
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400 text-lg">
            {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} in your collection
            {(searchTerm || filterGenre !== "all") && (
              <span className="text-amber-400 ml-2">
                • Showing {filteredAndSortedMovies.length} result{filteredAndSortedMovies.length !== 1 ? 's' : ''}
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
          
          {watchlist.length > 0 && (
            <button
              onClick={() => {
                const watchlistText = watchlist.map(m => `${m.title} (${new Date(m.release_date).getFullYear()}) - ⭐ ${m.vote_average}/10`).join('\n');
                navigator.clipboard.writeText(`My Movie Watchlist:\n\n${watchlistText}`);
                toast.success('Watchlist copied to clipboard!');
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy List
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {watchlist.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-white">{watchlist.length}</div>
            <div className="text-gray-400 text-sm">Total Movies</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-white">
              {watchlist.filter(m => m.vote_average >= 7.5).length}
            </div>
            <div className="text-gray-400 text-sm">Highly Rated</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-white">
              {new Date().getFullYear() - Math.min(...watchlist.map(m => new Date(m.release_date).getFullYear()))}
            </div>
            <div className="text-gray-400 text-sm">Years Span</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="text-2xl font-bold text-white">
              {Math.round(watchlist.reduce((acc, m) => acc + m.vote_average, 0) / watchlist.length * 10) / 10}
            </div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "title" | "rating" | "date")}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          {/* Genre Filter */}
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Genres</option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="80">Crime</option>
            <option value="99">Documentary</option>
            <option value="18">Drama</option>
            <option value="10751">Family</option>
            <option value="14">Fantasy</option>
            <option value="36">History</option>
            <option value="27">Horror</option>
            <option value="10402">Music</option>
            <option value="9648">Mystery</option>
            <option value="10749">Romance</option>
            <option value="878">Science Fiction</option>
            <option value="10770">TV Movie</option>
            <option value="53">Thriller</option>
            <option value="10752">War</option>
            <option value="37">Western</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredAndSortedMovies.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <Eye className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {searchTerm || filterGenre !== "all" ? "No movies found" : "Your watchlist is empty"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterGenre !== "all" 
              ? "Try adjusting your search or filters" 
              : "Start adding movies to your watchlist to see them here"
            }
          </p>
          
          {(searchTerm || filterGenre !== "all") && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterGenre("all");
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMovies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => navigateToMovie(movie.id)}
            >
              {/* Movie Poster */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-userImg.png'; // Fallback image
                  }}
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(movie.id);
                    }}
                    disabled={removingMovies.has(movie.id)}
                    className={`p-3 rounded-full transition-colors ${
                      removingMovies.has(movie.id)
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                  >
                    {removingMovies.has(movie.id) ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-amber-500 text-black px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors truncate">
                  {movie.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3">
                  {new Date(movie.release_date).getFullYear()}
                </p>
                
                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {movie.genre_ids.slice(0, 3).map((genreId) => (
                    <span
                      key={genreId}
                      className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30"
                    >
                      {genreMap[genreId] || "Unknown"}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed h-16 overflow-hidden">
                  {movie.overview || "No overview available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {watchlist.length > 0 && (
        <div className="mt-12 text-center text-gray-400">
          <p>Showing {filteredAndSortedMovies.length} of {watchlist.length} movies</p>
        </div>
      )}
      
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
