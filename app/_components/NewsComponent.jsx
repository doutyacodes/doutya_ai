"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useChildren } from "@/context/CreateContext";
import GlobalApi from "../api/_services/GlobalApi";
import LoadingSpinner from "./LoadingSpinner";

const truncateTitle = (title, length = 40) =>
  title.length > length ? `${title.slice(0, length)}...` : title;

export default function NewsSection() {
  const [newsCategories, setNewsCategories] = useState([]);
  const [newsByCategory, setNewsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedAge } = useChildren(); // Assuming selectedAge is available in context

  // Fetch news based on the selected age
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await GlobalApi.FetchNews({
        age: selectedAge,
      });
      console.log("response", response.data);

      const categories = response.data.categories || [];
      const news = response.data.news || [];

      setNewsCategories(categories);

      // Group news by category using news_category_id
      const groupedNews = categories.reduce((acc, category) => {
        // Filter news articles by category
        acc[category.name] = news.filter((item) => item.news_category_id === category.id);
        return acc;
      }, {});

      setNewsByCategory(groupedNews);

      // Set default category
      if (categories.length > 0) {
        setSelectedCategory(categories[0].name);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedAge]);

  // Get current category news articles
  const currentCategoryNews = newsByCategory[selectedCategory] || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-gray-800 p-6">
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-orange-600">Axara News</h1>
      </motion.header>

      {/* Category Tabs */}
      <motion.div
        className="flex justify-center space-x-4 mb-6 overflow-x-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {newsCategories?.length > 0 &&
          newsCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 text-lg font-medium rounded-lg ${
                selectedCategory === category.name
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 shadow-md hover:bg-orange-100"
              }`}
            >
              {category.name}
            </button>
          ))}
      </motion.div>

      {/* News Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={selectedCategory} // Ensures animation when switching categories
        transition={{ duration: 0.8 }}
      >
        {currentCategoryNews.length > 0 ? (
          currentCategoryNews.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg"
            >
              <img
                src={`https://wowfy.in/testusr/images/${article.image_url}`}
                alt={article.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {truncateTitle(article.title)}
                </h3>
                <Link
                  href={`/news/${selectedCategory.toLowerCase()}/${article.id}`}
                  className="text-orange-500 text-sm font-medium hover:underline"
                >
                  Read More
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No news available in this category.</p>
        )}
      </motion.div>
    </div>
  );
}
