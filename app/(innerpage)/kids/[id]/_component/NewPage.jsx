"use client";

import LoadingSpinner from "@/app/_components/LoadingSpinner";
import NewsDetails from "@/app/_components/NewsComponent";
import NewsData from "@/app/_components/NewsData";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function NewPage() {
  const [newsCategories, setNewsCategories] = useState([]);
  const [newsTop, setNewsTop] = useState({});
  const [newsByCategory, setNewsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNews, setShowNews] = useState(false);
  const [showId, setShowId] = useState(null);
  // const { selectedAge, selectedRegion, handleRegionChange } = useChildren();
  const { selectedRegion, getCurrentAge, isAgeLoaded } = useChildren();
  const [showNames, setShowNames] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const selectedAge = getCurrentAge();

  const pathname = usePathname();
  const [, , id] = pathname.split("/");
  console.log("showNews", showNews, "showId", showId )
  
  useEffect(() => {
    setShowId(id);
    setShowNews(true);
  }, [id]);

  const fetchNews = async () => {
    if (!selectedAge || !isAgeLoaded) return;
    try {
      setIsLoading(true);
      const response = await GlobalApi.FetchNews({
        age: selectedAge,
        region: selectedRegion,
      });
      const {
        categories = [],
        news = [],
        newsTop: newsTopData = [],
      } = response.data;

      // Add "All" category
      const allCategory = { id: "all", name: "All" };
      setNewsCategories([allCategory, ...categories]);

      // Group news by categories
      const groupedNews = categories.reduce((acc, category) => {
        acc[category.name] = news.filter((item) =>
          item.categoryIds.split(",").map(Number).includes(category.id)
        );
        return acc;
      }, {});
      groupedNews["All"] = news;

      // Group top news by categories
      const groupedNewsTop = categories.reduce((acc, category) => {
        acc[category.name] = newsTopData.filter((item) =>
          item.categoryIds.split(",").map(Number).includes(category.id)
        );
        return acc;
      }, {});
      groupedNewsTop["All"] = newsTopData;

      setNewsByCategory(groupedNews);
      setNewsTop(groupedNewsTop);

      // Default to "All" category
      setSelectedCategory("All");
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAge) {
      fetchNews();
    }
  }, [selectedAge, selectedRegion]);

  const currentCategoryNews = newsByCategory[selectedCategory] || [];
  const currentTopNews = newsTop[selectedCategory] || [];
  const filteredNews = currentCategoryNews.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  function getCategoryNamesByIds(ids) {
    // Handle case where ids is a single ID or an array of IDs
    const idsArray = Array.isArray(ids) ? ids : [ids];

    // Get category names for the given IDs
    const categoryNames = idsArray.map((id) => {
      const category = newsCategories.find((cat) => cat.id === id);
      return category ? category.name : null; // Return category name or null if not found
    });

    // Filter out null values and join the category names with commas
    return categoryNames.filter((name) => name !== null).join(", ");
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="w-full bg-gradient-to-r from-blue-400 via-blue-300 to-red-500 shadow-md">
        <div className="w-full mx-auto px-3 py-3 md:px-4 md:py-4">
          <div className="flex flex-col items-center justify-between">
            {/* Text Section */}
            <div className="text-white space-y-1 md:space-y-3">
              <h1 className="text-base md:text-3xl font-bold text-center flex items-center justify-center">
                <span className="mr-2">News For Young Explorers</span>
                <span className="hidden md:inline">✨</span>
              </h1>
              <p className="text-[9px] md:text-lg text-center text-white/90">
                Big stories explained simply, just for you!
              </p>
            </div>    
          </div>
        </div>
      </div>

      <div className="p-4 text-gray-800 w-full">
          {showSearch && (
          <>
            {/* Search Bar */}
            <motion.div
              className="w-full mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search news..."
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </>
        )}

        {/* Top News Section */}
        {!showNews && !showId && selectedRegion && currentTopNews.length > 0 && (
          <motion.div
            className={cn(
              "grid grid-cols-1 py-4 gap-4",
              currentTopNews.length >= 2 && "md:grid-cols-2"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {currentTopNews.map((article) => (
              <NewsData
                article={article}
                setShowId={setShowId}
                setShowNews={setShowNews}
                setShowNames={setShowNames}
                key={article.id}
                size={true}
                regionId={selectedRegion}
              />
            ))}
          </motion.div>
        )}

        {/* News Cards */}
        {showNews && showId ? (
          <NewsDetails showNames={showNames} id={showId} />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={selectedCategory}
            transition={{ duration: 0.8 }}
          >
            {filteredNews.length > 0 && selectedRegion ? (
              filteredNews.map((article) => (
                <NewsData
                  article={article}
                  setShowId={setShowId}
                  setShowNames={setShowNames}
                  setShowNews={setShowNews}
                  key={article.id}
                  regionId={selectedRegion}
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
    </>
  );
}
