"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChildren } from "@/context/CreateContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { IoPauseCircle, IoPlayCircle, IoStopCircle } from "react-icons/io5";
import LoadingSpinner from "../_components/LoadingSpinner";
import GlobalApi from "../api/_services/GlobalApi";
import useAuth from "../hooks/useAuth";
import PostData from "./(community)/communities/_components/PostData";

const Home = () => {
  const [courseName, setCourseName] = useState("");
  const [language, setLanguage] = useState("english");
  const [difficulty, setDifficulty] = useState("basic");
  const [type, setType] = useState("story");
  const { selectedChildId, selectedAge, selectedWeeks, loading } =
    useChildren(); // Accessing selected child ID from context
  const [age, setAge] = useState(selectedAge ? selectedAge : 2); // New state for age input
  const [error, setError] = useState("");
  const [latestCourse, setLatestCourse] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false); // New state for transcript visibility
  const { isAuthenticated, logout } = useAuth();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); // Track the uploaded file
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null); // Create a reference for the file input
  const [hideActivity, setHideActivity] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current playback position
  const [sampleAge, setSampleAge] = useState(null);
  const [childAge, setChildAge] = useState(0);
  const [genre, setGenre] = useState({
    value: "Any",
    label1: "Any",
    label: "A broad selection of age-appropriate stories for children.",
  }); // State for selected genre
  const [ageGenres, setAgeGenres] = useState([]);
  const [showButton, setShowButton] = useState(true);
  const [showOurStory, setShowOurStory] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [posts, setPosts] = useState([]);
  console.log("selectedAge", selectedAge);
  useEffect(() => {
    if (selectedAge) {
      setAge(selectedAge);
    }
  }, [selectedAge]);
  const router = useRouter();
  // Function to handle scroll to a specific section and update visibility
  const [newsCategories, setNewsCategories] = useState([]);
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    return new Date(date).toLocaleString("en-IN", options).replace(",", "");
  };

  const fetchNews = async () => {
    // console.log(sampleAge,selectedAge)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setIsLoading(true);
      const response = await GlobalApi.fetchNewsHome(token, {
        age: isAuthenticated ? selectedAge : selectedAge,
      });
      const news = response.data.news || [];
      // console.log("response", response.data);
      setNewsCategories(news);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((selectedAge && selectedAge != "") || (sampleAge && sampleAge != "")) {
      fetchNews();
    }
  }, [selectedAge, sampleAge]);
  const scrollToSection = (sectionId) => {
    // Update which sections to show based on the section clicked
    if (sectionId === "our-story") {
      setShowOurStory(true);
      setShowFeatures(false);
    } else if (sectionId === "features") {
      setShowOurStory(false);
      setShowFeatures(true);
    }

    // Scroll to the selected section smoothly
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setShowButton(false); // Hide button after click
    }
  };

  // Show button when the user scrolls back up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setShowButton(true); // Show button when near the top
      }
    };
    window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);

    // Cleanup for both scroll listener and speech synthesis
    return () => {
      window.removeEventListener("scroll", handleScroll); // Remove scroll listener

      // Stop any ongoing speech synthesis and fully reset the utterance reference
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    };
  }, []);
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
        ages: isAuthenticated ? selectedAge : age,
        weekData: isAuthenticated ? selectedWeeks : 1,
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

      // // Reset fields after search
      // setCourseName("");
      // setLanguage("english");
      // setDifficulty("basic");
      // setType("story");
      // setGenre({
      //   value: "Any",
      //   label1: "Any",
      //   label: "A broad selection of age-appropriate stories for children.",
      // });
      // setHideActivity(true);

      // setAge(selectedAge ? selectedAge : 2);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(
        "Error: " + (err?.message || "An unexpected error occurred.")
      );
    } finally {
      setIsLoading(false); // Ensure loading is stopped in all cases
    }
  };

  const truncateTitle = (title, length = 40) =>
    title.length > length ? `${title.slice(0, length)}...` : title;

  const handleSearch2 = async (topic) => {
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
        courseName: topic,
        language,
        label:
          type === "story" && genre ? genre.label1 + " " + genre.label : null,
        genre: type === "story" && genre ? genre.value : null,
        difficulty,
        ages: isAuthenticated ? selectedAge : age,
        weekData: isAuthenticated ? selectedWeeks : 1,
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

      // // Reset fields after search
      // setCourseName("");
      // setLanguage("english");
      // setDifficulty("basic");
      // setType("story");
      // setGenre({
      //   value: "Any",
      //   label1: "Any",
      //   label: "A broad selection of age-appropriate stories for children.",
      // });
      // setHideActivity(true);

      // setAge(selectedAge ? selectedAge : 2);
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
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      // If paused, resume without creating a new utterance
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        // If not yet started, initialize the utterance and start playing
        window.speechSynthesis.cancel(); // Stop any ongoing speech
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
    }
  };

  const stopContent = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentIndex(0);
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
      {
        value: "Any",
        label1: "Any",
        label: "A broad selection of age-appropriate stories for children.",
      },
      {
        value: "informative story",
        label1: "Informative Story",
        label: "Engaging stories that introduce simple facts and concepts.",
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
        label: "Simplified classic tales with gentle morals.",
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
      {
        value: "Any",
        label1: "Any",
        label: "A broad selection of age-appropriate stories for children.",
      },
      {
        value: "informative story",
        label1: "Informative Story",
        label: "Engaging stories that introduce simple facts and concepts.",
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
      {
        value: "Any",
        label1: "Any",
        label: "A broad selection of age-appropriate stories for children.",
      },
      {
        value: "informative story",
        label1: "Informative Story",
        label: "Engaging stories that introduce simple facts and concepts.",
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

  const handleUpload = () => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    // Open the file upload dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Check if the selected file is an image
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile); // Store the file for later use
      setImage(URL.createObjectURL(selectedFile)); // Preview the image (optional)

      // Convert the image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // Save base64 encoded image
      };
      reader.readAsDataURL(selectedFile);

      console.log("Image uploaded:", selectedFile);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  async function submitUpload(courseId) {
    if (!isAuthenticated) {
      router.push("/login");
    }
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formData = {
      child_id: selectedChildId,
      token: token,
      course_id: courseId,
      image: base64Image, // assuming `image` is in base64 format after `handleFileChange`
    };

    try {
      const response = await fetch("/api/activityUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Log the raw response text to understand what the server is sending
      // const responseText = await response.data; // Read response as text
      console.log("response", response);
      // console.log("Raw response text:", responseText);

      // // Check if the response is empty or not JSON
      // const result = JSON.parse(responseText); // Parse the text as JSON

      if (response.ok) {
        toast.success("Activity completed successfully");

        setHideActivity(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div
      className={cn(
        " flex flex-col items-center justify-center  text-gray-800 p-1  pt-0"
      )}
    >
      <Toaster />

      {!latestCourse && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-2"
          >
            {/* <h1 className="text-5xl font-bold  mb-4">
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
            className="rounded-md flex justify-center items-center border-2 border-orange-400/40 mt-4 py-3 w-full bg-white p-3"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center space-y-4 rounded-lg w-full max-w-4xl p-1 py-4"
            >
              {/* <div className="w-full flex justify-end items-center">
              <ChildSelector />
            </div> */}
              <form onSubmit={handleSearch} className="w-full">
                <div className="w-full text-center mb-4">
                  <h2 className="text-xl font-semibold max-md:w-full mb-8 items-center justify-center flex flex-wrap  gap-3 ">
                    <div className="max-md:text-sm">I want </div>
                    <Select
                      onValueChange={handleTypeChange}
                      value={type}
                      className="bg-transparent ring-transparent border  bg-[#ede7e7] focus:ring-0 focus-visible:ring-0 border-[#f59e1e] underline decoration-2  max-md:w-full" // Thicker underline with offset
                    >
                      <SelectTrigger className="w-fit ring-transparent border border-transparent focus-visible:ring-transparent bg-transparent md:text-4xl text-xl uppercase rounded-full p-2 focus:ring-0 focus-visible:ring-0  underline decoration-2  [&>svg]:w-8 [&>svg]:h-24 [&>svg]:opacity-100">
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
                    <div className="text-sm">about</div>
                  </h2>
                  <Input
                    type="text"
                    placeholder="Type the topic name here"
                    value={courseName}
                    maxLength="150"
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full p-2 max-md:py-5 py-6 text-xl placeholder:text-sm focus-visible:ring-transparent border border-[#f59e1e] rounded-xl md:rounded-lg placeholder:text-center md:mb-4 bg-[#ede7e7]"
                  />
                </div>
                <div
                  onClick={() => setAdvanced(!advanced)}
                  className="cursor-pointer text-center text-orange-600 mb-2 hover:underline max-md:text-xs"
                >
                  {advanced ? "Hide Advanced Filter" : "Show Advanced Filter"}
                </div>
                {advanced && (
                  <>
                    {ageGenres.length > 0 && type == "story" && (
                      <div className="w-full text-center mb-4">
                        <h2 className="text-lg font-semibold mb-2 ">
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
                          <SelectTrigger className="w-full border text-center focus-visible:ring-transparent  bg-[#ede7e7] border-[#f59e1e] rounded-lg p-2">
                            <SelectValue placeholder={genre.label} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="max-md:w-screen pr-2">
                              {ageGenres.map((option) => (
                                <SelectItem
                                  className="w-full"
                                  key={option.value}
                                  value={option.value}
                                >
                                  <span className="w-full text-center">
                                    {option.label1}
                                  </span>
                                  {/* {
                              <div className="text-[10px] md:hidden text-gray-500 pt-1 mt-1 w-full border-t-[1px]">
                                {option.label}
                              </div>
                            } */}
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
                        selectedAge
                          ? "grid-cols-1"
                          : "grid-cols-2 max-md:grid-cols-1"
                      )}
                    >
                      {!isAuthenticated && !selectedAge && (
                        <div className="w-full text-center mb-4">
                          <h2 className="text-lg font-semibold mb-2 ">Age</h2>
                          <Input
                            type="number"
                            placeholder="Enter your child’s age (2-12)"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full p-2 placeholder:text-center  bg-[#ede7e7] focus-visible:ring-transparent border border-[#f59e1e] rounded-lg"
                          />
                        </div>
                      )}

                      <div className="w-full text-center mb-4">
                        <h2 className="text-lg font-semibold mb-2 ">
                          Language
                        </h2>
                        <Select onValueChange={setLanguage} value={language}>
                          <SelectTrigger className="w-full border text-center  bg-[#ede7e7] focus-visible:ring-transparent border-[#f59e1e] rounded-lg p-2">
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
                                    <SelectItem value="spanish">
                                      Spanish
                                    </SelectItem>
                                    <SelectItem value="french">
                                      French
                                    </SelectItem>
                                    <SelectItem value="german">
                                      German
                                    </SelectItem>
                                    <SelectItem value="italian">
                                      Italian
                                    </SelectItem>
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
                  </>
                )}

                {/* {age > 13 && (
                <div className="w-full text-center mb-4">
                  <h2 className="text-lg font-semibold mb-2 ">
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
                    className="bg-green-600 rounded-full uppercase font-semibold py-2 max-md:max-w-40 md:py-2 text-lg max-md:text-base text-white px-4 transition-all max-md:w-full md:min-w-60 "
                  >
                    Submit
                  </button>
                </div>
              </form>
              {error && <p className="text-red-500">{error}</p>}
            </motion.div>
          </motion.div>
        </>
      )}
      {latestCourse && (
        <div className="flex items-start justify-between bg-white rounded-lg w-full shadow-md mt-4 p-6 relative font-bold text-xl">
          <div
            onClick={() => setLatestCourse(null)}
            className="bg-orange-500  p-2 rounded-full"
          >
            <ChevronLeft />
            {console.log(latestCourse?.activities)}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-3 items-center "
          >
            <div className="uppercase underline text-xl">
              {latestCourse?.courseName}
            </div>
            <div className="uppercase  text-base font-semibold">
              {latestCourse?.type}{" "}
              {(latestCourse?.type == "story" ||
                latestCourse?.type == "explanation") && (
                <span className="uppercase text-base font-semibold">
                  - {latestCourse?.genre}
                </span>
              )}
            </div>

            <div className="flex gap-7 items-center">
              <div className="uppercase text-sm font-normal">
                Age: {latestCourse?.age}
              </div>
              <div className="uppercase text-sm font-normal">
                Language: {latestCourse?.language}
              </div>
            </div>
          </motion.div>
          <div />
        </div>
      )}
      <div className="w-full md:flex gap-7  pt-6">
        {latestCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center space-y-4 bg-[#f8f8f8] shadow-lg rounded-lg w-full max-w-4xl p-3 py-6 relative"
          >
            <div className="mt-2 w-full text-left">
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
                  <h2 className="text-3xl font-bold mb-6  text-center text-black">
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
                      <div className="flex gap-2">
                        <button
                          onClick={playContent}
                          className="bg-[#1e5f9f] hover:bg-[#40cb9f] rounded-full p-4 flex items-center space-x-2 text-lg font-bold transition-all shadow-md"
                        >
                          {isPlaying ? (
                            <>
                              <IoPauseCircle className="text-3xl text-white" />{" "}
                              Pause
                            </>
                          ) : (
                            <>
                              <IoPlayCircle className="text-3xl text-white" />{" "}
                              Play Podcast
                            </>
                          )}
                        </button>
                        <button
                          onClick={stopContent}
                          disabled={!isPlaying} // Disable when isPlaying is false
                          className={`${
                            isPlaying
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-gray-400 cursor-not-allowed"
                          } text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2`}
                        >
                          <IoStopCircle className="text-xl" /> Stop
                        </button>
                      </div>
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
                    {latestCourse.presentation?.title ||
                      "Title is unavailable."}
                  </h2>
                  <div className="mb-8">
                    {latestCourse.presentation?.slides.map((slide, index) => (
                      <div
                        key={index}
                        className="mb-4 rounded-md shadow-md p-2 "
                      >
                        <h3 className="text-xl font-semibold">
                          Slide {slide.slide_number}
                        </h3>
                        {slide.content.map((contentItem, contentIndex) => (
                          <div key={contentIndex}>
                            <p className="text-lg font-semibold">Title</p>
                            <p className="text-gray-700">
                              {contentItem.content}
                            </p>
                            <p className="text-lg font-semibold">
                              Relevant Data
                            </p>

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

              {/* {(latestCourse.type === "story" ||
                latestCourse.type === "bedtime story" ||
                latestCourse.type === "explanation" ||
                latestCourse.type === "informative story" ||
                latestCourse.type === "poem") && (
                <div className="text-center mt-4 absolute right-5 top-5">
                  {latestCourse.language == "english" && (
                    <button
                      onClick={playContent}
                      className="bg-[#1e5f9f] hover:bg-[#40cb9f]  font-bold py-2 px-4 rounded-lg text-white transition-all"
                    >
                      {isPlaying ? "Pause" : "Play As Audio"}
                    </button>
                  )}
                </div>
              )} */}
            </div>
          </motion.div>
        )}
        {latestCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col  gap-3 md:w-[30%]"
          >
            {latestCourse?.activities && hideActivity && (
              <div className=" bg-[#f8f8f8] rounded-lg p-3 shadow-lg  max-md:mt-4 border border-slate-200">
                <h4 className="uppercase underline  font-bold text-center text-xl mb-8">
                  Actvity
                </h4>
                <h4 className="uppercase font-semibold my-3 text-lg">
                  {latestCourse?.activities?.title}
                </h4>
                <h4 className=" ">{latestCourse?.activities?.content}</h4>
                <div className="w-full flex justify-between mt-5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef} // Attach the ref to the file input
                  />
                  <Button
                    className="bg-orange-500 p-2 font-bold"
                    onClick={handleUpload} // Open the file dialog
                  >
                    Upload Picture
                  </Button>
                  <Button
                    className="bg-green-600 p-2 font-bold"
                    onClick={() => submitUpload(latestCourse?.courseId)}
                  >
                    Submit
                  </Button>
                </div>
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                )}
              </div>
            )}
            {/* <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center space-y-4 bg-orange-400  font-bold shadow-lg rounded-lg max-md:w-full w-72 max-w-4xl p-3 text-xl relative mt-6"
                  onClick={() => setLatestCourse(null)}
                >
                  Back to Search
                </motion.div> */}
            <div className="flex flex-col gap-5">
              <p className="uppercase font-bold text-lg text-center">
                Related Topics
              </p>

              <div className="flex justify-between gap-3">
                <button
                  className="bg-yellow-400 p-3 rounded-md px-7 text-center uppercase font-semibold text-sm"
                  onClick={() =>
                    handleSearch2(latestCourse?.["related-topics"][0]?.topic)
                  }
                >
                  {latestCourse?.["related-topics"]?.length > 0 &&
                    latestCourse?.["related-topics"][0]?.topic}
                </button>
                <button
                  className="bg-yellow-400 p-3 rounded-md px-7 text-center uppercase font-semibold text-sm"
                  onClick={() =>
                    handleSearch2(latestCourse?.["related-topics"][1]?.topic)
                  }
                >
                  {latestCourse?.["related-topics"]?.length > 0 &&
                    latestCourse?.["related-topics"][1]?.topic}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* <div className="space-y-5">
        {showOurStory && <OurStory />}
        {showFeatures && <Features />}
        <Contact />
      </div> */}

      {/* Scroll Button with Animation */}
      {/* Scroll Buttons with Animation */}
      {/* {showButton && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-3 w-full flex justify-center items-center">
        <div className=" flex space-x-4 bg-orange-500 justify-between rounded-3xl shadow-lg px-2 max-sm:w-full w-72">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            onClick={() => scrollToSection("our-story")}
            className=" text-white text-xs p-3  flex flex-col items-center justify-center w-full"
          >
            <span>Our Story</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            onClick={() => scrollToSection("features")}
            className=" text-white text-xs p-3  flex flex-col items-center justify-center w-full"
          >
            <span>Our Features</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>
        </div>
      )} */}
      {
        !latestCourse && (<div className="grid  grid-cols-1 gap-4 w-full mt-2">
          <div className="w-full rounded-md bg-[#febd59] space-y-2">
            <div className="flex flex-col gap-2 text-center">
              <h4 className=" text-center font-semibold text-3xl py-1 max-md:text-2xl bg-[#f68c1f] rounded-md">
                NEWS
              </h4>
              <span className="text-center text-slate-600 text-sm max-md:text-xs w-full">
                Todays News made age appropriate for Kids
              </span>
            </div>
            <div
              className={cn(
                "w-full flex flex-col gap-2  relative p-2",
                newsCategories?.length > 0 ? " overflow-y-auto h-96" : "h-64"
              )}
            >
              {!selectedAge && !sampleAge && (
                <div className="absolute top-0 left-0 bg-white w-full h-full z-[999999999] rounded-md opacity-95 flex justify-center items-center">
                  <div className="w-[90%] max-w-md bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                    {/* <h2 className="text-xl font-semibold mb-4">
                      Enter Your Child&apos;s Age
                    </h2> */}
                    {/* <div>
                      <input
                        type="number"
                        min="3"
                        max="12"
                        placeholder="Enter age (3-12)"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          if (!childAge) {
                            toast.error(
                              "Please enter your child's age to continue"
                            );
                          } else if (childAge < 3 || childAge > 12) {
                            toast.error(
                              "Children from age 3 to 12 only can continue."
                            );
                          } else {
                            setSampleAge(childAge);
                          }
                        }}
                        className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600"
                      >
                        Submit
                      </button>
                    </div> */}
                  </div>
                </div>
              )}
  
              <div className="grid grid-cols-1 gap-2">
                {newsCategories?.length > 0 &&
                  newsCategories?.map((item) => {
                    return (
                      <div
                        key={item.title}
                        className="bg-white rounded-md p-2 flex items-center gap-3 w-full shadow-md"
                      >
                        <div className="relative w-36 h-20 md:w-40 md:h-20">
                          <Image
                            src={`https://wowfy.in/testusr/images/${item.image_url}`}
                            fill
                            objectFit="cover"
                            alt={"logo"}
                          />
                        </div>
                        <div className="h-full w-full flex flex-col justify-between max-h-20 md:max-h-20">
                          <div className="leading-5">
                            <p className="text-sm max-md:text-[11.5px] text-red-500">
                              {item.category_name}
                            </p>
                            <p className="text-[15px] md:text-lg font-semibold">
                              {truncateTitle(item.title)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[10px] md:text-sm text-slate-500">
                              {formatDate(item.created_at)}
                            </span>
                            <Link
                              href={`/news/${item.category_name.toLowerCase()}/${
                                item.id
                              }`}
                              className="text-[10px] md:text-sm text-slate-500"
                            >
                              Read more...
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {!selectedAge && !sampleAge && (
                <>
                  <div className="bg-white rounded-md p-2 flex items-center gap-3 w-full">
                    <Image
                      src={
                        "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg"
                      }
                      width={80}
                      height={80}
                      alt={"logo"}
                    />
                    <div className="h-full w-full">
                      <p className=" text-xs text-red-500">International</p>
                      <p className=" text-sm font-semibold">
                        Lorem ipsum dolor sit amet consectetur...
                      </p>
                      <div className="w-full flex justify-between items-center">
                        <span className="text-[9px] text-slate-500">
                          Saturday, 16 Nov 2014 04:44 PM
                        </span>
                        <span className="text-[9px] text-slate-500">
                          Read more...
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2 flex items-center gap-3 w-full">
                    <Image
                      src={
                        "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg"
                      }
                      width={80}
                      height={80}
                      alt={"logo"}
                    />
                    <div className="h-full w-full">
                      <p className=" text-xs text-red-500">International</p>
                      <p className=" text-sm font-semibold">
                        Lorem ipsum dolor sit amet consectetur...
                      </p>
                      <div className="w-full flex justify-between items-center">
                        <span className="text-[9px] text-slate-500">
                          Saturday, 16 Nov 2014 04:44 PM
                        </span>
                        <span className="text-[9px] text-slate-500">
                          Read more...
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2 flex items-center gap-3 w-full">
                    <Image
                      src={
                        "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg"
                      }
                      width={80}
                      height={80}
                      alt={"logo"}
                    />
                    <div className="h-full w-full">
                      <p className=" text-xs text-red-500">International</p>
                      <p className=" text-sm font-semibold">
                        Lorem ipsum dolor sit amet consectetur...
                      </p>
                      <div className="w-full flex justify-between items-center">
                        <span className="text-[9px] text-slate-500">
                          Saturday, 16 Nov 2014 04:44 PM
                        </span>
                        <span className="text-[9px] text-slate-500">
                          Read more...
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Community */}
          {/* <div className="w-full rounded-md bg-[#76e4e4] flex flex-col justify-center items-center p-2 space-y-4">
            <div className="flex flex-col gap-2 text-center">
              <h4 className=" text-center font-semibold text-2xl">COMMUNITY</h4>
              <span className="text-center text-slate-600 text-xs w-full">
                Age appropriate Social Media for Kids
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  "w-full flex flex-col gap-2  relative",
                  posts?.length > 0 ? " overflow-y-auto h-72" : "h-64"
                )}
              >
                {posts.length > 0 ? (
                  posts.map((post) => <PostData key={post.postId} post={post} />)
                ) : (
                  <p className="text-gray-600">
                    No posts found for this community.
                  </p>
                )}
              </div>
            </div>
          </div> */}
        </div>)
      }
    </div>
  );
};

export default Home;
