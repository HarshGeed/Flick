"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popular, setPopular] = useState([]);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchMovie(){
      try{
        const moviesRes = await fetch("/api/movies_section/movies");
        if(!moviesRes.ok) throw new Error("Fetching movies failed");
        const moviesData = await moviesRes.json();
        setMovies(moviesData);
      }catch(err){
        console.error("Unable to fetch movie data", err);
      }
    }
    fetchMovie();
  },[])

  useEffect(() => {
    async function fetchShows(){
      try{
        const showRes = await fetch("/api/movies_section/tvShows");
        if(!showRes.ok) throw new Error("Fetching TV shows failed");
        const showsData = await showRes.json();
        setShows(showsData);
      }catch(err){
        console.log("Failed to fetch shows", err);
      }
    }
     fetchShows();
  },[])

  useEffect(() => {
    async function fetchPopular(){
      try{
        const popularRes = await fetch("/api/movies_section/popularMovies");
        if(!popularRes.ok) throw new Error("Fetching Popular movies failed");
        const popularData = await popularRes.json();
        setPopular(popularData);
      }catch(err){
        console.error("Failed to fetch Popular", err)
      }
    }

    fetchPopular();
  },[])

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/movies_section/searchMovie?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      <div className="flex w-full relative justify-end">
        {/* Search bar */}
        <Search className="mt-2 mr-2 opacity-60" />
        <input
          ref={inputRef}
          type="search"
          className="border-white bg-black text-white px-3 py-2 rounded mb-2 opacity-60 w-[25rem]"
          placeholder="Search movies, shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          autoComplete="off"
        />

        {/* Dropdown results */}
        {showDropdown && (
          <div className="absolute mt-[3rem] bg-[#0c0c0c] border border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto px-2 py-1 w-[25rem]">
            {loading && <p className="text-gray-400 p-4">Searching...</p>}
            {!loading && results.length === 0 && (
              <p className="text-gray-500 p-4">No results found.</p>
            )}
            {results.map((item) => (
              <div
                key={`${item.id}-${item.media_type}-${item.name || item.title}`}
                className="p-3 border-b border-gray-800 last:border-b-0 hover:bg-stone-600 cursor-pointer rounded-xl"
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
        )}
      </div>

      {/* Carousel */}
      <div className="mt-4 w-full max-w-[60rem]">
        <div className="relative w-full h-[450px] rounded overflow-hidden">
          <Swiper
            key={popular.length}
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {popular.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative w-full h-full">
                  <Image
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
                        : "/placeholder.jpg"
                    }
                    alt={item.title || item.name || "Untitled"}
                    fill
                    className="object-cover bg-black"
                    priority
                  />

                  {/* Overlay Text */}
                  <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-2 rounded-lg z-20">
                    <p className="text-white text-lg font-semibold">
                      {item.title || item.name}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Genres box */}
      <div className="grid grid-cols-4 grid-rows-2 gap-4 mt-6">
        <div className="bg-indigo-700 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Action
        </div>
        <div className="bg-indigo-800 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Adventure
        </div>
        <div className="bg-indigo-900 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Romance
        </div>
        <div className="bg-indigo-950 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Animation
        </div>
        <div className="bg-violet-700 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Comedy
        </div>
        <div className="bg-violet-800 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Thriller
        </div>
        <div className="bg-violet-900 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Drama
        </div>
        <div className="bg-violet-950 text-white flex items-center justify-center h-24 rounded shadow-lg hover:opacity-80 transform duration-300 ease-in-out cursor-pointer">
          Horror
        </div>
      </div>

      {/* Movies */}
      <div className="mt-8 ">
        <h2 className="text-3xl font-semibold">Movies</h2>
        <div className="w-full max-w-[60rem] h-[20rem] mt-4">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          navigation
          pagination={{ clickable: true }}
          className="w-full"
        >
          {movies.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col h-[340px]">
                <div className="relative w-full h-[220px]">
                  <Image
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={item.title || item.name || "Untitled"}
                    fill
                    className="object-cover"
                    priority={false}
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
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>

      {/* TV shows */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold">TV Shows</h2>
        <div className="w-full max-w-[60rem] h-[20rem] mt-4">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          navigation
          pagination={{ clickable: true }}
          className="w-full"
        >
          {shows.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col h-[340px]">
                <div className="relative w-full h-[220px]">
                  <Image
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={item.title || item.name || "Untitled"}
                    fill
                    className="object-cover"
                    priority={false}
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
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
    </>
  );
}

// Action
// Adventure
// Animation
// comedy
// crime
// drama
// horror
// mystery
// romance
// thriller
