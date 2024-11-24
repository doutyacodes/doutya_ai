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
      <div className="flex justify-center items-center">
        <Link href={"/"} className=" flex justify-center items-center">
          <Image src={"/images/logo2.png"} width={90} height={120} alt="logo" />
        </Link>
      </div>
      <div className=" flex items-center justify-center h-full ">
        {/* Background overlay */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-orange-200 via-white to-orange-100"
        /> */}

        {/* Popup container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative z-10 bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Enter your child&apos;s age
          </h2>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border-2 border-orange-300 focus:border-orange-500 rounded-lg px-4 py-2 w-full placeholder:text-center text-gray-700 focus:outline-none transition duration-200"
            placeholder="Enter age (3-12) "
          />
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