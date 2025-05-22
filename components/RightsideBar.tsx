"use client";
import { getNewsArticles, getHotPicks } from "@/sanity/sanity-utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutBtn from "./LogoutBtn";

export default function RightsideBar() {
  const [news, setNews] = useState([]);
  const [hotPicks, setHotPicks] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingHotPicks, setLoadingHotPicks] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoadingNews(true);
        const articles = await getNewsArticles();
        setNews(articles);
      } catch (error) {
        console.error("Error fetching news articles:", error);
      } finally {
        setLoadingNews(false);
      }
    }

    async function fetchHotPicks() {
      try {
        setLoadingHotPicks(true);
        const picks = await getHotPicks();
        setHotPicks(picks);
      } catch (error) {
        console.error("Error fetching hot picks:", error);
      } finally {
        setLoadingHotPicks(false);
      }
    }

    fetchNews();
    fetchHotPicks();
  }, []);

  console.log("This is the news incoming", news);
  return (
    <div className="sticky top-0 pt-2 ml-4">
      {/* temporary log out button */}
      <div className="mb-4">
        <LogoutBtn/>
      </div>
      <div className="space-y-4">
        {/* News */}
        <div className="w-full rounded-2xl border-1 border-stone-800 px-2 pb-3">
          <h1 className="text-xl font-bold px-2 pt-2">News on the go</h1>
          {loadingNews ? (
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
        {/* Hot Picks - here we need to fetch it from sanity right now it is not uploaded to sanity*/}
        <div className="w-full rounded-2xl border-1 border-stone-800 px-2 mt-3 pb-3">
          <h1 className="text-xl font-bold px-2 pt-2">Hot Picks</h1>
          {loadingHotPicks ? (
            <p className="text-gray-500">Loading Hot Picks...</p>
          ) : hotPicks.length > 0 ? (
            hotPicks.slice(0, 6).map((article) => (
              
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
            <p className="text-gray-500">No hot picks available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
