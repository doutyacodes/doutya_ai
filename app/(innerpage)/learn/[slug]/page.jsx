"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import useAuth from "@/app/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LearnPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("Explanation");
  const [learnData, setLearnData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch learn topic data on component mount
  useEffect(() => {
    const fetchLearnTopicsData = async () => {
      setLoading(true);

      try {
        const response = await GlobalApi.GetLearnTopicsData({ slug });
        setLearnData(response.data);
      } catch (error) {
        console.error("Error fetching learn topics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnTopicsData();
  }, [slug]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleTestClick = () => {
    if (!isAuthenticated) {
      toast("You must login to continue");
      return router.replace("/login");
    }

    if (learnData.status === "completed") {
      toast.success("You have already finished this test");
      return router.replace("/login");
    }

    if (learnData.status === "incomplete" || learnData.status === "continue") {
      return router.push(`/learn/quiz-section/${slug}`);
    }
  };

  return (
    <div className="w-screen overflow-hidden bg-[#0f6574] min-h-screen p-3 space-y-7">
      <motion.div
        className="flex items-center justify-center flex-col gap-7"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image src={`/images/${learnData.topic[0]?.image}`} width={250} height={250} alt="space" />
        <h4 className="text-center font-bold text-2xl uppercase text-white">
          {learnData.topic[0]?.title}
        </h4>
      </motion.div>

      <div className="flex justify-center gap-8 bg-[#0d4957] p-4 rounded-md">
        {["Explanation", "Tests", "Activities"].map((tab) => (
          <button
            key={tab}
            className={`text-white font-semibold ${
              activeTab === tab ? "border-b-2 border-white" : "opacity-70"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 bg-[#e0f7fa] rounded-md min-h-[300px]">
        {activeTab === "Explanation" && (
          <p className="text-center text-lg text-[#0f6574]">
            {learnData.learnData[0]?.explanation}
          </p>
        )}

        {activeTab === "Tests" && (
          <div>
            <h5 className="text-center font-semibold text-lg text-[#0f6574]">Quizzes</h5>
            <motion.div
              onClick={handleTestClick}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="w-full p-4 bg-white shadow-md rounded-lg text-center mt-6 text-xl cursor-pointer"
            >
              {learnData.status === "incomplete"
                ? "Start the test"
                : learnData.status === "continue"
                ? "Continue"
                : "Finished"}
            </motion.div>
          </div>
        )}

        {activeTab === "Activities" && (
          <div>
            <h5 className="text-center font-semibold text-lg text-[#0f6574]">Activities</h5>
            <h6 className="text-center text-lg text-[#0f6574]">
              {learnData.learnData[0]?.activity_title}
            </h6>
            <p className="text-lg text-[#0f6574]">
              {learnData.learnData[0]?.activity_steps}
            </p>
            <h6 className="text-center text-lg text-[#0f6574]">Materials Needed:</h6>
            <ul className="list-disc pl-8 text-[#0f6574]">
              {learnData.learnData[0]?.activity_materials?.materials?.map((material, index) => (
                <li key={index} className="text-lg">{material}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
