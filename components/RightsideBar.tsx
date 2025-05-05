"use client";
import { getNewsArticles } from "@/sanity/sanity-utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RightsideBar() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true); // Set loading state
        const articles = await getNewsArticles(); // Fetch articles from Sanity
        setNews(articles);
      } catch (error) {
        console.error("Error fetching news articles:", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    }

    // Fetch news articles when the component is rendered
    fetchNews();
  }, []);

  console.log("This is the news incoming", news);
  return (
    <div className="sticky top-0 pt-2 ml-4">
      <div className="space-y-4">
        {/* News */}
        <div className="w-full rounded-2xl border-1 border-stone-800 px-2 pb-3">
          <h1 className="text-xl font-bold px-2 pt-2">News on the go</h1>
          {loading ? (
            <p className="text-gray-500">Loading news...</p>
          ) : news.length > 0 ? (
            news.slice(0, 6).map((article) => (
              
                <div
                 key={article._id}
                  className="w-full rounded-2xl p-4 shadow-2xl mt-[1rem]"
                  style={{ backgroundColor: "#0f0f0f" }}
                >
                  <Link href={article.sourceUrl}>
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
          <div
            className="w-full rounded-2xl p-4 shadow-2xl mt-[1rem]"
            style={{ backgroundColor: "#0f0f0f" }}
          >
            <h2 className="font-bold">News headline</h2>
            <p className="pt-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatum optio aliquam at exercitationem error in dicta
              asperiores, quia tempore voluptatem tempora porro excepturi
              officiis vitae.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
