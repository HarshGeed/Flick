"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import fb from "@/public/fb.png";
import instagram from "@/public/instagram.png";
import x from "@/public/twitter.png";

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
      {/* backdrop image */}
      <div className="flex">
        <div
          className="w-full h-[34rem] z-0 relative backdrop-opacity-60"
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
                      <Image src={instagram} alt="Instagram link" width={20} className="mt-1"/> 
                    </Link>
                  )}
                  <p>|</p>
                  {externalLinks?.facebook_id && (
                    <Link
                      href={`https://facebook.com/${externalLinks.facebook_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image src={fb} alt="facebook link" width={20} className="mt-1"/>
                    </Link>
                  )}
                  <p>|</p>
                  {externalLinks?.twitter_id && (
                    <Link
                      href={`https://twitter.com/${externalLinks.twitter_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image src={x} alt="x link" width={20} className="mt-1"/>
                    </Link>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
