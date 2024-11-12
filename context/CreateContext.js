"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useRouter } from "next/navigation";
import WelcomeCard from "@/app/_components/WelcomeCard";

const ChildrenContext = createContext();

export const ChildrenProvider = ({ children }) => {
  const [childrenData, setChildrenData] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedWeeks, setSelectedWeeks] = useState(null);
  const [selectedDob, setSelectedDob] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // control popup visibility
  const router = useRouter();

  const updateChildrenData = (data) => {
    setChildrenData(data);
  };

  const selectChild = (childId) => {
    const selectedChild = childrenData.find(
      (child) => child.id === parseInt(childId)
    );
    if (selectedChild) {
      setSelectedChildId(selectedChild.id);
      setSelectedAge(selectedChild.age);
      setSelectedGender(selectedChild.gender);
      setSelectedName(selectedChild.name);
      setSelectedWeeks(selectedChild.weeks);
      setSelectedDob(selectedChild.dob);
      setShowPopup(true); // Show popup when child is selected
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false); // Hide popup after 2 seconds
        router.push("/"); // Redirect to homepage
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, router]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const response = await GlobalApi.GetUserChildren(token);
        const children = response.data.data;
        setChildrenData(children);
        if (children.length > 0) {
          selectChild(children[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <ChildrenContext.Provider
      value={{
        childrenData,
        updateChildrenData,
        selectedChildId,
        selectChild,
        selectedAge,
        selectedGender,
        selectedName,
        selectedWeeks,
        selectedDob,
        loading,
      }}
    >
      {children}
      {showPopup && selectedName && selectedAge && (
        <WelcomeCard  data={{name:selectedName,age:selectedAge,gender:selectedGender}}/>
      )}
    </ChildrenContext.Provider>
  );
};

export const useChildren = () => {
  return useContext(ChildrenContext);
};

