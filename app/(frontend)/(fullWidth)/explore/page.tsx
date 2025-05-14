"use client";

import { useState } from "react";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`/api/searchMovie?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="search"
          className="border border-white bg-black text-white px-3 py-2 flex-grow rounded-l"
          placeholder="Search movies, shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded-r text-white font-semibold"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-400">Searching...</p>}

      <div className="space-y-4">
        {results.map((item) => (
          <div
            key={`${item.id}-${item.media_type}-${item.name || item.title}`}
            className="p-3 border border-gray-700 rounded"
          >
            <h2 className="text-lg font-semibold text-white">
              {item.title || item.name || "Untitled"}
            </h2>
            <span className="text-xs text-gray-400">{item.media_type}</span>
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">
              {item.overview || "No description available."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
