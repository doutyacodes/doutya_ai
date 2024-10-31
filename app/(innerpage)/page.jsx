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
import { Toaster, toast } from "react-hot-toast";
import LoadingSpinner from "../_components/LoadingSpinner";
import { IoChevronBackOutline, IoPlayCircle } from "react-icons/io5";
import Link from "next/link";
import Navbar from "../_components/Navbar";
import GlobalApi from "../api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import useAuth from "../hooks/useAuth";
import { cn } from "@/lib/utils";
import ChildSelector from "../_components/ChildSelecter";

const Home = () => {
  const [courseName, setCourseName] = useState("");
  const [language, setLanguage] = useState("english");
  const [difficulty, setDifficulty] = useState("basic");
  const [type, setType] = useState("story");
  const [age, setAge] = useState(""); // New state for age input
  const [error, setError] = useState("");
  const [latestCourse, setLatestCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false); // New state for transcript visibility
  const { selectedChildId, selectedAge } = useChildren(); // Accessing selected child ID from context
  const { isAuthenticated, loading, logout } = useAuth();

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

    try {
      setIsLoading(true);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // console.log(token)
      if (!token) {
        if (age > 12 || age < 2) {
          toast.error("Age must be between 2 and 12.");
          setIsLoading(false);
          return; // Early return if age is out of bounds
        }
      }

      const response = await GlobalApi.SearchUser(token, {
        courseName,
        language,
        difficulty,
        age: isAuthenticated ? selectedAge : age,
        type,
        childId: isAuthenticated ? selectedChildId : null, // Pass selected child ID
      });

      console.log("API Response:", response.data.content); // Updated to match new JSON structure

      const newCourse = response?.data?.content || {};
      setLatestCourse(newCourse);

      if (newCourse && Object.keys(newCourse).length > 0) {
        // toast.success("Topic created successfully!");
      } else {
        toast.error("No data found.");
      }

      setCourseName("");
      setLanguage("english");
      setDifficulty("basic");
      setType("story");
      setAge(selectedAge);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(
        "Error: " + (err?.message || "An unexpected error occurred.")
      );
    } finally {
      setIsLoading(false);
    }
  };
  const playContent = () => {
    // Implement the logic to play the content based on course type
    const content =
      latestCourse.type === "poem"
        ? latestCourse.verses.map((verse) => verse.line).join(" ")
        : latestCourse.introduction?.content +
            latestCourse.body
              ?.map((paragraph) => paragraph.content)
              .join(" ") || "";

    if (content) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = content;
      speech.lang = "en-US";
      speech.rate = 1;
      speech.pitch = 1.2;
      window.speechSynthesis.speak(speech);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" flex flex-col items-center justify-center  text-gray-800 p-5 md:pt-20 pt-1">
      <Toaster />

      {!latestCourse && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            {/* <h1 className="text-5xl font-bold text-white mb-4">
              Learn Anything, Anytime, Your Way
            </h1>
            <p className="text-lg text-gray-200 max-w-lg mx-auto">
              Customized courses, adaptive learning, and flexible schedules
              crafted by you for your unique journey.
            </p> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center space-y-4 rounded-lg w-full max-w-4xl p-6"
          >
            <div className="w-full flex justify-end items-center">
              <ChildSelector />
            </div>
            <form onSubmit={handleSearch} className="w-full ">
              <div className="w-full text-center mb-4">
                <h2 className="text-xl font-semibold mb-8 items-center justify-center flex md:flex-wrap max-md:flex-col gap-3 text-white">
                  <div>I want </div>
                  <Select
                    onValueChange={setType}
                    value={type}
                    className="bg-transparent ring-transparent border focus:ring-0 focus-visible:ring-0 border-transparent underline decoration-2 underline-offset-4" // Thicker underline with offset
                  >
                    <SelectTrigger className="w-fit ring-transparent border border-transparent focus-visible:ring-transparent bg-transparent md:text-4xl text-[35px] uppercase rounded-full p-2 focus:ring-0 focus-visible:ring-0 text-white underline decoration-2 underline-offset-4 [&>svg]:w-8 [&>svg]:h-24 [&>svg]:opacity-100">
                      <SelectValue placeholder="Story" className="text-black" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="story">a Story</SelectItem>
                        <SelectItem value="bedtime story">
                          a Bedtime Story
                        </SelectItem>
                        <SelectItem value="explanation">
                          an Explanation
                        </SelectItem>
                        <SelectItem value="informative story">
                          an Informative Story
                        </SelectItem>
                        <SelectItem value="podcast">a Podcast</SelectItem>
                        <SelectItem value="poem">a Poem</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>{" "}
                  <div>about</div>
                </h2>
                <Input
                  type="text"
                  placeholder="Type the topic name here"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2 max-md:py-12 py-6 text-xl placeholder:text-lg focus-visible:ring-transparent border border-gray-300 rounded-xl md:rounded-full placeholder:text-center md:mb-16"
                />
              </div>

              <div
                className={cn(
                  "grid gap-2 md:gap-8",
                  isAuthenticated
                    ? "grid-cols-1"
                    : "grid-cols-2 max-md:grid-cols-1"
                )}
              >
                {!isAuthenticated && (
                  <div className="w-full text-center mb-4">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                      Age
                    </h2>
                    <Input
                      type="number"
                      placeholder="Enter your child’s age (2-12)"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full p-2 placeholder:text-center focus-visible:ring-transparent border border-gray-300 rounded-full"
                    />
                  </div>
                )}

                <div className="w-full text-center mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-white">
                    Language
                  </h2>
                  <Select onValueChange={setLanguage} value={language}>
                    <SelectTrigger className="w-full border text-center focus-visible:ring-transparent border-gray-300 rounded-full p-2">
                      <SelectValue
                        className="w-full text-center"
                        placeholder="English"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="portuguese">Portuguese</SelectItem>
                          <SelectItem value="dutch">Dutch</SelectItem>
                          <SelectItem value="russian">Russian</SelectItem>
                          <SelectItem value="chinese simplified">
                            Chinese (Simplified)
                          </SelectItem>
                          <SelectItem value="chinese traditional">
                            Chinese (Traditional)
                          </SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="korean">Korean</SelectItem>
                          <SelectItem value="arabic">Arabic</SelectItem>
                        </SelectGroup>
                      </SelectContent>
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
              <div className="w-full flex justify-center items-center mt-5">
                <button
                  type="submit"
                  className="bg-[#ffbd59] uppercase font-bold py-4 md:py-2 text-lg px-4 rounded-lg transition-all max-md:w-full md:min-w-52"
                >
                  Submit
                </button>
              </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </motion.div>
        </>
      )}
      {latestCourse && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-3 items-center bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 relative font-bold text-xl"
          >
            <div className="uppercase">{latestCourse?.type}</div>
            <div className="uppercase">Topic: {latestCourse?.courseName}</div>
            <div className="flex gap-3 items-center">
              <div className="uppercase font-normal">
                Age: {latestCourse?.age}
              </div>
              <div className="uppercase font-normal">
                Language: {latestCourse?.language}
              </div>
            </div>
          </motion.div>
        </>
      )}
      {latestCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center space-y-4 bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 relative mt-6"
        >
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
                <h2 className="text-3xl font-bold mb-6 mt-9 text-center text-[#1e5f9f]">
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
            ) : latestCourse.type == "podcast" ? (
              <>
                <div className="flex flex-col items-center justify-center mt-4">
                  <button
                    onClick={playContent}
                    className="text-white bg-[#1e5f9f] hover:bg-[#40cb9f] rounded-full p-4 flex items-center space-x-2 text-lg font-bold transition-all shadow-md"
                  >
                    <IoPlayCircle className="text-3xl" />
                    <span>Play Podcast</span>
                  </button>

                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="mt-4 text-[#1e5f9f] hover:underline text-lg font-semibold"
                  >
                    {showTranscript ? "Hide Transcript" : "Show Transcript"}
                  </button>

                  {showTranscript && (
                    <div className="text-left mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
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
                    </div>
                  )}
                </div>
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
            {latestCourse && (
              <div className="flex justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center space-y-4 bg-orange-400 text-white font-bold shadow-lg rounded-lg max-md:w-full w-72 max-w-4xl p-3 text-xl relative mt-6"
                  onClick={() => setLatestCourse(null)}
                >
                  Back to Search
                </motion.div>
              </div>
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
                  Play As Audio
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
