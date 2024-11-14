"use client";
import { motion } from "framer-motion";
import { CircleArrowDown } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { useParams } from "next/navigation";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { useChildren } from "@/context/CreateContext";
import toast from "react-hot-toast";

const Page = () => {
  const params = useParams();
  const { id } = params;
  const certificateRef = useRef(null);

  const { selectedChildId,selectedChild } = useChildren();
  const [isLoading, setLoading] = useState(true);
  const [badgeData, setBadgeData] = useState(null);

  // Fetch badge data on component mount
  useEffect(() => {
    const fetchBadgeData = async () => {
      setLoading(true);
      try {
        const response = await GlobalApi.getSingleBadge({ badgeId: id, childId: selectedChildId });
        setBadgeData(response.data.badge);
        console.log(response.data.badge);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching badge data:", error);
        toast.error("Failed to fetch badge data.");
        setLoading(false);
      }
    };

    fetchBadgeData();
  }, [id, selectedChildId]);

  const handleDownload = async () => {
    if (certificateRef.current === null) return;

    try {
      // Hide the download button temporarily
      const button = certificateRef.current.querySelector("button");
      button.style.display = "none";

      // Convert the component to PNG format
      const dataUrl = await toPng(certificateRef.current);

      // Trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "certificate.png";
      link.click();

      // Re-show the button
      button.style.display = "block";
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If badge is not earned, display blurred effect with message
  const isBadgeCompleted = badgeData && badgeData.completed;
  function formatDateToDDMMYYYY(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return (
    <div className=" w-full min-h-screen p-3 flex justify-center items-center">
      <div
        ref={certificateRef}
        className="w-full h-full p-3 bg-[#ffefca] rounded-md max-w-sm relative"
      >
        <motion.div
          className="flex items-center justify-center flex-col gap-2 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src={`/images/image1.png`}
            width={250}
            height={250}
            alt={"badge image"}
            className={`mb-2 ${isBadgeCompleted ? '' : 'blur-sm'}`}
          />

          <div className="text-center text-lg w-[240px]">
            {isBadgeCompleted ? (
              <>
                This badge was awarded to{" "}
                <span className="underline font-bold">{selectedChild.name}</span>, for
                successfully completing{" "}
                <span className="font-bold">{badgeData.condition}</span> on Doutya Kids, on {formatDateToDDMMYYYY(badgeData.earned_at)}
                <span className="font-bold">{badgeData.completionDate}</span>
              </>
            ) : (
              <>
                <span className="underline font-bold">Task Incomplete</span> - complete the task to earn this badge!
              </>
            )}
          </div>
          <div className="flex items-center justify-center">
            <Image
              src={"/images/logo.png"}
              width={150}
              height={150}
              alt="logo"
            />
          </div>
          {isBadgeCompleted && (
            <button
              onClick={handleDownload}
              className="w-fit absolute bottom-4 right-4"
            >
              <CircleArrowDown />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
