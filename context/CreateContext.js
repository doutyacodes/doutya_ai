"use client";
// CreateContext.js
import React, { createContext, useContext, useState } from "react";

const ChildrenContext = createContext();

export const ChildrenProvider = ({ children }) => {
  const [childrenData, setChildrenData] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null); // New state for selected child ID
  const [selectedAge, setSelectedAge] = useState(null); // New state for selected child ID

  const updateChildrenData = (data) => {
    setChildrenData(data);
  };

  const selectChild = (childId) => {
    setSelectedChildId(childId); // Update the selected child ID
  };
  const selectChildAge = (age) => {
    setSelectedAge(age); // Update the selected child ID
  };

  return (
    <ChildrenContext.Provider
      value={{
        childrenData,
        updateChildrenData,
        selectedChildId,
        selectChild,
        selectChildAge,
        selectedAge,
      }}
    >
      {children}
    </ChildrenContext.Provider>
  );
};

export const useChildren = () => {
  return useContext(ChildrenContext);
};
