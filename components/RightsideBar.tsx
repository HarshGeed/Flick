"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import LogoutBtn from "./LogoutBtn";
import Image from "next/image";

export default function RightsideBar() {
  const [news, setNews] = useState([]);
  const [hotPicks, setHotPicks] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingHotPicks, setLoadingHotPicks] = useState(false);

  // Search state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSessionUserId(data.userId))
      .catch(() => setSessionUserId(null));
  }, []);

  // Fetch news and movies from backend API routes
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const res = await fetch("/api/fetchNews");
        const data = await res.json();
        setNews(data.results ? data.results.slice(0, 10) : []);
      } catch (error) {
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };

    const fetchMovies = async () => {
      setLoadingHotPicks(true);
      try {
        const res = await fetch("/api/movies_section/popularMovies");
        const data = await res.json();
        setHotPicks(data ? data.slice(0, 10) : []);
      } catch (error) {
        setHotPicks([]);
      } finally {
        setLoadingHotPicks(false);
      }
    };

    fetchNews();
    fetchMovies();
  }, []);

  // Debounced user search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/searchUser?q=${encodeURIComponent(search)}`
        );
        if (!res.ok) throw new Error("Failed to search users");
        const users = await res.json();
        setSearchResults(users);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  return (
    <div className="sticky top-0 pt-2 ml-4 w-[22rem] flex-shrink-0">
      {/* Modern Search bar for searching user */}
      <div className="relative mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-full bg-[#232326] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-200 transition"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showDropdown && (
          <div className="absolute left-0 right-0 mt-2 bg-[#18181b] border border-gray-700 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 text-gray-400 text-center">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <Link
                  key={user._id}
                  href={
                    user._id === sessionUserId
                      ? "/dashboard/profilePage"
                      : `/dashboard/profilePageOther/${user._id}`
                  }
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[#232326] transition"
                  onMouseDown={(e) => e.preventDefault()} // prevent blur
                  onClick={() => setShowDropdown(false)} // hide manually
                >
                  <Image
                    src={user.profileImage || "/default-userImg.png"}
                    alt={user.username}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-400">@{user.userID}</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-gray-400 text-center">
                No users found.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* News */}
        <div className="w-full rounded-2xl border-1 border-stone-800 px-2 pb-3">
          <h1 className="text-xl font-bold px-2 pt-2">News on the go</h1>
          {loadingNews ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-700/50 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            news.map((article, idx) => (
              <div
                key={article._id || article.link || idx}
                className="w-full rounded-2xl p-4 shadow-2xl mt-[1rem]"
                style={{ backgroundColor: "#0f0f0f" }}
              >
                <Link href={article.sourceUrl || article.link || "#"}>
                  <h2 className="font-bold">{article.title}</h2>
                  <p className="pt-2 opacity-70 line-clamp-4">
                    {article.description || "No description available"}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No news available.</p>
          )}
        </div>
        {/* Hot Picks */}
        <div className="w-full rounded-2xl border-1 border-stone-800 px-2 mt-3 pb-3">
          <h1 className="text-xl font-bold px-2 pt-2">Hot Picks</h1>
          {loadingHotPicks ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-16 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : hotPicks.length > 0 ? (
            hotPicks.map((movie, idx) => (
              <div
                key={movie.id || movie._id || idx}
                className="w-full rounded-2xl p-4 shadow-2xl mt-[1rem] flex items-center gap-4"
                style={{ backgroundColor: "#0f0f0f" }}
              >
                {movie.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title || "Movie Poster"}
                    width={60}
                    height={90}
                    className="rounded-lg object-cover"
                  />
                )}
                <div>
                  <Link href={`/explore/movie/${movie.id}`}>
                    <h2 className="font-bold">{movie.title}</h2>
                  
                  <p className="pt-2 opacity-70 line-clamp-3">
                    {movie.overview || "No description available"}
                  </p>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hot picks available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
