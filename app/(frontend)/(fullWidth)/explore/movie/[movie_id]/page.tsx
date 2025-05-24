"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import fb from "@/public/fb.png";
import instagram from "@/public/instagram.png";
import x from "@/public/twitter.png";
import { Bookmark } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
import { Virtual } from "swiper/modules";
import Modal from "react-modal";
import socket from "@/lib/socket";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

Modal.setAppElement("body");

export default function MovieDetailsPage() {
  const { movie_id } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [externalLinks, setExternalLinks] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const [videos, setVideos] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => {
    setModalIsOpen(false);
    setContent("");
  };

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setBtnLoading(true);
    try {
      const res = await fetch("/api/movies_section/createReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie_id,
          review: content,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Emit new_review event with the created review
        socket.emit("new_review", data.review);
        setModalIsOpen(false);
        setContent("");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (!movie_id) return;
    fetch(`/api/movies_section/fetchReview/${movie_id}`)
      .then((res) => res.json())
      .then(setReviews);
  }, [movie_id]);

  // Real-time: Listen for new reviews and likes
  useEffect(() => {
    if (!socket) return;
    const handleNewReview = (review) => {
      if (review.movieId === movie_id) {
        setReviews((prev) => [review, ...prev]);
      }
    };
    const handleReviewLiked = ({ reviewId, likesNum }) => {
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, likesNum } : r))
      );
    };
    socket.on("new_review", handleNewReview);
    socket.on("review_liked", handleReviewLiked);
    return () => {
      socket.off("new_review", handleNewReview);
      socket.off("review_liked", handleReviewLiked);
    };
  }, [movie_id]);

  // Like/unlike handler
  const handleLike = async (reviewId: string) => {
    const res = await fetch(`/api/movies_section/likeReview/${reviewId}`, {
      method: "POST",
    });
    console.log("This is the response of like", res);
    if (res.ok) {
      const data = await res.json();
      socket.emit("like_review", {
        reviewId: data.reviewId,
        likesNum: data.likesNum,
      });
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? {
                ...r,
                likesNum: data.likesNum,
                likedBy: data.liked
                  ? [...(r.likedBy || []), userId]
                  : (r.likedBy || []).filter((id) => id !== userId),
              }
            : r
        )
      );
    }
  };

  useEffect(() => {
    if (!movie_id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/movies_section/movie_details/${movie_id}/details`).then(
        (res) => res.json()
      ),
      fetch(`/api/movies_section/movie_details/${movie_id}/credits`).then(
        (res) => res.json()
      ),
      fetch(`/api/movies_section/movie_details/${movie_id}/externalLinks`).then(
        (res) => res.json()
      ),
      fetch(`/api/movies_section/movie_details/${movie_id}/images`).then(
        (res) => res.json()
      ),
      fetch(`/api/movies_section/movie_details/${movie_id}/videos`).then(
        (res) => res.json()
      ),
      fetch(
        `/api/movies_section/movie_details/${movie_id}/recommendations`
      ).then((res) => res.json()),
    ])
      .then(
        ([
          details,
          credits,
          externalLinks,
          images,
          videos,
          recommendations,
        ]) => {
          setDetails(details);
          setCredits(credits);
          setExternalLinks(externalLinks);
          setImages(images);
          setVideos(videos);
          setRecommendations(recommendations);
        }
      )
      .catch(() => setError("Unable to fetch movie details."))
      .finally(() => setLoading(false));
  }, [movie_id]);

  const trailer = videos?.results?.find(
    (v: any) => v.site === "YouTube" && v.type === "Trailer"
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-400 py-8">{error}</div>;
  if (!details) return null;

  return (
    <>
      {/* Header section*/}
      <div className="flex">
        <div
          className="w-full h-[35rem] z-0 relative backdrop-opacity-60"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          {/* foreground content */}
          <div className="relative z-10 flex h-full">
            <div className="relative z-10 flex items-center h-full w-[20rem] overflow-hidden rounded-xl">
              <Image
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                fill
                alt={details.title}
                className="h-auto shadow-lg object-cover py-8 pl-6"
              />
            </div>

            {/* details */}
            <div className="relative z-10 flex h-full pl-8 items-center">
              {/* Details */}
              <div className="ml-8 text-white max-w-2xl flex flex-col">
                <h1 className="text-4xl font-bold mb-2">{details.title}</h1>
                {details.tagline && (
                  <p className="italic text-lg text-yellow-300 mb-2">
                    {details.tagline}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  {details.genres.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="bg-indigo-700 text-white px-2 py-1 rounded text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mb-2 text-sm text-gray-300">
                  <span>Release: {details.release_date}</span>
                  <span>Runtime: {details.runtime} min</span>
                  <span>Rating: ⭐ {details.vote_average}</span>
                </div>
                <p className="mb-4 text-gray-200">{details.overview}</p>
                <div className="mb-2">
                  <span className="font-semibold">Production Companies: </span>
                  {details.production_companies
                    .map((c: any) => c.name)
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Languages: </span>
                  {details.spoken_languages
                    .map((l: any) => l.english_name)
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Countries: </span>
                  {details.production_countries
                    .map((c: any) => c.name)
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div className="flex space-x-2 mt-2">
                  {details.homepage && (
                    <Link
                      href={details.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400"
                    >
                      Official Website
                    </Link>
                  )}
                  <p>|</p>
                  {trailer && (
                    <Link
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400"
                    >
                      🎬 Watch Trailer
                    </Link>
                  )}
                  <p>|</p>
                  {externalLinks?.instagram_id && (
                    <Link
                      href={`https://instagram.com/${externalLinks.instagram_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={instagram}
                        alt="Instagram link"
                        width={20}
                        className="mt-1"
                      />
                    </Link>
                  )}
                  <p>|</p>
                  {externalLinks?.facebook_id && (
                    <Link
                      href={`https://facebook.com/${externalLinks.facebook_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={fb}
                        alt="facebook link"
                        width={20}
                        className="mt-1"
                      />
                    </Link>
                  )}
                  <p>|</p>
                  {externalLinks?.twitter_id && (
                    <Link
                      href={`https://twitter.com/${externalLinks.twitter_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image src={x} alt="x link" width={20} className="mt-1" />
                    </Link>
                  )}
                </div>
                <div className="flex mt-4 space-x-3">
                  <button className="bg-[#141414] p-3 rounded-full">
                    <Bookmark />
                  </button>
                  <button
                    className="bg-[#141414] px-3 py-1 rounded-xl"
                    onClick={handleOpenModal}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main section */}

      {/* Movie Info Section */}
      <div className="max-w-[60rem] mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm">
        <div className="bg-[#18181b] rounded-lg p-4 flex flex-col items-center">
          <span className="font-semibold">Status</span>
          <span className="mt-1">{details.status}</span>
        </div>
        <div className="bg-[#18181b] rounded-lg p-4 flex flex-col items-center">
          <span className="font-semibold">Original Language</span>
          <span className="mt-1 uppercase">{details.original_language}</span>
        </div>
        <div className="bg-[#18181b] rounded-lg p-4 flex flex-col items-center">
          <span className="font-semibold">Budget</span>
          <span className="mt-1">
            {details.budget
              ? details.budget.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })
              : "N/A"}
          </span>
        </div>
        <div className="bg-[#18181b] rounded-lg p-4 flex flex-col items-center">
          <span className="font-semibold">Revenue</span>
          <span className="mt-1">
            {details.revenue
              ? details.revenue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Cast */}
      {credits?.cast && credits.cast.length > 0 && (
        <div className="max-w-[60rem] mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Cast</h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            modules={[Scrollbar]}
            className="mySwiper"
          >
            {credits.cast
              .filter((actor: any) => actor.known_for_department === "Acting")
              .map((actor: any, index) => (
                <SwiperSlide key={`${actor.id}-${index}`}>
                  <div className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col items-center h-[22rem]">
                    <div className="relative w-full h-[17rem] overflow-hidden mb-3">
                      <Image
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                            : "/placeholder.jpg"
                        }
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-white font-semibold">{actor.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {actor.character}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      )}

      {/* Images */}
      {images?.backdrops && images.backdrops.length > 0 && (
        <div className="max-w-[60rem] mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Images</h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            modules={[Scrollbar]}
            className="mySwiper"
          >
            {images.backdrops.map((img: any, idx: number) => (
              <SwiperSlide key={`${img.file_path}-${idx}` || idx}>
                <div className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col items-center h-[17rem]">
                  <div className="relative w-full h-[17rem] overflow-hidden">
                    <Image
                      src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                      alt="Backdrop"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Videos */}
      {videos?.results && videos.results.length > 0 && (
        <div className="max-w-[60rem] mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Videos</h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            modules={[Scrollbar]}
            className="mySwiper"
          >
            {videos.results
              .filter((v: any) => v.site === "YouTube")
              .map((v: any, index: number) => (
                <SwiperSlide key={`${v.id}-${index}`} virtualIndex={index}>
                  <div className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col items-center h-[17rem]">
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <iframe
                        loading="lazy"
                        width="100%"
                        height="230"
                        src={`https://www.youtube.com/embed/${v.key}`}
                        title={v.name}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded w-full h-full"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      )}

      {/* Reviews  */}
      <h2 className="text-2xl font-semibold mt-10 text-white">Reviews</h2>
      <div className="max-w-[60rem] mx-auto mt-4 min-h-[3rem] max-h-[20rem] overflow-y-auto">
        {reviews.length === 0 && (
          <p className="text-gray-400">No reviews yet.</p>
        )}
        <ul className="space-y-4">
          {reviews.map((review) => {
            const isLiked = review.liked
            console.log(isLiked)
            const profileImg =
              review.user?.profileImage && review.user.profileImage !== ""
                ? review.user.profileImage
                : "/placeholder.jpg";

            return (
              <li
                key={review._id}
                className="bg-[#0e0e0f] rounded-lg p-3 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={profileImg}
                    alt={review.user?.username || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="font-bold">
                    {review.user?.username || "User"}
                  </span>
                </div>
                <p className="mb-2">{review.review}</p>
                <button onClick={() => handleLike(review._id)}>
                  <div className="flex space-x-1 items-center">
                    <span>
                      <Heart
                        color={isLiked ? "red" : "gray"}
                        fill={isLiked ? "red" : "none"}
                      />
                    </span>
                    <span>{review.likesNum || 0}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recommendations */}
      {/* Recommendations */}
      {recommendations?.results && recommendations.results.length > 0 && (
        <div className="max-w-[60rem] mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Recommendations
          </h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            modules={[Scrollbar]}
            className="mySwiper"
          >
            {recommendations.results.slice(0, 20).map((rec: any, idx) => (
              <SwiperSlide key={`${rec.id}-${idx}`} className="!w-[11rem]">
                <div className="bg-[#18181b] rounded-xl shadow-lg overflow-hidden flex flex-col h-[22rem]">
                  <div className="relative w-full aspect-[2/3] overflow-hidden">
                    <Image
                      src={
                        rec.poster_path
                          ? `https://image.tmdb.org/t/p/w500${rec.poster_path}`
                          : "/placeholder.jpg"
                      }
                      alt={rec.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="text-white text-base font-semibold line-clamp-2 min-h-[2.5rem]">
                      {rec.title || rec.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 ">
                      {rec.overview || "No description."}
                    </p>
                    <span className="mt-2 text-xs text-yellow-400">
                      ⭐ {rec.vote_average}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="modal-content" // Apply animation class
        overlayClassName="modal-overlay" // Custom overlay styling
        bodyOpenClassName="overflow-hidden"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full min-h-[300px] max-h-[80vh] overflow-hidden"
        >
          <div className="flex-grow overflow-y-auto">
            <textarea
              id="content"
              placeholder="What's on your mind?"
              className="pl-[3rem] pr-2 w-full text-white rounded-md resize-none focus:outline-none overflow-y-auto bg-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ lineHeight: "1.5", minHeight: "100px", color: "white" }}
            />
          </div>
          <div className="flex justify-between items-center bg-black mt-2">
            <button
              type="submit"
              disabled={!content.trim()}
              className={`bg-amber-200 text-black text-md px-4 py-2 rounded-md hover:opacity-90 transition duration-300 ease-in-out ${
                content.trim()
                  ? "bg-amber-200 text-black hover:opacity-90"
                  : "bg-white text-gray-700 cursor-not-allowed"
              }`}
            >
              {btnLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </Modal>

      <style jsx global>{`
        .modal-overlay {
          background-color: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Align modal to the top */
          padding-top: 20px; /* Add some space from the top */
          margin-top: 9rem;
          z-index: 1050;
        }

        .modal-content {
          width: 800px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          background: black; /* Changed background to black */
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
          overflow-y: auto;
          transform: translateY(100%);
          animation: slide-up 0.3s ease-out forwards;
          color: white;
          z-index: 1100;
        }

        .overflow-hidden {
          overflow: hidden;
        }

        /* Scrollbar Customization */
        .modal-content::-webkit-scrollbar,
        .flex-grow::-webkit-scrollbar {
          width: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb,
        .flex-grow::-webkit-scrollbar-thumb {
          background-color: black !important; /* Scrollbar thumb color */
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-track,
        .flex-grow::-webkit-scrollbar-track {
          background-color: gray !important; /* Scrollbar track color */
        }

        /* Firefox Scrollbar */
        .modal-content,
        .flex-grow {
          scrollbar-color: black #f0f0f0; /* Thumb color and track color */
          scrollbar-width: thin; /* Make the scrollbar thinner */
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(-20%);
            opacity: 1;
          }
        }

        #content:empty::before {
          content: attr(placeholder);
          color: gray;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
