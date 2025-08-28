"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share, Star } from "lucide-react";
import default_userImg from "@/public/default-userImg.png";
import { useState, useEffect } from "react";

interface ReviewCardProps {
  reviewId: string;
  movieId: string;
  username: string;
  review: string;
  likesNum: number;
  likedBy: string[];
  createdAt: string;
  profileImg?: string;
  userId?: string;
}

interface MovieDetails {
  title: string;
  poster_path: string;
  release_date: string;
}

export default function ReviewCard({
  reviewId,
  movieId,
  username,
  review,
  likesNum,
  likedBy,
  createdAt,
  profileImg,
  userId
}: ReviewCardProps) {
  const [likes, setLikes] = useState(likesNum);
  const [isLiked, setIsLiked] = useState(likedBy?.includes(userId || ''));
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [movieLoading, setMovieLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movies_section/movie_details/${movieId}/details`);
        if (response.ok) {
          const data = await response.json();
          setMovieDetails(data);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setMovieLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/movies_section/likeReview/${reviewId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikes(data.likesNum);
      }
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-[1rem] rounded-xl shadow-2xl" style={{backgroundColor: "#070707"}}>
      {/* Username and profile image */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src={profileImg || default_userImg}
            alt="Profile image"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium">{username}</p>
            <p className="text-xs text-gray-400">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-yellow-400">
          <Star size={16} fill="currentColor" />
          <span className="text-sm">Review</span>
        </div>
      </div>

      <div className="mt-4">
        {/* Movie Details Section */}
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          {movieLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-16 h-24 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ) : movieDetails ? (
            <Link 
              href={`/explore/movie/${movieId}`}
              className="block hover:bg-gray-700/30 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 p-1">
                <div className="w-16 h-24 relative rounded overflow-hidden bg-gray-700 flex items-center justify-center">
                  {movieDetails.poster_path && !imageError ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`}
                      alt={movieDetails.title}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Star size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white line-clamp-2 hover:text-blue-400 transition-colors">
                    {movieDetails.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A'}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">Click to view movie details →</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-gray-400 text-sm">
              <p>Movie ID: {movieId}</p>
              <p>Could not load movie details</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p>{review}</p>
        </div>
        
        {/* Review features */}
        <div className="flex mt-4 items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={2} />
              <span className="text-sm">{likes}</span>
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <Share strokeWidth={2} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
