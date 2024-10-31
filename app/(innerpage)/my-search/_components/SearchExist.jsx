"use client";
import React, { useCallback, useEffect, useState } from "react";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import Navbar from "@/app/_components/Navbar";
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

  const fetchCourse = async ()=>{
    if (selectedChildId) {
      setLoading(true);
      try {
        const response = await GlobalApi.FetchCourses({
          childId: selectedChildId,
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
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [selectedChildId, page, type, sortBy]);

  return (
    <div className="w-full h-full p-8 min-h-screen flex flex-col items-center">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-blue-700" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        Topics
      </motion.h1>

      <div className="w-full flex justify-end items-center my-4 max-w-3xl">
              <ChildSelector />
            </div>

      <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Filter by Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="story">Story</option>
            <option value="poem">Poem</option>
            <option value="bedtime story">Bedtime Story</option>
            <option value="podcast">Podcast</option>
            <option value="explanation">Explanation</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xl text-white h-[50vh] flex justify-center items-center"
        >
          <AiOutlineLoading3Quarters className="animate-spin text-5xl mx-auto" />
          Loading...
        </motion.div>
      ) : courses.length === 0 ? (
        <motion.p
          className="text-center text-gray-700 mt-16 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No topics available for this selection.
          <br />
          <span className="text-white/70 text-sm font-light">Please try another filter or type.</span>
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push(`/topic/${course.slug}`)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-600">{course.name}</h2>
                <p className="text-gray-600 mt-2">{course.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-10 w-full max-w-2xl">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
          } transition-colors duration-300`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
          } transition-colors duration-300`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseList;
