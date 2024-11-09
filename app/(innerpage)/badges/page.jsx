"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { useChildren } from "@/context/CreateContext";
import toast from "react-hot-toast";

const Badges = () => {
  const [badgesData, setBadgesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedChildId } = useChildren();

  const loadBadgesData = async () => {
    try {
      const response = await GlobalApi.getChildBadges({
        childId: selectedChildId,
      });
      setBadgesData(response.data.badges);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBadgesData();
  }, [selectedChildId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Group badges by type
  const groupedBadges = {
    search: badgesData?.filter((badge) => badge.badge_type === "search"),
    knowledge: badgesData?.filter((badge) => badge.badge_type === "quiz"),
    achievement: badgesData?.filter(
      (badge) => badge.badge_type === "achievement"
    ),
  };

  return (
    <div className=" bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen p-3 space-y-7">
      <motion.div
        className="flex items-center justify-center flex-col gap-7"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h4 className="text-center font-bold text-2xl underline-offset-1 underline text-gray-900">
          Badge
        </h4>
      </motion.div>

      <div>
        <p className="text-gray-800 uppercase text-center font-semibold">
          Earn this cool badge by completing all the challenges below!
        </p>
      </div>

      {/* Render each badge group */}
      {Object.entries(groupedBadges).map(
        ([type, badges]) =>
          badges.length > 0 && (
            <div key={type} className="space-y-5">
              <h5 className="text-gray-900 text-xl font-semibold uppercase text-center">
                {type === "search"
                  ? "Search Badges"
                  : type === "knowledge"
                  ? "Knowledge Badges"
                  : "Achievement Badges"}
              </h5>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
                {badges.map((badge, index) => (
                  <motion.div
                    className="flex items-center justify-center flex-col gap-3"
                    key={badge.id}
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
                      {badge.completed ? (
                        <Link href={`/badges/${badge.id}`}>
                          <Image
                            src={`/images/${
                              badge.image || "default-badge.png"
                            }`}
                            width={130}
                            height={130}
                            alt={badge.title}
                            className="rounded-xl border-2 border-transparent hover:border-[#7824f6] transition-all"
                          />
                        </Link>
                      ) : (
                        <button
                          onClick={() =>
                            toast.error(
                              "You need to finish the task to earn the badge"
                            )
                          }
                        >
                          <Image
                            src={`/images/${
                              badge.image || "default-badge.png"
                            }`}
                            width={130}
                            height={130}
                            alt={badge.title}
                            className="rounded-xl border-2 border-transparent hover:border-[#7824f6] transition-all"
                          />
                        </button>
                      )}
                    </motion.div>
                    <h4 className="text-center font-bold text-lg uppercase text-gray-900">
                      {badge.title}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Badges;
