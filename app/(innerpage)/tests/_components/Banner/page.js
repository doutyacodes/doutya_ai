"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useChildren } from "@/context/CreateContext";

function Banner({
  onToggleResults,
  showResults,
  onToggleQuiz2Results,
  showQuiz2Results,
  isTest2Completed,
  setIsTest2Completed,
}) {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const t = useTranslations("Banner");
  const { selectedChildId, selectedAge } = useChildren(); // Accessing selected child ID from context

  useEffect(() => {
    const getQuizData = async () => {
      setLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resp = await GlobalApi.GetDashboarCheck(selectedChildId);
        setDashboardData(resp.data);

        const test2 = resp.data.find((q) => q.quiz_id === 2);
        if (test2 && test2.isCompleted) setIsTest2Completed(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getQuizData();
  }, [setIsTest2Completed]);

  const getQuizStatus = (quizId) => {
    const quiz = dashboardData.find((q) => q.quiz_id === quizId);
    return quiz ? { isCompleted: quiz.isCompleted } : { isCompleted: false };
  };

  const isTest1Completed = getQuizStatus(1).isCompleted;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-orange-600">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl mx-auto" />
      </div>
    );
  }

  const renderTestCard = (quizId, gradient, titleKey, descriptionKey, route) => {
    const isCompleted = getQuizStatus(quizId).isCompleted;
    return (
      <motion.div
        className="pt-3 p-[1px] rounded-lg w-full md:w-[400px]"
        style={{ backgroundImage: `linear-gradient(to right, ${gradient})` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-center text-gray-700 text-md pb-2 uppercase">
          {t("followCareer")}
        </h3>
        <div className="bg-orange-50 rounded-lg p-3 flex flex-col justify-between shadow-md">
          <h3 className="font-semibold text-2xl text-center py-3 text-orange-800">
            {t(titleKey)}
          </h3>
          <div className="bg-gray-300 p-[1px]" />
          <p className="text-gray-700 text-justify text-md p-4">
            {t(descriptionKey)}
          </p>
          <div className="flex justify-center items-center p-4 mt-auto">
            <Link
              href={route}
              className={`hover:cursor-pointer p-3 rounded-full w-40 ${
                isCompleted
                  ? "opacity-50 cursor-not-allowed bg-orange-300"
                  : "bg-gradient-to-r from-orange-300 to-yellow-400 hover:scale-105 transition-transform duration-200"
              }`}
            >
              <p className="text-white font-semibold text-lg text-center">
                {t("takeTest")}
              </p>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-md:pb-14 bg-gradient-to-r from-orange-100 via-white to-orange-50 min-h-screen">
      <motion.div
        className="w-full py-8 md:text-3xl text-xl font-semibold text-orange-800 text-center "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {t("careerAssesment")}
      </motion.div>
      <div className="p-4">
        <div className="mt-8 md:flex hidden md:flex-row justify-evenly gap-10 w-full">
          {!isTest1Completed &&
            renderTestCard(1, "#FFA500, #FFCC80", "findStrength", "personalityTestDescription", "/quiz-section/1")}
          {renderTestCard(2, "#FF7043, #FFB74D", "followCareer", "interestTestDescription", "/CareerQuizSection/2")}
        </div>

        <div className="mt-8 md:hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="pb-12"
          >
            {!isTest1Completed && (
              <SwiperSlide>{renderTestCard(1, "#FFA500, #FFCC80", "findStrength", "personalityTestDescription", "/quiz-section/1")}</SwiperSlide>
            )}
            <SwiperSlide>
              {renderTestCard(2, "#FF7043, #FFB74D", "followCareer", "interestTestDescription", "/CareerQuizSection/2")}
            </SwiperSlide>
          </Swiper>

          <div className="flex justify-center space-x-2 gap-2 mt-4 mb-16">
            {[0, 1].map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full cursor-pointer ${
                  activeIndex === index ? "bg-orange-400" : "bg-gray-400"
                }`}
                onClick={() => swiperRef.current?.slideTo(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
