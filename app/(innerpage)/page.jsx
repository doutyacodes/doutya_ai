"use client";

import LoadingSpinner from "@/app/_components/LoadingSpinner";
import NewsDetails from "@/app/_components/NewsComponent";
import NewsData from "@/app/_components/NewsData";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NewsSection() {
  const [newsCategories, setNewsCategories] = useState([]);
  const [news_top, setNews_top] = useState([]);
  const [newsByCategory, setNewsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNews, setShowNews] = useState(false);
  const [showId, setShowId] = useState(null);
  const { selectedAge } = useChildren();

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await GlobalApi.FetchNews({ age: selectedAge });
      const categories = response.data.categories || [];
      const news = response.data.news || [];
      const news_top2 = response.data.news_top || [];

      // Add "All" category
      setNewsCategories([{ name: "All" }, ...categories]);

      // Group news by categories
      const groupedNews = categories.reduce((acc, category) => {
        acc[category.name] = news.filter(
          (item) => item.news_category_id === category.id
        );
        return acc;
      }, {});

      // Add "All" category news (all news combined)
      groupedNews["All"] = news;

      const groupedNews2 = categories.reduce((acc, category) => {
        acc[category.name] = news_top2
          .filter((item) => item.news_category_id === category.id)
          .slice(0, 2);  // Limit to the first 2 news items
        return acc;
      }, {});

      groupedNews2["All"] = news_top2
      .filter((item) => item.main_news) // Filter by main_news for "All"
      .slice(0, 2);


      setNewsByCategory(groupedNews);
      setNews_top(groupedNews2);

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
  }, [selectedAge]);

  const currentCategoryNews = newsByCategory[selectedCategory] || [];
  const NEWSTOP = news_top[selectedCategory] || [];
  const filteredNews = currentCategoryNews.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  function getCategoryNameById(id) {
    const category = newsCategories.find((cat) => cat.id === id);
    return category ? category.name : null; // Returns null if no matching id is found
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 text-gray-800 w-full">
      {/* Header */}
      {/* <motion.header
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-orange-600">News</h1>
      </motion.header> */}

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
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Category Tabs */}
      <div className="w-full max-w-[82vw] mb-4">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {newsCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name);
                setShowId(null);
                setShowNews(false);
                setSearchQuery("");
              }}
              className={`whitespace-nowrap px-4 py-2 font-medium rounded-full ${
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
      {!showNews && !showId && (
        <motion.div
          className={cn("grid grid-cols-1  py-4 gap-4",NEWSTOP?.length ==2 &&"md:grid-cols-2")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {NEWSTOP.length > 0 &&
            NEWSTOP.map((article) => (
              <NewsData
                article={article}
                setShowId={setShowId}
                setShowNews={setShowNews}
                getCategoryNameById={getCategoryNameById}
                key={article.id}
                size={true}
              />
            ))}
        </motion.div>
      )}
      {/* News Cards */}
      {showNews && showId ? (
        <NewsDetails id={showId} />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={selectedCategory}
          transition={{ duration: 0.8 }}
        >
          {filteredNews.length > 0 ? (
            filteredNews.map((article) => (
              <NewsData
                article={article}
                setShowId={setShowId}
                setShowNews={setShowNews}
                getCategoryNameById={getCategoryNameById}
                key={article.id}
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
