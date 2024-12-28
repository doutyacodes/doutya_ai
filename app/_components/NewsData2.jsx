import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import { FaEllipsisH, FaShareAlt, FaStar } from "react-icons/fa";
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
import GlobalApi from "../api/_services/GlobalApi";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { FiCopy } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useChildren } from "@/context/CreateContext";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { DateTime } from "luxon";
import Head from "next/head";
import { GrFormView } from "react-icons/gr";
import { useSwipeable } from "react-swipeable"; // Add this import at the top


// Define viewpoint colors with both background and text variants
// const viewpointColors = {
//   0: { bg: "bg-indigo-600", text: "text-indigo-600" },
//   1: { bg: "bg-emerald-600", text: "text-emerald-600" },
//   2: { bg: "bg-purple-600", text: "text-purple-600" },
//   3: { bg: "bg-blue-600", text: "text-blue-600" },
//   4: { bg: "bg-teal-600", text: "text-teal-600" },
//   5: { bg: "bg-rose-600", text: "text-rose-600" },
//   6: { bg: "bg-cyan-600", text: "text-cyan-600" }
// };

const viewpointColors2 = {
  0: { bg: "bg-[#2A1721]", text: "text-[#2A1721]" },
  1: { bg: "bg-[#151C2E]", text: "text-[#151C2E]" },
  2: { bg: "bg-[#102828]", text: "text-[#102828]" },
  3: { bg: "bg-[#261F37]", text: "text-[#261F37]" },
  4: { bg: "bg-[#2D2923]", text: "text-[#2D2923]" },
  5: { bg: "bg-[#2F3E46]", text: "text-[#1C2B30]" },
};

// const viewpointColors = {
//   0: { bg: "bg-[#8B0000]", text: "text-[#8B0000]" },
//   1: { bg: "bg-[#00008B]", text: "text-[#00008B]" },
//   2: { bg: "bg-[#006400]", text: "text-[#006400]" },
//   3: { bg: "bg-[#4B0082]", text: "text-[#4B0082]" },
//   4: { bg: "bg-[#8B4513]", text: "text-[#8B4513]" },
//   5: { bg: "bg-[#2F4F4F]", text: "text-[#2F4F4F]" },
// };

const viewpointColors = {
  0: { bg: "bg-[#FF4500]", text: "text-[#FF4500]" }, // Orange-Red
  1: { bg: "bg-[#DC143C]", text: "text-[#DC143C]" }, // Crimson (Red)
  2: { bg: "bg-[#4682B4]", text: "text-[#4682B4]" }, // Steel Blue
  3: { bg: "bg-[#00bf62]", text: "text-[#00bf62]" },
  4: { bg: "bg-[#FF8C00]", text: "text-[#FF8C00]" }, // Dark Orange
  5: { bg: "bg-[#FF6347]", text: "text-[#FF6347]" }, // Tomato (Red-Orange)
};

const truncateDescription = (description, length) =>
  description.length > length
    ? `${description.slice(0, length)}...`
    : description;

// const formatDate = (date) => {
//   const inputDate = moment(date);
//   return inputDate.fromNow();
// };

const formatDate2 = (date, regionId) => {
  // Determine the timezone based on regionId
  // console.log(regionId);
  const timeZone =
    regionId && regionId === "United States"
      ? "America/New_York"
      : "Asia/Kolkata";

  // Parse the date and set the desired timezone
  const dateTime = DateTime.fromISO(date).setZone(timeZone);

  // Format the date as "Tuesday 17 Dec, 2024, 11:20 am"
  return dateTime.toFormat("cccc dd LLL, yyyy, hh:mm a");
};

const truncateTitle = (title, length = 80) =>
  title.length > length ? `${title.slice(0, length)}...` : title;

const NewsData2 = ({
  article,
  setShowId,
  setShowNews,
  setShowNames,
  size = false,
  regionId,
  allArticles,
}) => {
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [report_text, setReport_text] = useState("");
  const router = useRouter();
  console.log("allArticles", allArticles);
  const { selectedRegion } = useChildren();
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the title index
  const shareUrl = `https://www.axaranews.com/viewpoint/${article.id}`;
  const title = article.title;
  const isBelowMd = useMediaQuery({ query: "(max-width: 768px)" });
  const [isPaused, setIsPaused] = useState(false);

   // Get color variants for viewpoint based on index
   const getViewpointColor = (index, type = 'bg') => {
      const colorSet = viewpointColors[index % Object.keys(viewpointColors).length];
      return type === 'bg' ? colorSet.bg : colorSet.text;
    };

  // Set truncate length based on screen size
  const descriptionLength = isBelowMd ? 250 : 300; // Use 100 below `md`, otherwise 200
  const handleReport = async () => {
    try {
      const response = await GlobalApi.ReportNews({
        news_id: article.id,
        report_text,
      });
      // console.log(response.data)
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

  const categoriesList = (data) => {
    if (!data) return null; // Handle cases where data is null or undefined
    const categoryNames = data;
    const result = categoryNames.split(",");

    return (
      <>
        {result.map((item, index) => (
          <div
            key={index} // Always add a unique key when rendering lists
            className="  text-[7.9px] text-white text-xs font-medium bg-black/60  px-2 py-[2px] rounded-md"
          >
            {item.trim()} {/* Remove extra spaces */}
          </div>
        ))}
      </>
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard!"); // Optional success toast
      })
      .catch((err) => {
        // toast.error('Failed to copy link.'); // Optional error toast
        console.log(err); // Optional error toast
      });
  };

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % allArticles.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [allArticles.length, isPaused]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % allArticles.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [allArticles.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prevIndex) => (prevIndex + 1) % allArticles.length), // Go to next article
    onSwipedRight: () => setCurrentIndex((prevIndex) => (prevIndex - 1 + allArticles.length) % allArticles.length), // Go to previous article
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <>
      <Head>
        {/* Essential Meta Tags */}
        <title>{article.title}</title>
        <meta name="description" content={article.description} />

        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta
          property="og:image"
          content={`https://wowfy.in/testusr/images/${article.image_url}`}
        />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Axara News" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        <meta
          name="twitter:image"
          content={`https://wowfy.in/testusr/images/${article.image_url}`}
        />

        {/* WhatsApp Preview Tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <div
      {...handlers} 
        //   whileTap={{ scale: 0.95 }}
        className={cn(
          "bg-[#f5f5f5] shadow-md cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col p-1 ",
          size &&
            "max-w-7xl mx-auto w-full md:flex-row md:gap-6 max-md:min-h-[40vh] md:p-5"
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Image with Date at the Top */}
        <p className="text-[10px] md:text-xs text-black text-nowrap font-medium bg-opacity-80 py-2 rounded-md">
          <span className="flex gap-[3px] items-center overflow-x-auto w-full">
            <span className="font-bold"> Perspectives of </span>:{" "}
            {article.viewpoints.replace(/,/g, ", ")}
          </span>
        </p>

        <div
          className={cn(
            "relative  w-full",
            !size ? "h-48" : "h-48 md:h-80  md:w-2/4"
          )}
        >
          <Image
            src={`https://wowfy.in/testusr/images/${article.image_url}`}
            alt={article.title}
            width={size ? 1000 : 400}
            height={size ? 500 : 300}
            className={cn(
              "w-full h-full object-cover  max-md:rounded-md",
              size && "md:rounded-lg"
            )}
            // onClick={() => {
            //   setShowId(article.id);
            //   setShowNames(article.categoryNames);
            //   setShowNews(true);
            // }}
            onClick={() => {
              router.push(`/viewpoint/${article.id}`);
            }}
          />
          {/* Date at the top */}
          {/* <span className="absolute top-2 left-2 text-white text-xs flex items-center font-medium bg-black bg-opacity-60 px-2 py-1 rounded-md">
            <GrFormView size={18} />
            {allArticles[currentIndex]?.viewpoint || article.viewpoint} Viewpoint
          </span> */}
          {/* <span className="absolute top-2 left-2 text-white text-xs flex items-center font-medium bg-orange-500  px-2 py-1 rounded-md">
            <GrFormView size={18} />
            {allArticles[currentIndex]?.viewpoint || article.viewpoint}{" "}
            Viewpoint
          </span> */}

          {/* Viewpoint label above image - with background color */}
          <span className={cn(
            "absolute top-2 left-2 text-white text-xs flex items-center font-medium px-2 py-1 rounded-md",
            getViewpointColor(currentIndex, 'bg')  + " bg-opacity-90"
          )}>
            <GrFormView size={18} />
            {allArticles[currentIndex]?.viewpoint || article.viewpoint} Viewpoint
          </span>

          <span className="absolute bottom-2 left-2 flex gap-[3px] items-center ">
            {categoriesList(article.categoryNames)}
          </span>
          {size && (
            <span className="absolute top-2 right-2 max-md:flex hidden bg-black/60 gap-[3px] items-center p-2 rounded-full ">
              <FaStar color="gold" />
            </span>
          )}
        </div>

        <div className={cn("", size && "md:w-2/4 ")}>
          {/* Content Area */}
          <div
            className={cn(
              "flex flex-col flex-grow",
              !size ? " p-2" : "md:mb-3"
            )}
          >
            {/* Title */}
            {/* <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="scrollable-container"
            > */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="scrollable-container"
            >
              {/* <span className=" text-xs flex items-center font-semibold text-orange-500 ">
                <GrFormView size={18} />
                {allArticles[currentIndex]?.viewpoint || article.viewpoint}{" "}
                Viewpoint
              </span> */}
              <span className={cn(
                "text-xs flex items-center font-semibold",
                getViewpointColor(currentIndex, 'text')
              )}>
                <GrFormView size={18} className={getViewpointColor(currentIndex, 'text')} />
                {allArticles[currentIndex]?.viewpoint || article.viewpoint} Viewpoint
              </span>
              
              <h3
                // onClick={() => {
                //   setShowId(article.id);
                //   setShowNames(article.categoryNames);
                //   setShowNews(true);
                // }}
                onClick={() => {
                  router.push(`/viewpoint/${article.id}`);
                }}
                className={cn(
                  "text-lg font-medium text-gray-800 mb-2 cursor-pointer line-clamp-3",
                  size && "md:text-xl"
                )}
              >
                {allArticles[currentIndex]?.title || article.title}
              </h3>
            </motion.div>
            <div className="flex justify-center my-1 space-x-2">
              {allArticles.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition",
                    currentIndex === index
                      ? "bg-orange-500"
                      : "bg-gray-400 hover:bg-gray-600"
                  )}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>

            {/* Footer with Share and Report Options */}
            <div className="flex flex-row-reverse justify-between items-center mt-auto">
              <div className="flex items-center space-x-5">
                {/* Share Icon */}
                <div className="text-gray-500 cursor-pointer relative group">
                  <FaShareAlt size={16} />
                  {/* Share Options */}
                  <div className="hidden group-hover:flex gap-2 absolute -top-10 right-0 bg-white border shadow-lg rounded-md p-2 z-50">
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
                  onClick={() => {
                    setShowReportPopup(true);
                    console.log("Report popup triggered");
                  }}
                  className="text-gray-500 cursor-pointer rotate-90"
                >
                  <FaEllipsisH size={16} />
                </div>
              </div>
              <div className="flex flex-col gap-[1px]">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[8px] font-medium relative"
                >
                  {formatDate2(article.created_at, regionId)}
                  {/* {article.created_at} */}
                </motion.div>
                {/* {console.log("article", article)} */}
              </div>
            </div>
          </div>
          {size && (
            <Link
              href={`/news/${selectedRegion == "India" ? "in" : "us"}/${
                article.id
              }`}
              className="text-sm max-md:line-clamp-4 text-justify max-md:leading-5 text-gray-800 mb-2 max-md:mt-4 cursor-pointer max-md:text-xs  max-md:px-2 md:mt-6"
            >
              {article.description}
            </Link>
          )}
        </div>

        {/* Report Popup */}
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
                  Reporting will send this content for review. This action
                  cannot be undone.
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
    </>
  );
};

export default NewsData2;
