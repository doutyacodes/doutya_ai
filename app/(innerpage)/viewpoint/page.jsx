"use client";

import LoadingSpinner from "@/app/_components/LoadingSpinner";
import NewsDetails2 from "@/app/_components/NewsComponent2";
import NewsData2 from "@/app/_components/NewsData2";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Circle, Eye, Scale, Vote } from "lucide-react";
import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function NewsSection() {
  const [newsCategories, setNewsCategories] = useState([]);
  const [newsTop, setNewsTop] = useState({});
  const [newsByCategory, setNewsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNews, setShowNews] = useState(false);
  const [showId, setShowId] = useState(null);
  const [showNames, setShowNames] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { selectedRegion } = useChildren();

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await GlobalApi.FetchNewsAdult({
        region: selectedRegion,
      }); // Fetch news from backend
      const {
        categories = [],
        newsTopGroupedByGroupId = [],
        newsGroupedByGroupId = [],
      } = response.data;

      // Set categories
      const allCategory = { id: "all", name: "All" };
      setNewsCategories([allCategory, ...categories]);

      // Process top news: Include both the first article and the full array
      const topNewsMap = newsTopGroupedByGroupId.reduce((acc, group) => {
        const sortedNewsItems = [...group.newsItems].sort(
          (a, b) => new Date(a.id) - new Date(b.id)
        ); // Sort by id descending
        acc[group.news_group_id] = {
          topArticle: sortedNewsItems[0], // The top article
          allArticles: sortedNewsItems, // The full array of articles
        };
        return acc;
      }, {});

      setNewsTop(topNewsMap);

      // Process normal news: Include both the main article and the full array
      const normalNewsMap = newsGroupedByGroupId.reduce((acc, group) => {
        const sortedNewsItems = [...group.newsItems].sort(
          (a, b) => new Date(a.id) - new Date(b.id)
        ); // Sort by id descending
        acc[group.news_group_id] = {
          mainArticle: sortedNewsItems[0], // The main article
          allArticles: sortedNewsItems, // The full array of articles
        };
        return acc;
      }, {});

      setNewsByCategory(normalNewsMap);
      setSelectedCategory("All"); // Default to "All" category
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedRegion]);

  // Get news by selected category
  const currentCategoryNews =
    selectedCategory === "All"
      ? Object.values(newsByCategory)
      : Object.values(newsByCategory).filter(({ mainArticle }) =>
          mainArticle.categoryNames?.split(",").includes(selectedCategory)
        );

  // Sort by created_at in descending order
  const sortedCategoryNews = currentCategoryNews.sort(
    (a, b) =>
      new Date(b.mainArticle.created_at) - new Date(a.mainArticle.created_at)
  );

  const currentTopNews =
    selectedCategory === "All"
      ? Object.values(newsTop)
      : Object.values(newsTop).filter(({ topArticle }) =>
          topArticle.categoryNames?.split(",").includes(selectedCategory)
        );

  // Sort by created_at in descending order
  const sortedTopNews = currentTopNews.sort(
    (a, b) =>
      new Date(b.topArticle.created_at) - new Date(a.topArticle.created_at)
  );

  // Filtered news by search query
  const filteredNews = sortedCategoryNews.filter(
    ({ mainArticle }) =>
      mainArticle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mainArticle.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 text-gray-800 w-full">
      <div className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mb-4">
        <div className="w-full mx-auto px-3 py-3 md:px-4 md:py-3">
          <div className="flex flex-col  items-center justify-between">
            {/* Text Section */}
            <div className="text-white space-y-1 md:space-y-3 ">
              <h1 className="text-base md:text-3xl font-bold text-center">
                One News, Different Perspectives
              </h1>
              <p className="text-[9px] md:text-lg text-center text-white/90">
              View all sides of the story to see the complete picture.
              </p>
            </div>

            {/* Right section - only visible on desktop */}
            {/* <div className="hidden md:block md:w-1/2">
          </div> */}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full max-w-[90vw] mb-3">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className={`whitespace-nowrap flex gap-2 items-center px-3 py-2 text-sm font-medium rounded-full ${
              showSearch
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-orange-200"
            }`}
          >
            Search <HiMagnifyingGlass size={18} />
          </button>
          {newsCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name);
                setShowId(null);
                setShowNews(false);
                setSearchQuery("");
              }}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-full  ${
                selectedCategory === category.name
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {showSearch && (
        <motion.div
          className="w-full mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search news..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
      )}

      {/* Top News Section */}
      {!showNews && !showId && sortedTopNews.length > 0 && (
        <motion.div
          className={cn(
            "grid grid-cols-1 py-4 gap-4",
            sortedTopNews.length >= 2 && "md:grid-cols-2"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {sortedTopNews.map(({ topArticle, allArticles }) => (
            <NewsData2
              article={topArticle}
              allArticles={allArticles}
              setShowId={setShowId}
              setShowNames={setShowNames}
              setShowNews={setShowNews}
              key={topArticle.id}
              size={true}
            />
          ))}
        </motion.div>
      )}

      {/* News Cards */}
      {showNews && showId ? (
        <NewsDetails2 showNames={showNames} id={showId} />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  mx-auto gap-6  md:mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={selectedCategory}
          transition={{ duration: 0.8 }}
        >
          {filteredNews.length > 0 ? (
            filteredNews.map(({ mainArticle, allArticles }) => (
              <NewsData2
                article={mainArticle}
                allArticles={allArticles}
                setShowId={setShowId}
                setShowNames={setShowNames}
                setShowNews={setShowNews}
                key={mainArticle.id}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No news found.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
