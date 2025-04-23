"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const AgeSelectionPopup = ({ onSubmit, onClose }) => {
  const [age, setAge] = useState("");

  const handleSubmit = () => {
    if (age >= 3 && age <= 12) {
      onSubmit(Number(age));
    } else {
      alert("Please select an age between 3 and 12.");
    }
  };

  return (
    <div className="fixed inset-0 h-screen z-[999999999999] bg-gradient-to-br from-orange-200 via-white to-orange-100 bg-opacity-40">
      {/* Remove the separate div for logo and integrate it into the main container */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* Logo positioned above the popup */}
        <div className="mb-6">
          <Link href={"/"} className="flex justify-center items-center">
            <Image
              src="/images/logo5.png"
              width={350}
              height={450}
              alt="logo"
              className="w-[250px] sm:w-[300px] md:w-[350px] h-auto"
            />
          </Link>
        </div>
        
        {/* Popup container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative z-10 bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Select your child&apos;s age
          </h2>
          
          {/* Standard select input with Tailwind styling */}
          <div className="mb-6">
            <select
              id="age"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border-2 border-orange-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="" disabled>Age (3-12)</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={i + 3}>
                  {i + 3}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-6 space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition-all"
            >
              Submit
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgeSelectionPopup;
