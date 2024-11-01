"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import toast from "react-hot-toast";

const AddChildModal = () => {
  const [newChildName, setNewChildName] = useState("");
  const [newChildGender, setNewChildGender] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const { updateChildrenData, selectChild, selectChildAge } = useChildren();

  const handleAddChild = async () => {
    if (newChildAge < 2 || newChildAge > 12) {
      toast.error("Age must be between 2 and 12.");
      return;
    }

    if (!newChildName || !newChildGender) {
      toast.error("Please fill all the fields to continue.");
      return;
    }

    try {
      await GlobalApi.AddChild({
        name: newChildName,
        gender: newChildGender,
        age: parseInt(newChildAge),
      });

      toast.success("Child created successfully");
      setNewChildName("");
      setNewChildGender("");
      setNewChildAge("");
      const response = await GlobalApi.GetUserChildren();
      updateChildrenData(response.data.data);
      selectChild(response.data.data[0].id);
      selectChildAge(response.data.data[0].age);
    } catch (error) {
      console.error("Failed to add child", error);
      toast.error("Failed to add child. Please try again.");
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4"
        initial={{ y: "-100vh" }}
        animate={{ y: "0" }}
        exit={{ y: "-100vh" }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Child</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={newChildGender}
            onChange={(e) => setNewChildGender(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Child&apos;s Age</label>
          <input
            type="number"
            value={newChildAge}
            onChange={(e) => setNewChildAge(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddChild}
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Add
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddChildModal;
