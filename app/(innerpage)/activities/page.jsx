"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ChildSelector from "@/app/_components/ChildSelecter";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [type, setType] = useState("story");
  const [sortBy, setSortBy] = useState("latest");
  const { selectedChildId } = useChildren();
  const router = useRouter();

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await GlobalApi.FetchCourses({
        childId: selectedChildId ? selectedChildId : null,
        page,
        limit: 12,
        type,
        sortBy,
      });
      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to load topics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [selectedChildId, page, type, sortBy]);

  return (
    <div className="w-full h-full p-8 min-h-screen flex flex-col items-center">
      <motion.h1
        className="text-3xl font-bold mb-6 text-orange-700 uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Activity of the week
      </motion.h1>

      
    </div>
  );
};

export default CourseList;
