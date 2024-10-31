"use client";
// CreateContext.js
import React, { createContext, useContext, useState } from "react";

const ChildrenContext = createContext();

export const ChildrenProvider = ({ children }) => {
  const [childrenData, setChildrenData] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null); // New state for selected child gender

  const updateChildrenData = (data) => {
    setChildrenData(data);
  };

  const selectChild = (childId) => {
    const selectedChild = childrenData.find((child) => child.id === parseInt(childId));
    if (selectedChild) {
      setSelectedChildId(selectedChild.id);
      setSelectedAge(selectedChild.age);
      setSelectedGender(selectedChild.gender);
    }
  };

  const selectChildAge = (age) => {
    setSelectedAge(age);
  };

  const selectChildGender = (gender) => {
    setSelectedGender(gender); // Update the selected child gender
  };

  return (
    <ChildrenContext.Provider
      value={{
        childrenData,
        updateChildrenData,
        selectedChildId,
        selectChild,
        selectedAge,
        selectChildAge,
        selectedGender,
        selectChildGender,
      }}
    >
      {children}
    </ChildrenContext.Provider>
  );
};

export const useChildren = () => {
  return useContext(ChildrenContext);
};
