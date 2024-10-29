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
import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";

export default function Home() {
  const [courseName, setCourseName] = useState("");
  const [language, setLanguage] = useState("english");
  const [difficulty, setDifficulty] = useState("basic");
  const [type, setType] = useState("story");
  const [age, setAge] = useState(""); // New state for age input
  const [error, setError] = useState("");
  const [latestCourse, setLatestCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // const validateForm = () => {
  //   if (!courseName || !age) {
  //     setError("Course name and age are required.");
  //     toast.error("Course name and age are required.");
  //     return false;
  //   }
  //   setError("");
  //   return true;
  // };

  const handleSearch = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    setLoading(true);

    try {
      const authToken = localStorage.getItem("authToken"); // Retrieve token from local storage
      const response = await GlobalApi.SearchUser(
        {
          courseName,
          language,
          difficulty,
          age,
          type,
        },
        authToken
      );

      console.log("API Response:", response.data.content); // Updated to match new JSON structure

      const newCourse = response?.data?.content || {};
      setLatestCourse(newCourse);

      if (newCourse && Object.keys(newCourse).length > 0) {
        toast.success("Course created successfully!");
      } else {
        toast.error("No course data found.");
      }

      setCourseName("");
      setLanguage("english");
      setDifficulty("basic");
      setType("story");
      setAge("");
    } catch (err) {
      console.error("Error fetching course:", err);
      toast.error(
        "Error: " + (err?.message || "An unexpected error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };
  const playContent = () => {
    // Implement the logic to play the content based on course type
    const content =
      latestCourse.type === "poem"
        ? latestCourse.verses.map((verse) => verse.line).join(" ")
        : latestCourse.body?.map((paragraph) => paragraph.content).join(" ") ||
          "";

    if (content) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = content;
      speech.lang = "en-US";
      speech.rate = 1;
      speech.pitch = 1.2;
      window.speechSynthesis.speak(speech);
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
            className="flex flex-col items-center space-y-4 rounded-lg w-full max-w-4xl p-6"
          >
            <form onSubmit={handleSearch} className="w-full ">
              <div className="w-full text-center mb-4">
                <h2 className="text-lg font-semibold mb-2 gap-2 items-center justify-center flex flex-wrap text-white">
                  I want{" "}
                  <Select onValueChange={setType} value={type} className="bg-transparent ring-transparent border border-transparent">
                    <SelectTrigger className="w-fit ring-transparent border border-transparent focus-visible:ring-transparent bg-transparent text-lg rounded-full p-2 text-white">
                      <SelectValue placeholder="Story" className="text-black" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="story">a Story</SelectItem>
                        <SelectItem value="Bedtime story">
                          a Bedtime Story
                        </SelectItem>
                        <SelectItem value="explanation">
                          an Explanation
                        </SelectItem>
                        {/* <SelectItem value="course">a Course</SelectItem> */}

                        {/* <SelectItem value="essay">an Essay</SelectItem> */}
                        <SelectItem value="informative story">
                          a Informative Story
                        </SelectItem>
                        <SelectItem value="poem">a Poem</SelectItem>
                        {/* {age != "" && age > 13 && (
                          <SelectItem value="presentation">
                            a Presentation
                          </SelectItem>
                        )} */}
                      </SelectGroup>
                    </SelectContent>
                  </Select>{" "}
                  on
                </h2>
                <Input
                  type="text"
                  placeholder="Type the course name here"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2 focus-visible:ring-transparent border border-gray-300 rounded-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="w-full text-center mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-white">Age</h2>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2 focus-visible:ring-transparent border border-gray-300 rounded-full"
                  />
                </div>

                <div className="w-full text-center mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-white">
                    Language
                  </h2>
                  <Select onValueChange={setLanguage} value={language}>
                    <SelectTrigger className="w-full border focus-visible:ring-transparent border-gray-300 rounded-full p-2">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="english">English</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* {age > 13 && (
                <div className="w-full text-center mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-white">
                    Difficulty
                  </h2>
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
              )} */}

              <button
                type="submit"
                className="bg-[#1e5f9f] hover:bg-[#40cb9f] text-white font-bold py-2 px-4 rounded-lg transition-all w-full"
              >
                Submit
              </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </motion.div>
        </>
      )}

      {latestCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center space-y-4 bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 relative"
        >
          <button
            onClick={() => setLatestCourse(null)}
            className="text-orange-400 w-full flex gap-4 items-center"
          >
            <IoChevronBackOutline /> Back
          </button>
          <div className="mt-6 w-full text-left">
            {/* <h3 className="text-2xl font-semibold mb-4">
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
              <p>
                <strong>Age:</strong> {latestCourse.age || "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {latestCourse.type || "N/A"}
              </p>
            </div> */}
            {latestCourse.type == "story" ||
            latestCourse.type == "explanation" ||
            latestCourse.type == "bedtime story" ||
            latestCourse.type == "informative story" ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  {latestCourse.title}
                </h2>
                <p className="text-gray-700 mb-8">
                  {latestCourse.introduction?.content ||
                    "Introduction data is unavailable."}
                </p>
                {latestCourse.body?.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4">
                    {paragraph.content}
                  </p>
                ))}
                <p className="text-gray-700">
                  {latestCourse.conclusion?.content ||
                    "Conclusion data is unavailable."}
                </p>
              </>
            ) : latestCourse.type == "poem" ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  {latestCourse.title}
                </h2>
                {latestCourse.verses?.map((verse, index) => (
                  <p key={index} className="text-gray-700 mb-2">
                    {verse.line}
                  </p>
                ))}
              </>
            ) : latestCourse.type === "presentation" ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  {latestCourse.presentation?.title || "Title is unavailable."}
                </h2>
                <div className="mb-8">
                  {latestCourse.presentation?.slides.map((slide, index) => (
                    <div key={index} className="mb-4 rounded-md shadow-md p-2 ">
                      <h3 className="text-xl font-semibold">
                        Slide {slide.slide_number}
                      </h3>
                      {slide.content.map((contentItem, contentIndex) => (
                        <div key={contentIndex}>
                          <p className="text-lg font-semibold">Title</p>
                          <p className="text-gray-700">{contentItem.content}</p>
                          <p className="text-lg font-semibold">Relevant Data</p>

                          <p className="text-gray-700  mb-4">
                            {contentItem.image_suggestion}
                          </p>

                          {contentItem.additional_resources && (
                            <a
                              href={contentItem.additional_resources}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Additional Resources
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            ) : latestCourse.type === "course" ? (
              <>
                {/* {
                console.log(latestCourse)
              } */}
                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  Introduction
                </h2>
                <p className="text-gray-700 mb-8">
                  {latestCourse.courseContent?.introduction?.content ||
                    "Introduction data is unavailable."}
                </p>
                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  Modules
                </h2>
                {latestCourse.courseContent?.body?.modules?.map(
                  (section, index) => (
                    <div
                      key={index}
                      className="mb-8 p-4 bg-gray-100 rounded-md"
                    >
                      <h4 className="text-xl font-semibold mb-2 text-[#1e5f9f]">
                        Module - {section.module_number} : {section.title}
                      </h4>
                      <p className="text-gray-700 mb-4">{section.content}</p>
                      {section.subtopics?.map((subtopic, subIndex) => (
                        <div key={subIndex} className="ml-4 mb-2">
                          <Link href={`/chapter/${subtopic.subtopic_slug}`}>
                            <h5 className="text-lg font-semibold text-gray-800 cursor-pointer">
                              {subtopic.title}
                            </h5>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )
                )}
                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  Conclusion
                </h2>
                <p className="text-gray-700">
                  {latestCourse.courseContent?.conclusion?.content ||
                    "Conclusion data is unavailable."}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  Introduction
                </h2>
                <p className="text-gray-700 mb-8">
                  {latestCourse.essayContent?.introduction?.content ||
                    "Introduction data is unavailable."}
                </p>

                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  Main Sections
                </h2>
                {latestCourse.essayContent?.body?.sections?.map(
                  (section, index) => (
                    <div
                      key={index}
                      className="mb-8 p-4 bg-gray-100 rounded-md"
                    >
                      <h4 className="text-xl font-semibold mb-2 text-[#1e5f9f]">
                        {section.title}
                      </h4>
                      <p className="text-gray-700 mb-4">{section.content}</p>
                      {section.subtopics?.map((subtopic, subIndex) => (
                        <div key={subIndex} className="ml-4 mb-2">
                          <h5 className="text-lg font-semibold text-gray-800">
                            {subtopic.title}
                          </h5>
                          <p className="text-gray-700">{subtopic.content}</p>
                        </div>
                      ))}
                    </div>
                  )
                )}

                <h2 className="text-3xl font-bold mb-6 text-center text-[#1e5f9f]">
                  Conclusion
                </h2>
                <p className="text-gray-700">
                  {latestCourse.essayContent?.conclusion?.content ||
                    "Conclusion data is unavailable."}
                </p>
              </>
            )}
            {(latestCourse.type === "story" ||
              latestCourse.type === "bedtime story" ||
              latestCourse.type === "explanation" ||
              latestCourse.type === "informative story" ||
              latestCourse.type === "poem") && (
              <div className="text-center mt-4 absolute right-5 top-5">
                <button
                  onClick={playContent}
                  className="bg-[#1e5f9f] hover:bg-[#40cb9f] text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Play
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
