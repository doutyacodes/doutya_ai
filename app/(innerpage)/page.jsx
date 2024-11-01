"use client";

import { useEffect, useState } from "react";
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
  const [age, setAge] = useState(2); // New state for age input
  const [error, setError] = useState("");
  const [latestCourse, setLatestCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false); // New state for transcript visibility
  const { selectedChildId, selectedAge } = useChildren(); // Accessing selected child ID from context
  const { isAuthenticated, loading, logout } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current playback position
  const [genre, setGenre] = useState({
    value: "Any",
    label: "Any",
    label1: "Any",
  }); // State for selected genre
  const [ageGenres, setAgeGenres] = useState([]);
  let speech = null;
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
    console.log(selectedChildId);

    // Start loading state immediately
    setIsLoading(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      if (age > 12 || age < 2) {
        toast.error("Age must be between 2 and 12.");
        setIsLoading(false); // Ensure loading is stopped
        return; // Early return if age is out of bounds
      }
    }
    if (!courseName) {
      toast.error("Please enter the topic to continue.");
      setIsLoading(false); // Ensure loading is stopped
      return;
    }
    if (type === "story") {
      if (!genre) {
        toast.error("Please select a genre to continue.");
        setGenre({ value: "Any", label: "Any" });
        setIsLoading(false); // Ensure loading is stopped
        return;
      }
    }

    try {
      const response = await GlobalApi.SearchUser(token, {
        courseName,
        language,
        label:
          type === "story" && genre ? genre.label1 + " " + genre.label : null,
        genre: type === "story" && genre ? genre.value : null,
        difficulty,
        age: isAuthenticated ? selectedAge : age,
        type,
        childId: selectedChildId || null, // Pass selected child ID
      });

      console.log("API Response:", response.data.content);

      const newCourse = response?.data?.content || {};
      setLatestCourse(newCourse);

      if (newCourse && Object.keys(newCourse).length > 0) {
        // Optionally show success toast
      } else {
        toast.error("No data found.");
      }

      // Reset fields after search
      setCourseName("");
      setLanguage("english");
      setDifficulty("basic");
      setType("story");
      setGenre({ value: "Any", label: "Any", label1: "Any" });
      setAge(selectedAge ? selectedAge : 2);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(
        "Error: " + (err?.message || "An unexpected error occurred.")
      );
    } finally {
      setIsLoading(false); // Ensure loading is stopped in all cases
    }
  };

  const playContent = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const content =
        latestCourse.type === "poem"
          ? latestCourse.verses.map((verse) => verse.line).join(" ")
          : latestCourse.introduction?.content +
              latestCourse.body
                ?.map((paragraph) => paragraph.content)
                .join(" ") || "";

      const contentChunks = content.split(". "); // Split content into sentences

      if (content) {
        speech = new SpeechSynthesisUtterance();
        speech.text = contentChunks.slice(currentIndex).join(". ");
        switch (latestCourse.language) {
          case "japanese":
            speech.lang = "ja-JP";
            break;
          case "korean":
            speech.lang = "ko-KR";
            break;
          default:
            speech.lang = "en-US"; // Default to English if not Japanese or Korean
        }
        speech.rate = 1;
        speech.pitch = 1.2;

        window.speechSynthesis.speak(speech);
        setIsPlaying(true);

        speech.onend = () => {
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setIsPlaying(false);
        };
      }
    }
  };
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === "podcast") {
      setLanguage("english");
    }
    if (
      newType != "story" &&
      newType != "explanation" &&
      (language == "malayalam" ||
        language == "hindi" ||
        language == "kannada" ||
        language == "telugu")
    ) {
      setLanguage("english");
    }
  };

  const genreOptions = {
    "2-5": [
      { value: "Any", label1: "Any", label: "Any" },
      {
        value: "informative story",
        label1: "Informative Story",
        label: "Informative Story",
      },
      {
        value: "bedtime stories",
        label1: "Bedtime Stories",
        label:
          "Calm, soothing tales designed to help children wind down for sleep.",
      },
      {
        value: "animal adventures",
        label1: "Animal Adventures",
        label:
          "Simple stories featuring animals on fun, friendly journeys or adventures.",
      },
      {
        value: "friendship stories",
        label1: "Friendship Stories",
        label: "Tales that teach sharing, kindness, and empathy among friends.",
      },
      {
        value: "rhyming stories",
        label1: "Rhyming Stories",
        label: "Rhyming, rhythmic stories that support language development.",
      },
      {
        value: "fairy tales",
        label1: "Fairy Tales",
        label:
          "Simplified classic tales with gentle morals, like 'Goldilocks' or 'The Three Little Pigs.'",
      },
      {
        value: "counting alphabet stories",
        label1: "Counting & Alphabet Stories",
        label: "Stories that incorporate numbers and letters in playful ways.",
      },
      {
        value: "fantasy magic",
        label1: "Fantasy & Magic",
        label:
          "Very light fantasy with magical elements like talking animals or whimsical worlds.",
      },
      {
        value: "silly stories",
        label1: "Silly Stories",
        label: "Playful, humorous tales with funny characters.",
      },
      {
        value: "adventure exploration",
        label1: "Adventure & Exploration",
        label: "Simple stories of curiosity and discovery.",
      },
      {
        value: "seasonal stories",
        label1: "Seasonal Stories",
        label:
          "Stories centered on holidays, weather changes, or seasonal activities.",
      },
    ],
    "6-8": [
      { value: "Any", label1: "Any", label: "Any" },
      {
        value: "informative story",
        label1: "Informative Story",
        label: "Informative Story",
      },
      {
        value: "bedtime stories",
        label1: "Bedtime Stories",
        label:
          "Calm, soothing tales designed to help children wind down for sleep.",
      },
      {
        value: "fantasy magic",
        label1: "Fantasy & Magic",
        label: "Magical tales with more imaginative elements.",
      },
      {
        value: "humor mischief",
        label1: "Humor & Mischief",
        label: "Silly, playful stories with funny twists.",
      },
      {
        value: "animal fables",
        label1: "Animal Fables",
        label: "Short stories with animals, each ending in a moral.",
      },
      {
        value: "mystery",
        label1: "Mystery",
        label: "Simple mysteries, such as finding lost objects.",
      },
      {
        value: "adventure stories",
        label1: "Adventure Stories",
        label: "Characters go on small quests.",
      },
      {
        value: "superhero tales",
        label1: "Superhero Tales",
        label: "Age-appropriate superhero stories.",
      },
      {
        value: "historical legends",
        label1: "Historical Legends",
        label: "Gentle retellings of folk tales.",
      },
      {
        value: "friendship family stories",
        label1: "Friendship & Family Stories",
        label: "Stories about navigating simple conflicts.",
      },
      {
        value: "nature science",
        label1: "Nature & Science",
        label: "Stories that introduce basic science concepts.",
      },
      {
        value: "travel exploration",
        label1: "Travel & Exploration",
        label: "Tales about visiting new places.",
      },
      {
        value: "everyday adventures",
        label1: "Everyday Adventures",
        label: "Stories where characters tackle school or personal goals.",
      },
    ],
    "9-12": [
      { value: "Any", label1: "Any", label: "Any" },
      {
        value: "informative story",
        label1: "Informative Story",
        label: "Informative Story",
      },
      {
        value: "bedtime stories",
        label1: "Bedtime Stories",
        label:
          "Calm, soothing tales designed to help children wind down for sleep.",
      },
      {
        value: "historical fiction",
        label1: "Historical Fiction",
        label: "Stories set in different historical periods.",
      },
      {
        value: "science fiction",
        label1: "Science Fiction",
        label: "Light sci-fi exploring concepts like space travel.",
      },
      {
        value: "fantasy quests",
        label1: "Fantasy Quests",
        label: "More complex fantasy stories involving quests.",
      },
      {
        value: "detective mystery",
        label1: "Detective & Mystery",
        label: "Engaging mysteries that require problem-solving.",
      },
      {
        value: "adventure survival",
        label1: "Adventure & Survival",
        label: "Stories about surviving in the wild.",
      },
      {
        value: "mythology",
        label1: "Mythology",
        label: "Stories based on myths from different cultures.",
      },
      {
        value: "coming of age",
        label1: "Coming-of-Age",
        label: "Stories exploring themes of self-discovery.",
      },
      {
        value: "humor satires",
        label1: "Humor & Satire",
        label: "Funny stories with gentle satire.",
      },
      {
        value: "real life situations",
        label1: "Real-Life Situations",
        label: "Stories dealing with friendship issues.",
      },
      {
        value: "sports competition",
        label1: "Sports & Competition",
        label: "Stories about sportsmanship.",
      },
      {
        value: "science technology",
        label1: "Science & Technology",
        label: "Stories that introduce technology.",
      },
      {
        value: "magic realism",
        label1: "Magic Realism",
        label: "Stories blending reality and magical elements.",
      },
    ],
  };

  // Effect to set genre options based on selected age
  useEffect(() => {
    if (selectedAge) {
      if (selectedAge >= 2 && selectedAge <= 5) {
        setAgeGenres(genreOptions["2-5"]);
      } else if (selectedAge >= 6 && selectedAge <= 8) {
        setAgeGenres(genreOptions["6-8"]);
      } else if (selectedAge >= 9 && selectedAge <= 12) {
        setAgeGenres(genreOptions["9-12"]);
      } else {
        setAgeGenres([]); // Reset if age is out of bounds
      }
    } else {
      if (age >= 2 && age <= 5) {
        setAgeGenres(genreOptions["2-5"]);
      } else if (age >= 6 && age <= 8) {
        setAgeGenres(genreOptions["6-8"]);
      } else if (age >= 9 && age <= 12) {
        setAgeGenres(genreOptions["9-12"]);
      } else {
        setAgeGenres([]); // Reset if age is out of bounds
      }
    }
  }, [age, selectedAge]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className=" flex flex-col items-center justify-center  text-gray-800 p-5 md:pt-20 pt-0">
      <Toaster />

      {!latestCourse && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-2"
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
            className="flex flex-col items-center space-y-4 rounded-lg w-full max-w-4xl p-1 py-4"
          >
            <div className="w-full flex justify-end items-center">
              <ChildSelector />
            </div>
            <form onSubmit={handleSearch} className="w-full ">
              <div className="w-full text-center mb-4">
                <h2 className="text-xl font-semibold max-md:w-full mb-8 items-center justify-center flex md:flex-wrap max-md:flex-col gap-3 text-white">
                  <div>I want </div>
                  <Select
                    onValueChange={handleTypeChange}
                    value={type}
                    className="bg-transparent ring-transparent border focus:ring-0 focus-visible:ring-0 border-transparent underline decoration-2  max-md:w-full" // Thicker underline with offset
                  >
                    <SelectTrigger className="w-fit ring-transparent border border-transparent focus-visible:ring-transparent bg-transparent md:text-4xl text-[29px] uppercase rounded-full p-2 focus:ring-0 focus-visible:ring-0 text-white underline decoration-2  [&>svg]:w-8 [&>svg]:h-24 [&>svg]:opacity-100">
                      <SelectValue
                        placeholder="Story"
                        className="text-black w-full"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="story">a Story</SelectItem>
                        {/* <SelectItem value="bedtime story">
                          a Bedtime Story
                        </SelectItem> */}
                        <SelectItem value="explanation">
                          an Explanation
                        </SelectItem>
                        {/* <SelectItem value="informative story">
                          an Informative Story
                        </SelectItem> */}
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
              {ageGenres.length > 0 && type == "story" && (
                <div className="w-full text-center mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-white">
                    Select a Genre
                  </h2>
                  <Select
                    onValueChange={(value) =>
                      setGenre(
                        ageGenres.find((option) => option.value === value)
                      )
                    }
                    value={genre.value}
                  >
                    <SelectTrigger className="w-full border text-center focus-visible:ring-transparent border-gray-300 rounded-full p-2">
                      <SelectValue placeholder={genre.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="max-md:w-screen pr-2">
                        {ageGenres.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span>{option.label1}</span>
                           {
                            (option.label1 !=="Any" && option.label1 !=="Informative Story")&&  <div className="text-[10px] text-gray-500">{option.label}</div>
                           }
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                          {type != "podcast" && (
                            <>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="portuguese">
                                Portuguese
                              </SelectItem>
                              {/* <SelectItem value="dutch">Dutch</SelectItem>
                              <SelectItem value="russian">Russian</SelectItem>
                              <SelectItem value="chinese simplified">
                                Chinese (Simplified)
                              </SelectItem>
                              <SelectItem value="chinese traditional">
                                Chinese (Traditional)
                              </SelectItem>
                              <SelectItem value="japanese">Japanese</SelectItem>
                              <SelectItem value="korean">Korean</SelectItem>
                              <SelectItem value="arabic">Arabic</SelectItem> */}
                            </>
                          )}
                          {/* {(type == "story" || type == "explanation") && (
                            <>
                              <SelectItem value="malayalam">
                                Malayalam
                              </SelectItem>
                              <SelectItem value="kannada">Kannada</SelectItem>
                              <SelectItem value="telugu">Telugu</SelectItem>
                              <SelectItem value="hindi">Hindi</SelectItem>
                            </>
                          )} */}
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
            {(latestCourse?.type == "story" ||
              latestCourse?.type == "explanation") && (
              <div className="uppercase text-lg font-normal">
                Genre: {latestCourse?.genre}
              </div>
            )}
            <div className="flex gap-7 items-center">
              <div className="uppercase text-lg font-normal">
                Age: {latestCourse?.age}
              </div>
              <div className="uppercase text-lg font-normal">
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
                  {latestCourse.language == "english" && (
                    <button
                      onClick={playContent}
                      className="text-white bg-[#1e5f9f] hover:bg-[#40cb9f] rounded-full p-4 flex items-center space-x-2 text-lg font-bold transition-all shadow-md"
                    >
                      <IoPlayCircle className="text-3xl" />
                      <span>{isLoading ? "Pause" : "Play Podcast"}</span>
                    </button>
                  )}
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
                {latestCourse.language == "english" && (
                  <button
                    onClick={playContent}
                    className="bg-[#1e5f9f] hover:bg-[#40cb9f] text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    {isPlaying ? "Pause" : "Play As Audio"}
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
