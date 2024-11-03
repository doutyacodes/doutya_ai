"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import Link from "next/link";
import { useChildren } from "@/context/CreateContext";

const Learn = () => {
  const [learnData, setLearnData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedChildId, selectedAge } = useChildren(); // Accessing selected child ID from context

  const LoadData = async () => {
    try {
      const response = await GlobalApi.GetLearnTopics({
        age: selectedAge? selectedAge : null,
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
    <div className="w-screen overflow-hidden bg-[#0f6574] min-h-screen p-3 space-y-7">
      <motion.div
        className="flex items-center justify-center flex-col gap-7"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h4 className="text-center font-bold text-2xl underline-offset-1 underline uppercase text-white">
          Badge of the Week
        </h4>
        <Image src="/images/space.png" width={250} height={250} alt="space" />
      </motion.div>

      <div>
        <p className="text-white uppercase text-center font-semibold">
          Complete all below topics to earn this cool badge & A certificate of
          completion
        </p>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-3 space-y-5">
        {learnData?.length > 0 &&
          learnData.map((item, index) => (
            <motion.div
              className="flex items-center justify-center flex-col gap-3"
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
                <Link href={`learn/${item.slug}`}>
                  <Image
                    src={`/images/${item.image}`}
                    width={130}
                    height={130}
                    alt={item.title}
                  />
                </Link>
              </motion.div>
              <h4 className="text-center font-bold text-lg uppercase text-white">
                {item.title}
              </h4>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Learn;
