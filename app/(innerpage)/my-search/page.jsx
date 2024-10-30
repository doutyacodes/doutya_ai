"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import Navbar from "@/app/_components/Navbar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
        // toast.success("Courses loaded successfully!");
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
  }, [page, type, sortBy, selectedChildId]);

  return (
    <div className="w-full h-full p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Courses</h1>

      <div className="flex justify-between items-center mb-4">
        <label className="mr-4">
          Filter by Type:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="story">Story</option>
            <option value="poem">Poem</option>
          </select>
        </label>
        <label>
          Sort By:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xl"
        >
          <AiOutlineLoading3Quarters className="animate-spin text-4xl mx-auto text-blue-600" />
          Loading...
        </motion.div>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No data exists right now for this child.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push(`/topic/${course.slug}`)}
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold">{course.name}</h2>
                <p className="text-gray-600">{course.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-10">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseList;
