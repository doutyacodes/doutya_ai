import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useChildren } from "@/context/CreateContext";
import LoadingSpinner from "@/app/_components/LoadingSpinner";

const ActivityCard = ({ activity, fetchActivities }) => {
  const { selectedChildId, selectedAge } = useChildren();

  const [isLoading, setIsLoading] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); // Track the uploaded file

  async function handleWeeklySubmit(course_id = null, finalActivityId) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formData = {
      child_id: selectedChildId,
      token: token,
      course_id: course_id,
      image: base64Image, // assuming `image` is in base64 format after `handleFileChange`
      finalActivityId: finalActivityId,
    };

    try {
      setIsLoading(true);
      const response = await fetch("/api/activityUpload2", {
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
        () => fetchActivities();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
      fetchActivities();
    }
  }

  const handleWeeklyImageUpload = (event) => {
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

  return (
    <div className="w-full bg-[#e8f8ee] p-4 mb-4 shadow-md rounded-md flex max-md:flex-col gap-2">
      <div className="w-full">
        <p className="text-sm text-slate-500">{activity.content}</p>
      </div>

      {activity.completed ? (
        <p className="text-green-600 font-semibold">Already completed!</p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer uppercase text-center px-6 py-3 rounded-md bg-orange-600 text-white text-sm text-nowrap w-full"
          >
            Upload Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleWeeklyImageUpload}
              className="hidden"
            />
          </motion.label>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWeeklySubmit(activity.course_id, activity.id)}
            disabled={!image || isLoading}
            className={`uppercase px-6 py-3 rounded-md text-sm w-full ${
              image ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="loader"></div>
                <style jsx>{`
                  .loader {
                    border: 8px solid #f3f3f3; /* Light grey */
                    border-top: 8px solid #ffffff; /* Orange */
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                  }

                  @keyframes spin {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>{" "}
              </>
            ) : (
              "Submit"
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
