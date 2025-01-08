"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { IoIosCloseCircle } from "react-icons/io";
import { FaEllipsisH, FaShareAlt } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import PerspectiveNavigation from "../(innerpage)/viewpoint/_components/PerspectiveNavigation/PerspectiveNavigation";

export default function NewsDetails2({ id, showNames }) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0); // Track the current viewpoint
  const [allArticles, setAllArticles] = useState([]); // Store all articles in the group
  const [nextArticle, setNextArticle] = useState([]); // Store all articles in the group
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [report_text, setReport_text] = useState("");
  const [engagementTime, setEngagementTime] = useState(0); // Track engagement time
  const [sessionId, setSessionId] = useState(Cookies.get('session_id') || "");
  const router = useRouter();
  const scrollRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch("/api/adult/fetchNews/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: parseInt(id) }),
        });
        const data = await response.json();
        if (response.ok) {
          setAllArticles(data.newsData.newsArticle);
          setArticle(data.newsData.newsArticle[0]); // Default to the first article

          setNextArticle(data.newsData.nextNews);
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

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {        
        setIsOverflowing(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        );
      }
    };

    // Check for overflow on initial render
    checkOverflow();

    // Optionally, check for overflow on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [scrollRef.current]);

  console.log("isOverflowing", isOverflowing);
  

  const updateViews = async (articleId, viewpoint, engagementTime) => {
    try {
      // Update perspective views only
      await fetch(`/api/updateViews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          sessionId,
          viewpoint,
          engagementTime,
        }),
      });
    } catch (err) {
      console.error(`Failed to update perspective views:`, err);
    }
  };

    // // Track engagement time (simple example using setInterval)
    useEffect(() => {
      const interval = setInterval(() => {
        setEngagementTime((prevTime) => prevTime + 1); // Increment every second
      }, 1000);
  
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

     // Save engagement time and viewpoint when user exits the page or closes the tab
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Update views before the user leaves or closes the page
      updateViews(allArticles[currentArticleIndex]?.id, allArticles[currentArticleIndex]?.viewpoint, engagementTime);
    };

    // Listen for the page unload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Ensure views are updated when the component is unmounted
      updateViews(allArticles[currentArticleIndex]?.id, allArticles[currentArticleIndex]?.viewpoint, engagementTime);
    };
  }, [allArticles, currentArticleIndex]);
  
    // console.log("engage',", engagementTime);
    console.log("All ARticl',", allArticles);
    console.log("cuerrent ind", currentArticleIndex);
    
  const categoriesList = () => {
    if (!showNames) return null;
    const categoryNames = showNames;
    const result = categoryNames.split(",");
    return (
      <>
        {result.map((item, index) => (
          <div
            key={index}
            className="text-[7.9px] text-white text-xs font-medium bg-orange-500 bg-opacity-80 px-2 py-[2px] rounded-md"
          >
            {item.trim()}
          </div>
        ))}
      </>
    );
  };

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

  const handleCopyLink = () => {
    const shareUrl = `https://www.axaranews.com/viewpoint/${id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewpointChange = (index) => {
    // Check if the user clicked the same perspective
    if (index === currentArticleIndex) {
      return; // Do nothing if the same perspective is selected
    }

    updateViews(allArticles[currentArticleIndex].id, allArticles[currentArticleIndex].viewpoint, engagementTime); // Update perspective views
    setEngagementTime(0); // Reset engagement time when switching viewpoints

    setCurrentArticleIndex(index);
    setArticle(allArticles[index]); // Switch to the selected viewpoint
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

  const CenteredScrollingTabs = ({ allArticles, currentArticleIndex, handleViewpointChange }) => {
    const scrollContainerRef = useRef(null);
    const [showGradients, setShowGradients] = useState({ left: false, right: false });
    
    // Check if scroll indicators should be shown
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const hasLeftScroll = container.scrollLeft > 0;
        const hasRightScroll = 
          container.scrollLeft < (container.scrollWidth - container.clientWidth);
        
        setShowGradients({
          left: hasLeftScroll,
          right: hasRightScroll
        });
      }
    };
  
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll();
      }
      
      return () => {
        if (container) {
          container.removeEventListener('scroll', checkScroll);
          window.removeEventListener('resize', checkScroll);
        }
      };
    }, []);
  
    return (
      <div className="relative w-full max-w-full mb-4">
       
        {/* Scroll container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide relative mx-auto"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: 'calc(50% - 100px)',  // Adjust based on your content
            paddingRight: 'calc(50% - 100px)'   // Adjust based on your content
          }}
        >
          <div className="flex gap-2 py-2">
            {allArticles.map((articleItem, index) => (
              <motion.button
                key={index}
                onClick={() => handleViewpointChange(index)}
                className={`px-4 py-2 border-[0.5px] border-slate-100 text-nowrap text-sm md:text-base rounded-md flex-shrink-0 ${
                  index === currentArticleIndex
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {articleItem.viewpoint}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const { title, category, image_url, date, description, created_at } = article;

  const shareUrl = `https://www.axaranews.com/viewpoint/${id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white shadow-md rounded-md border border-slate-200">
          <div className="grid grid-cols-1 gap-2 md:gap-5">
            {/* <PerspectiveNavigation /> */}

            <PerspectiveNavigation
              currentArticleIndex={currentArticleIndex}
              allArticles={allArticles}
              handleViewpointChange={handleViewpointChange}
              router={router}
              nextArticle = {nextArticle}
            />
                        
            <div className="w-full p-4 md:p-6">
              {/* Viewpoints Header */}
              <p className="mb-3 font-semibold sm:text-center text-base md:text-xl">
                View this news from the perspective of:{" "}
              </p>

              <div className="relative w-full">
                {/* Scrollable Tabs Container */}
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto pb-2 scrollbar-hide mx-auto"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {/* Inner container for centering */}
                  <div
                    className={`flex mx-auto min-w-full px-4 md:px-6 ${
                      isOverflowing ? 'justify-start' : 'justify-center'
                    }`}
                  >
                    {allArticles.map((articleItem, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleViewpointChange(index)}
                        className={`px-4 py-2 border-[0.5px] border-slate-100 text-nowrap text-sm md:text-base rounded-md flex-shrink-0 ${
                          index !== allArticles.length - 1 ? 'mr-2' : ''
                        } ${
                          index === currentArticleIndex
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {articleItem.viewpoint}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Scroll Indicators */}
                <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden" />
                <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
              </div>
              
              {/* Article Content */}
              <div className="space-y-4">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {title}
                  </h1>
                  <p className="text-sm text-gray-500 mt-2">{date}</p>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {categoriesList()}
                </div>

                <div className="relative w-full aspect-video mb-6">
                  <Image
                    src={`https://wowfy.in/testusr/images/${image_url}`}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>

                <div className="text-xs text-slate-500">{formatDate(created_at)}</div>

                <div className="flex items-center space-x-8 w-fit my-6">
                  {/* Share Icon */}
                  <div className="text-gray-500 cursor-pointer relative group">
                    <FaShareAlt size={16} />
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
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                        aria-label="Copy Link"
                        title="Copy Link"
                      >
                        <FiCopy size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Report Icon */}
                  <div
                    onClick={() => setShowReportPopup(true)}
                    className="text-gray-500 cursor-pointer rotate-90"
                  >
                    <FaEllipsisH size={16} />
                  </div>
                </div>

                <motion.div
                  className="text-lg text-gray-700 space-y-6 leading-relaxed mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  {description.split("\n\n").map((para, index) => (
                    <p key={index} className="text-justify">
                      {para}
                    </p>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 w-full flex justify-center z-30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto bg-white/90 shadow-xl rounded-full px-5 py-2 border-2 border-orange-300 max-w-[250px] w-fit"
        >
          <div className="text-center w-full">
            <div className="text-xs text-orange-600">Reading Perspective</div>
            <div className="font-medium">{article.viewpoint}</div>
          </div>
        </motion.div>
      </div>

       {/* Report Popup */}
       {showReportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99999999999999999]">
          <motion.div
            className="bg-white max-w-sm w-full p-6 rounded-lg shadow-xl space-y-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
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
                    strokeWidth="2"
                    d="M13 10V3m0 16v-7m0 0H5m8 0h8"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-xl text-center font-bold">Report Article</h1>

            <div className="space-y-4">
              <textarea
                value={report_text}
                onChange={(e) => setReport_text(e.target.value)}
                className="w-full h-20 p-4 border rounded-md"
                placeholder="Please describe your issue with the article"
              ></textarea>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowReportPopup(false)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    // Handle report submission logic
                    toast.success("Reported successfully!");
                    setShowReportPopup(false);
                  }}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
