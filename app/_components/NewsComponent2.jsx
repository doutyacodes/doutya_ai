"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { IoIosCloseCircle } from "react-icons/io";
import { FaEllipsisH, FaShareAlt } from "react-icons/fa";
import { ArrowLeft, ChevronLeft, ChevronRight, Home, Plus, Sparkles } from "lucide-react";
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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import PerspectiveNavigation from "../(innerpage)/news/_components/PerspectiveNavigation/PerspectiveNavigation";
import { cn } from "@/lib/utils";
import { trackAction } from "./(analytics)/shareUrlTracker";
import AddViewpointModal from "./AddViewpointModal"; // Import the modal component

export default function NewsDetails2({ id, showNames }) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [allArticles, setAllArticles] = useState([]);
  const [nextArticle, setNextArticle] = useState([]);
  const [previousArticle, setPreviousArticle] = useState([]);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [report_text, setReport_text] = useState("");
  const [engagementTime, setEngagementTime] = useState(0);
  const [sessionId, setSessionId] = useState(Cookies.get("session_id") || "");
  const router = useRouter();
  const scrollRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Custom viewpoints functionality
  const [userPlan, setUserPlan] = useState(null);
  const [userNewsCount, setUserNewsCount] = useState(0);
  const [hasElitePlan, setHasElitePlan] = useState(false);
  const [newsGroupId, setNewsGroupId] = useState(null);
  const [showAddViewpointModal, setShowAddViewpointModal] = useState(false);

  const fetchArticle = async () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const response = await fetch("/api/adult/fetchNews/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(id) }),
      });
      const data = await response.json();
      if (response.ok) {
        setAllArticles(data.newsData.newsArticle);
        setArticle(data.newsData.newsArticle[0]);

        setNextArticle(data.newsData.nextNews);
        setPreviousArticle(data.newsData.prevNews);

        // Set custom viewpoints data
        setUserPlan(data.newsData.userPlan);
        setUserNewsCount(data.newsData.userNewsCount);
        setHasElitePlan(data.newsData.hasElitePlan);
        setNewsGroupId(data.newsData.news_group_id);
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

  useEffect(() => {
    fetchArticle();
  }, [id]);

  // Handle successful viewpoint addition
  const handleViewpointSuccess = () => {
    fetchArticle(); // Refresh the data to get new viewpoints
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        setIsOverflowing(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [scrollRef.current]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentArticleIndex]);

  const updateViews = async (articleId, viewpoint, engagementTime) => {
    try {
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

  useEffect(() => {
    const updateViewImmediately = () => {
      if (allArticles[currentArticleIndex]?.id && !allArticles[currentArticleIndex]?.user_created) {
        updateViews(
          allArticles[currentArticleIndex]?.id,
          allArticles[currentArticleIndex]?.viewpoint,
          0
        );
      }
    };

    updateViewImmediately();

    const interval = setInterval(() => {
      setEngagementTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentArticleIndex]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (allArticles[currentArticleIndex]?.id && !allArticles[currentArticleIndex]?.user_created) {
        updateViews(
          allArticles[currentArticleIndex]?.id,
          allArticles[currentArticleIndex]?.viewpoint,
          engagementTime
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (allArticles[currentArticleIndex]?.id && !allArticles[currentArticleIndex]?.user_created) {
        updateViews(
          allArticles[currentArticleIndex]?.id,
          allArticles[currentArticleIndex]?.viewpoint,
          engagementTime
        );
      }
    };
  }, [allArticles, currentArticleIndex]);

  const categoriesList = () => {
    if (!showNames) return null;
    const categoryNames = showNames;
    const result = categoryNames.split(",");
    return (
      <>
        {result.map((item, index) => (
          <div
            key={index}
            className="text-[7.9px] text-white text-xs font-medium bg-red-800 bg-opacity-80 px-2 py-[2px] rounded-md"
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
    const shareUrl = `https://www.doutya.com/news/${id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
        trackAction("copy_link", article.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewpointChange = (index) => {
    if (index === currentArticleIndex) {
      return;
    }

    setCurrentArticleIndex(index);
    setArticle(allArticles[index]);
  };

  const newsContent = () => {
    const regularArticles = allArticles.filter(article => !article.user_created);
    const customArticles = allArticles.filter(article => article.user_created);

    return (
      <div className="w-full p-4 md:p-6">
        {/* Viewpoints Header */}
        <p className="mb-3 font-semibold sm:text-center text-base md:text-xl">
          View this news from the perspective of:{" "}
        </p>

        {/* Elite Badge if user has custom viewpoints */}
        {hasElitePlan && userNewsCount > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <Sparkles size={14} />
              Elite Member - {userNewsCount} Custom Viewpoint{userNewsCount > 1 ? 's' : ''} Available
            </div>
          </div>
        )}

        <div className="relative w-full">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-2 scrollbar-hide mx-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div
              className={`flex mx-auto min-w-full px-4 md:px-6 ${
                isOverflowing ? "justify-start" : "justify-center"
              }`}
            >
              {/* Regular viewpoints */}
              {allArticles.map((articleItem, index) => (
                <motion.button
                  key={`viewpoint-${index}`}
                  onClick={() => handleViewpointChange(index)}
                  className={`px-4 py-2 border-[0.5px] border-slate-100 text-nowrap text-sm md:text-base rounded-md flex-shrink-0 mr-2 relative ${
                    index === currentArticleIndex
                      ? articleItem.user_created
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-red-800 text-white shadow-lg'
                      : articleItem.user_created
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {articleItem.user_created && (
                    <Sparkles size={14} className="inline mr-1" />
                  )}
                  {articleItem.viewpoint}
                  {articleItem.user_created && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      ✨
                    </span>
                  )}
                </motion.button>
              ))}

              {/* Add Custom Viewpoint Button */}
              {hasElitePlan && userNewsCount < 3 && (
                <motion.button
                  onClick={() => setShowAddViewpointModal(true)}
                  className="px-4 py-2 border-2 border-dashed border-purple-300 text-purple-600 text-sm md:text-base rounded-md flex-shrink-0 hover:border-purple-400 hover:bg-purple-50 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add custom viewpoint (Elite feature)"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Add Viewpoint</span>
                  <span className="sm:hidden">Add</span>
                </motion.button>
             )}
            </div>
          </div>

          <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
        </div>

        {/* Article Content */}
        <div className="space-y-4">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {article?.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2">{article?.date}</p>
            
            {/* Custom viewpoint indicator */}
            {article?.user_created && (
              <div className="mt-3 flex items-center gap-2">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Sparkles size={12} />
                  Custom Viewpoint
                </div>
                <span className="text-xs text-gray-500">Generated specifically for you</span>
              </div>
            )}
          </div>

          <div className="mb-3 flex flex-wrap gap-2">{categoriesList()}</div>

          <div className="relative w-full aspect-video mb-6">
            {article?.media_type === "video" ? (
              <video
                src={`https://wowfy.in/testusr/images/${article?.image_url}`}
                poster={`https://wowfy.in/testusr/images/${article?.image_url.replace(
                  ".mp4",
                  ".jpg"
                )}`}
                className={cn(
                  "w-full h-full object-cover max-md:rounded-md cursor-pointer"
                )}
                controls
                controlsList="nodownload noplaybackrate nofullscreen"
                disablePictureInPicture
                autoPlay
                muted
                loop
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={`https://wowfy.in/testusr/images/${article?.image_url}`}
                alt={article?.title}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            )}
          </div>

          <div className="text-xs text-slate-500">{formatDate(article?.created_at)}</div>

          <div className="flex items-center space-x-8 w-fit my-6">
            <div className="text-gray-500 cursor-pointer relative group">
              <FaShareAlt size={16} />
              <div className="hidden group-hover:flex gap-2 absolute -top-10 left-0 bg-white border shadow-lg rounded-md p-2 z-50">
                <FacebookShareButton
                  url={`https://www.doutya.com/news/${id}`}
                  quote={article?.title}
                  onClick={() =>
                    trackAction(
                      "share_facebook",
                      article?.id
                    )
                  }
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://www.doutya.com/news/${id}`}
                  title={article?.title}
                  onClick={() =>
                    trackAction(
                      "share_twitter",
                      article?.id
                    )
                  }
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={`https://www.doutya.com/news/${id}`}
                  title={article?.title}
                  onClick={() =>
                    trackAction(
                      "share_whatsapp",
                      article?.id
                    )
                  }
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <TelegramShareButton
                  url={`https://www.doutya.com/news/${id}`}
                  title={article?.title}
                  onClick={() =>
                    trackAction(
                      "share_telegram",
                      article?.id
                    )
                  }
                >
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
            {article?.description?.split("\n\n").map((para, index) => (
              <p key={index} className="text-justify">
                {para}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-200 via-white to-red-100 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">{error}</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-200 via-white to-red-100 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Article not found. Please try another one!
        </h2>
      </div>
    );
  }

  return (
    <>
      <style jsx global>
        {`
          video::-webkit-media-controls-timeline {
            display: none !important;
          }
        `}
      </style>
      <div className="min-h-screen px-4 bg-gray-50 mb-14">
        <div className=" mx-auto">
          {/* Desktop Layout with Navigation Buttons */}
          <div className="hidden md:grid md:grid-cols-[200px_1fr_200px] gap-6 items-start">
            {/* Left Navigation */}
            <div className="sticky top-1/2 -translate-y-1/2">
              <PerspectiveNavigation
                currentArticleIndex={currentArticleIndex}
                allArticles={allArticles}
                handleViewpointChange={handleViewpointChange}
                router={router}
                nextArticle={nextArticle}
                previousArticle={previousArticle}
                position="left"
              />
            </div>

            {/* Main Content */}
            <div className="bg-white shadow-md rounded-md border border-slate-200">
              <div className="grid grid-cols-1 gap-2 md:gap-5 relative">
                {newsContent()}
              </div>
            </div>

            {/* Right Navigation */}
            <div className="sticky top-1/2 -translate-y-1/2">
              <PerspectiveNavigation
                currentArticleIndex={currentArticleIndex}
                allArticles={allArticles}
                handleViewpointChange={handleViewpointChange}
                router={router}
                nextArticle={nextArticle}
                previousArticle={previousArticle}
                position="right"
              />
            </div>
          </div>

          {/* Mobile Layout with Overlay Navigation */}
          <div className="md:hidden">
            <div className="bg-white shadow-md rounded-md border border-slate-200">
              <div className="grid grid-cols-1 gap-2 relative">
                <PerspectiveNavigation
                  currentArticleIndex={currentArticleIndex}
                  allArticles={allArticles}
                  handleViewpointChange={handleViewpointChange}
                  router={router}
                  nextArticle={nextArticle}
                  previousArticle={previousArticle}
                  position="overlay"
                />
                {newsContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Add Viewpoint Modal */}
        <AddViewpointModal
          isOpen={showAddViewpointModal}
          onClose={() => setShowAddViewpointModal(false)}
          newsId={id}
          currentCount={userNewsCount}
          onSuccess={handleViewpointSuccess}
        />

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
    </>
  );
}