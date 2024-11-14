"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import Link from "next/link";
import { useChildren } from "@/context/CreateContext";
import useAuth from "@/app/hooks/useAuth";

const Learn = () => {
  const [learnData, setLearnData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedChildId, selectedAge } = useChildren();
  const { isAuthenticated } = useAuth();

  const LoadData = async () => {
    try {
      const response = await GlobalApi.GetLearnTopics({
        age: selectedAge ? selectedAge : null,
      });
      setLearnData(response.data.data);
      console.log("response", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    LoadData();
  }, [selectedAge]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-hidden bg-gradient-to-b from-orange-100 via-white to-orange-50 min-h-screen p-4 space-y-8">
      <motion.div
        className="flex items-center justify-center flex-col gap-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h4 className="text-center font-bold text-2xl underline-offset-2 underline uppercase text-orange-700">
          Lesson of the Week
        </h4>
        <Image src="/images/space.png" width={250} height={250} alt="space" />
      </motion.div>

      <div>
        <p className="text-orange-600 uppercase text-center font-semibold">
          Complete all below topics to earn this cool badge & A certificate of
          completion
        </p>
      </div>
      <h4 className="text-center font-bold text-2xl my-3 uppercase text-orange-700">
        Chapters
      </h4>
      <div className="flex justify-center">
        <p className="text-orange-600 uppercase text-center font-semibold mb-3 max-w-3xl">
          Each chapter contains a brief explanation, an activity and a test.You
          will need to complete all the activities and pass the tests, inorder
          to earn the badge.
        </p>
      </div>
      <div className="grid  grid-cols-2 gap-5">
        {learnData?.length > 0 &&
          learnData.map((item, index) => {
            if(
              item.title=="Stars"
            ){
              return;
            }else{return (
              <motion.div
                className="flex items-center justify-center flex-col gap-3 p-4 bg-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.1, // Staggered effect
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isAuthenticated ? (
                    <Link href={`learn/${item.slug}`}>
                      <Image
                        src={`/images/${item.image}`}
                        width={100}
                        height={100}
                        alt={item.title}
                        className="rounded-lg shadow-md"
                      />
                    </Link>
                  ) : (
                    <Link href={`/login`}>
                      <Image
                        src={`/images/${item.image}`}
                        width={100}
                        height={100}
                        alt={item.title}
                        className="rounded-lg shadow-md"
                      />
                    </Link>
                  )}
                </motion.div>
                <h4 className="text-center font-bold text-lg uppercase text-orange-700">
                  {item.title}
                </h4>
              </motion.div>
            )}
          })}
      </div>
    </div>
  );
};

export default Learn;
