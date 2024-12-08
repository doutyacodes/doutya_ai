"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { useChildren } from "@/context/CreateContext";
import { IoIosCloseCircle } from "react-icons/io";

export default function NewsDetails({ id, showNames }) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedAge } = useChildren();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ word: "", meaning: "" });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch("/api/fetchNews/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: parseInt(id), age: selectedAge }),
        });
        const data = await response.json();
        if (response.ok) {
          setArticle(data);
        } else {
          setError(data.error || "Failed to fetch news");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to fetch news");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const categoriesList = () => {
    if (!showNames) return null; // Handle cases where data is null or undefined
    const categoryNames =     showNames
    ;
    const result = categoryNames.split(",");
    
    return (
      <>
        {result.map((item, index) => (
          <div
            key={index} // Always add a unique key when rendering lists
            className="  text-[7.9px] text-white text-xs font-medium bg-orange-500 bg-opacity-80 px-2 py-[2px] rounded-md"
          >
            {item.trim()} {/* Remove extra spaces */}
          </div>
        ))}
      </>
    );
  };

  const handleWordClick = (word, meaning) => {
    setPopupContent({ word, meaning });
    setShowPopup(true);
  };

  const replaceWordsWithSpans = (text) => {
    const wordsWithMeanings = article.meanings || [];
    const words = text.split(/\b/); // Split text into words and non-word characters
    return words.map((word, index) => {
      const meaningObj = wordsWithMeanings.find(
        (meaning) => meaning.word.toLowerCase() === word.toLowerCase()
      );
      if (meaningObj) {
        return (
          <span
            key={index}
            className="font-bold text-blue-500 cursor-pointer"
            onClick={() => handleWordClick(meaningObj.word, meaningObj.description)}
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">{error}</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Article not found. Please try another one!
        </h2>
      </div>
    );
  }

  const { title, image_url, date, description, created_at } = article;

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    return new Date(date).toLocaleString("en-IN", options).replace(",", "");
  };

  return (
    <div className="text-gray-800 p-2 pb-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-2">{date}</p>
      </div>
<div className="mb-3 flex gap-2">
  {categoriesList()}
</div>
      <Image
        src={`https://wowfy.in/testusr/images/${image_url}`}
        alt={title}
        width={800}
        height={300}
        className="rounded-md mb-6"
      />

      <div className="text-xs text-slate-500">{formatDate(created_at)}</div>

      <motion.div
        className="text-lg text-gray-700 space-y-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {description
          .split("\n\n")
          .map((para, index) => (
            <p key={index} className="text-justify">
              {replaceWordsWithSpans(para)}
            </p>
          ))}
      </motion.div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl relative w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2  text-white"
              >
                <IoIosCloseCircle size={24} color="#dc2626" />
              </button>
              <h2 className="text-lg font-bold text-gray-800">
                Word: {popupContent.word}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Meaning: {popupContent.meaning}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
