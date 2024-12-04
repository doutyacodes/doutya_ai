"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { useChildren } from "@/context/CreateContext";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";
import { FaEllipsisH, FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import GlobalApi from "../api/_services/GlobalApi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
export default function NewsDetails({ id }) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedAge } = useChildren();
  const [report_text, setReport_text] = useState("");
  const [showReportPopup, setShowReportPopup] = useState(false);

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

  const handleReport = async () => {
    try {
      const response = await GlobalApi.ReportNews({
        news_id: id,
        report_text,
      });
      console.log(response.data);
      if (response?.data) {
        toast.success("News reported successfully.");
      }
      setReport_text("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to report the news.Please try again");
    } finally {
      setShowReportPopup(false);
    }
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

  const {
    title,
    category,
    image_url,
    date,
    description,
    questions,
    meanings,
    created_at,
  } = article;
  const shareUrl = `https://www.axara.co/news/${category.toLowerCase()}/${id}`;
  // console.log("meanings",meanings)
  // Replace words with hoverable bolded spans

  const replaceWordsWithHover = (text) => {
    const placeholderPrefix = "__PLACEHOLDER__";
    const placeholderSuffix = "__END__";
    let placeholderMap = {};
  
    // Step 1: Temporarily replace descriptions with placeholders
    meanings.forEach(({ description }, index) => {
      const placeholder = `${placeholderPrefix}${index}${placeholderSuffix}`;
      placeholderMap[placeholder] = description;
      text = text.replace(description, placeholder);
    });
  
    // Step 2: Replace only the words in the main content
    meanings.forEach(({ word, description }) => {
      const regex = new RegExp(`\\b(${word})\\b`, "gi");
      text = text.replace(
        regex,
        (match) =>
          `<span class="group font-bold cursor-pointer relative hover:text-orange-500 text-blue-500">
            <span>${match}</span>
            <div class="absolute right-0 bottom-full mb-2 hidden group-hover:flex w-[250px] max-w-sm p-2 bg-white shadow-md border rounded-lg z-10 text-sm text-gray-700 overflow-wrap break-word">
              <span class="tooltip-content">${description}</span>
            </div>
          </span>`
      );
    });
  
    // Step 3: Restore original descriptions from placeholders
    Object.entries(placeholderMap).forEach(([placeholder, description]) => {
      text = text.replace(placeholder, description);
    });
  
    return text;
  };
  

  // Process summary and paragraphs
  // const processedSummary = replaceWordsWithHover(summary);
  const processedParagraphs = description
    .split("\n\n")
    .map((para) => replaceWordsWithHover(para));

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
    <div className="text-gray-800 p-2">
      {/* Header Section */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-sm text-orange-500 uppercase font-medium mb-2">
          {category}
        </div>
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-2">{date}</p>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="w-fit rounded-lg shadow-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={`https://wowfy.in/testusr/images/${image_url}`}
          alt={title}
          width={800}
          height={300}
          className="rounded-md"
        />
      </motion.div>
      <div className="text-xs text-slate-500">{formatDate(created_at)}</div>
      <div className="flex items-center space-x-8 w-fit  my-6">
        {/* Share Icon */}
        <div className="text-gray-500 cursor-pointer relative group">
          <FaShareAlt size={16} />
          {/* Share Options */}
          <div className="hidden group-hover:flex gap-2 absolute -top-10 left-0 bg-white border shadow-lg rounded-md p-2 z-50">
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <TelegramShareButton url={shareUrl} title={title}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
          </div>
        </div>

        {/* Report Icon */}
        <div
          onClick={() => {
            setShowReportPopup(true);
            console.log("Report popup triggered");
          }}
          className="text-gray-500 cursor-pointer rotate-90"
        >
          <FaEllipsisH size={16} />
        </div>
      </div>

      {/* Summary Section */}
      {/* <motion.div
        className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-md shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        dangerouslySetInnerHTML={{ __html: processedSummary }}
      ></motion.div> */}

      {/* Content Section */}
      <motion.div
        className="text-lg text-gray-700 space-y-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {processedParagraphs.map((paragraph, index) => (
          <p
            key={index}
            className=" text-justify"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          ></p>
        ))}
      </motion.div>

      {/* Questions Section */}
      {questions && questions.length > 0 && (
        <motion.div
          className="mt-8 bg-gray-100 p-6 rounded-md shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Questions for revision
          </h2>
          <ol className="list-decimal pl-6 space-y-4">
            {questions.map((question, index) => (
              <li key={index} className="text-lg text-gray-700">
                {question}
              </li>
            ))}
          </ol>
        </motion.div>
      )}
      <AnimatePresence>
        {showReportPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99999999999999999]">
            <motion.div
              className="bg-white max-w-sm w-full p-6 rounded-lg shadow-xl space-y-6 relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {/* Report Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-red-100 rounded-full flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636a9 9 0 11-12.728 0M12 9v2m0 4h.01"
                    />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-700 text-lg font-semibold text-center">
                Are you sure you want to report this?
              </p>
              <p className="text-gray-500 text-sm text-center">
                Reporting will send this content for review. This action cannot
                be undone.
              </p>

              {/* Optional Textarea */}
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Optional: Provide additional information about your report..."
                value={report_text}
                onChange={(e) => setReport_text(e.target.value)}
              />

              {/* Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleReport}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-shadow shadow-md hover:shadow-lg"
                >
                  Yes, Report
                </button>
                <button
                  onClick={() => setShowReportPopup(false)}
                  className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium hover:from-gray-400 hover:to-gray-500 transition-shadow shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
