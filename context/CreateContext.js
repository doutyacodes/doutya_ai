"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useRouter } from "next/navigation";
import WelcomeCard from "@/app/_components/WelcomeCard";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import AgeSelectionPopup from "@/app/_components/AgeSelectionPopup"; // Create this component
import useAuth from "@/app/hooks/useAuth";

const ChildrenContext = createContext();

export const ChildrenProvider = ({ children }) => {
  const [childrenData, setChildrenData] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedWeeks, setSelectedWeeks] = useState(null);
  const [selectedDob, setSelectedDob] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAgePopup, setShowAgePopup] = useState(false); // For unauthenticated age selection
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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
      setSelectedGrade(selectedChild.grade);
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        router.push("/");
      }, 3000);
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
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetchChildren();
    } else {
      // Check localStorage for age data when not authenticated
      const storedAge = localStorage.getItem("selectedAge");
      if (storedAge) {
        setSelectedAge(Number(storedAge));
      } else {
        setShowAgePopup(true); // Show popup for age selection
      }
    }
  }, [isAuthenticated]);

  const handleAgeSubmit = (age) => {
    if (age >= 3 && age <= 12) {
      setSelectedAge(age);
      localStorage.setItem("selectedAge", age); // Store age in localStorage
      setShowAgePopup(false); // Close the popup
    }
  };

  const showPopupForUser = () =>{
    setShowAgePopup(true)
  }

  useEffect(() => {
    const handleSingleData = () => {
      if (!selectedChildId && childrenData.length > 0) {
        selectChild(childrenData[0].id);
        setSelectedChild(childrenData[0]);
      }
    };
    handleSingleData();
  }, [childrenData]);

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
        setSelectedAge,
        selectedDob,
        loading,
        selectedChild,
        selectedGrade,
        showPopupForUser
      }}
    >
      {loading ? <LoadingSpinner /> : children}
      {showPopup && selectedName && selectedAge && (
        <WelcomeCard
          data={{
            name: selectedName,
            age: selectedAge,
            gender: selectedGender,
          }}
        />
      )}
      {showAgePopup && (
        <AgeSelectionPopup
          onSubmit={handleAgeSubmit}
          onClose={() => setShowAgePopup(false)}
        />
      )}
    </ChildrenContext.Provider>
  );
};

export const useChildren = () => {
  return useContext(ChildrenContext);
};
