import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import { FaEllipsisH, FaShareAlt } from "react-icons/fa";
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

const formatDate = (date) => {
  const inputDate = moment(date);
  return inputDate.fromNow();
};

const truncateTitle = (title, length = 40) =>
  title.length > length ? `${title.slice(0, length)}...` : title;

const NewsData = ({ article, setShowId, setShowNews, getCategoryNameById }) => {
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [report_text, setReport_text] = useState("")

  const shareUrl = `https://www.axara.co/news/${article.category.toLowerCase()}/${
    article.id
  }`;
  const title = article.title;

  const handleReport = async() => {
   
    try {
        const response = await GlobalApi.ReportNews({
            news_id: article.id,
            report_text
        })
        // console.log(response.data)
        if (response?.data) {
            toast.success("News reported successfully.");
          }
          setReport_text("")
    } catch (error) {
        console.log(error)
        toast.error("Failed to report the news.Please try again")
    }finally{
        setShowReportPopup(false);

    }
  };

  return (
    <div
      //   whileTap={{ scale: 0.95 }}
      className="bg-white shadow-md cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col p-1"
    >
      {/* Image with Date at the Top */}
      <div className="relative h-48 w-full">
        <Image
          src={`https://wowfy.in/testusr/images/${article.image_url}`}
          alt={article.title}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          onClick={() => {
            setShowId(article.id);
            setShowNews(true);
          }}
        />
        {/* Date at the top */}
        <span className="absolute top-2 left-2 text-white text-xs font-medium bg-black bg-opacity-60 px-2 py-1 rounded-md">
          {formatDate(article.created_at)}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title */}
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {truncateTitle(article.title)}
        </h3>

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
          <div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-xs font-medium text-orange-500 px-4 py-2 relative"
            >
              {getCategoryNameById(article.news_category_id)}
            </motion.div>
          </div>
        </div>
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
                Reporting will send this content for review. This action cannot
                be undone.
              </p>

              {/* Optional Textarea */}
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Optional: Provide additional information about your report..."
                value={report_text}
                onChange={(e)=>setReport_text(e.target.value)}
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
};

export default NewsData;