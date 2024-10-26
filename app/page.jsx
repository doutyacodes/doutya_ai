"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Navbar from "./_components/Navbar";
import GlobalApi from "./api/_services/GlobalApi";
import { Toaster, toast } from "react-hot-toast";
import LoadingSpinner from "./_components/LoadingSpinner";

export default function Home() {
  const [courseName, setCourseName] = useState("");
  const [language, setLanguage] = useState("english");
  const [difficulty, setDifficulty] = useState("basic");
  const [error, setError] = useState("");
  const [latestCourse, setLatestCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!courseName) {
      setError("Course name is required.");
      toast.error("Course name is required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await GlobalApi.SearchUser({
        courseName,
        language,
        difficulty,
      });

      console.log("API Response:", response.data); // Log API response to verify its structure

      // Check if response contains the necessary data and update latestCourse
      const newCourse = response?.data?.parsedData || {}; // Use fallback empty object if data is undefined
      setLatestCourse(newCourse);

      if (newCourse) {
        toast.success("Course created successfully!");
      } else {
        toast.error("No course data found.");
      }

      // Reset form inputs
      setCourseName("");
      setLanguage("english");
      setDifficulty("basic");
    } catch (err) {
      console.error("Error fetching course:", err); // Log the error for debugging
      toast.error(
        "Error: " + (err?.message || "An unexpected error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1e5f9f] via-[#40cb9f] to-[#1e5f9f] text-gray-800 p-5 pt-20">
      <Navbar />
      <Toaster />

      {!latestCourse && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Learn Anything, Anytime, Your Way
            </h1>
            <p className="text-lg text-gray-200 max-w-lg mx-auto">
              Customized courses, adaptive learning, and flexible schedules
              crafted by you for your unique journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center space-y-4 bg-white shadow-lg rounded-lg w-full max-w-4xl p-6"
          >
            <form onSubmit={handleSearch} className="w-full">
              <div className="w-full text-center mb-4">
                <h2 className="text-lg font-semibold mb-2">
                  I want to take a course on
                </h2>
                <Input
                  type="text"
                  placeholder="Type the course name here"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2 focus-visible:ring-transparent border border-gray-300 rounded-lg"
                />
              </div>

              <div className="w-full text-center mb-4">
                <h2 className="text-lg font-semibold mb-2">Language</h2>
                <Select onValueChange={setLanguage} value={language}>
                  <SelectTrigger className="w-full border focus-visible:ring-transparent border-gray-300 rounded-lg p-2">
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="english">English</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full text-center mb-4">
                <h2 className="text-lg font-semibold mb-2">Difficulty</h2>
                <Select onValueChange={setDifficulty} value={difficulty}>
                  <SelectTrigger className="w-full border focus-visible:ring-transparent border-gray-300 rounded-lg p-2">
                    <SelectValue placeholder="Basic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <button
                type="submit"
                className="bg-[#1e5f9f] hover:bg-[#40cb9f] text-white font-bold py-2 px-4 rounded-lg transition-all w-full"
              >
                Search
              </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </motion.div>
        </>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center space-y-4 bg-white shadow-lg rounded-lg w-full max-w-4xl p-6"
      >
        {latestCourse && (
          <div className="mt-6 w-full text-left">
            <h3 className="text-2xl font-semibold mb-4">
              Latest Course Details
            </h3>

            <div className="mb-4">
              <p>
                <strong>Course Name:</strong> {latestCourse.courseName || "N/A"}
              </p>
              <p>
                <strong>Language:</strong> {latestCourse.language || "N/A"}
              </p>
              <p>
                <strong>Difficulty:</strong> {latestCourse.difficulty || "N/A"}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Overview</h4>
              <p className="text-gray-700">
                {latestCourse.chapterContent?.overview || "N/A"}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Key Concepts</h4>
              <p className="text-gray-700">
                {latestCourse.chapterContent?.key_concepts || "N/A"}
              </p>
            </div>

            {latestCourse.chapterContent?.detailed_concepts && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">
                  Detailed Concepts
                </h4>
                {Object.values(
                  latestCourse.chapterContent.detailed_concepts
                ).map((concept, index) => (
                  <div key={index} className="ml-4 mb-2">
                    <h5 className="text-lg font-semibold">{concept.title}</h5>
                    <p className="text-gray-700">{concept.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">
                Practical Applications
              </h4>
              <p className="text-gray-700">
                {latestCourse.chapterContent?.practical_applications || "N/A"}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Conclusion</h4>
              <p className="text-gray-700">
                {latestCourse.chapterContent?.conclusion || "N/A"}
              </p>
            </div>

            {latestCourse.chapterContent?.references_and_resources && (
              <div>
                <h4 className="text-xl font-semibold mb-2">
                  References and Resources
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {latestCourse.chapterContent.references_and_resources.map(
                    (reference, index) => (
                      <li key={index}>{reference}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
