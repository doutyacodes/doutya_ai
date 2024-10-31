"use client";
import React from "react";
import { useChildren } from "@/context/CreateContext";
import Image from "next/image";

const ChildSelector = () => {
  const {
    childrenData,
    selectedChildId,
    selectChild,
    selectedGender,
  } = useChildren();

  // Check if there are any childrenData and if selectedChildId is set
  if (!childrenData || childrenData.length === 0) {
    return <p></p>;
  }

  return (
    <div className="flex max-w-3xl gap-4 items-center">
      <Image
        src={selectedGender === "male" ? "/images/boy.png" : "/images/girl.png"}
        width={50}
        height={50}
        alt={selectedGender || "gender"}
      />
      <select
        value={selectedChildId || ""}
        onChange={(e) => selectChild(e.target.value)}
        className="bg-transparent text-white rounded-md px-3 py-2 mb-2 w-full"
      >
        {childrenData.map((child) => (
          <option className="text-black" key={child.id} value={child.id}>
            {child.name} (Age: {child.age})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChildSelector;
