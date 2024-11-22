"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for navigation
import { motion } from "framer-motion";
import { useChildren } from "@/context/CreateContext";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";



const Challenges = () => {
  const { selectedAge, selectedChildId } = useChildren();
  const [challengesData, setChallengesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const response = await GlobalApi.FetchChallenges({
        age: selectedAge,
        childId: selectedChildId,
      });
      setChallengesData(response.data.challenges);
    //   console.log(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedAge]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Ensures two digits for day
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensures two digits for month
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Axara Added Challenges
        </h1>
      </div>

      {/* Challenges Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {challengesData.length > 0 && challengesData.map((challenge, index) => (
          <Link href={`/challenges/${challenge.slug}`} key={challenge.id}>
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Title Section */}
              <div className="p-3 text-center font-medium">
                Axara Added a Challenge
              </div>

              {/* Image */}
              <motion.img
                src={challenge.image}
                alt={challenge.title}
                className="w-full h-40 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />

              {/* Title */}
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {challenge.title}
                </h2>
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-center bg-gray-50 px-4 py-3 text-sm text-gray-600">
                <span>📅 {formatDate(challenge.show_date)}</span>
                <span className="font-medium">
                  Entry Fee: {challenge.entry_type =="nill" ? "NILL" : challenge.entry_type =="points" ? challenge.entry_fee + " Points" : "₹"+challenge.entry_fee}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Challenges;
