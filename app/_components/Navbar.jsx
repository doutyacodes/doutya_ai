"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildGender, setNewChildGender] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const { isAuthenticated, loading, logout } = useAuth();
  const {
    childrenData,
    updateChildrenData,
    selectedChildId,
    selectChild,
    selectChildAge,
    selectChildGender
  } = useChildren();
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setUserLoading(true);
        if (isAuthenticated && childrenData.length === 0) {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

          const response = await GlobalApi.GetUserChildren(token);
          updateChildrenData(response.data.data);
          if (response.data.data.length > 0) {
            selectChild(response.data.data[0].id);
            selectChildAge(response.data.data[0].age);
            selectChildGender(response.data.data[0].gender);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchChildren();
  }, [isAuthenticated, childrenData, updateChildrenData, selectChild, selectChildAge]);

  const handleAddChild = async () => {
    try {
      await GlobalApi.AddChild({
        name: newChildName,
        gender: newChildGender,
        age: newChildAge,
      });
      setShowModal(false);
      setNewChildName("");
      setNewChildGender("");
      setNewChildAge("");

      const response = await GlobalApi.GetUserChildren();
      updateChildrenData(response.data.data);
      selectChild(response.data.data[0].id);
      selectChildAge(response.data.data[0].age);
    } catch (error) {
      console.error("Failed to add child", error);
    }
  };

  if (loading) {
    return (
      <p className="w-full bg-white shadow-md fixed top-0 left-0 z-10 h-10">
        Loading...
      </p>
    );
  }

  return (
    <nav className="w-full md:bg-transparent  md:fixed top-0 left-0 z-10 md:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center md:justify-between justify-center">
          <div className="flex items-center max-md:justify-center max-md:mt-4">
            <Image src={"/images/logo.png"} width={150} height={150} alt="logo" />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link href="/" className="block px-4 py-2 text-white hover:text-orange-600">Home</Link>
                <Link href="/my-search" className="block px-4 py-2 text-white hover:text-orange-600">Search History</Link>
                <Link href="/add-child" className="block px-4 py-2 text-white hover:text-orange-600">Add Child</Link>
              </>
            ) : (
              <>
                <Link href="/about-us" className="block px-4 py-2 text-white hover:text-orange-600">About Us</Link>
                <Link href="/our-story" className="block px-4 py-2 text-white hover:text-orange-600">Our Story</Link>
                {/* <Link href="/contact-us" className="block px-4 py-2 text-white hover:text-orange-600">Contact Us</Link> */}
              </>
            )}
            {isAuthenticated ? (
              <button onClick={logout} className="block px-4 py-2 text-white hover:text-orange-600">Logout</button>
            ) : (
              <Link href="/login" className="block px-4 py-2 text-white hover:text-orange-600">Login</Link>
            )}
          </div>
          <div className="md:hidden ml-auto">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-orange-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
<div>
  {/* Overlay for Sidebar */}
  <div
    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
      isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    } z-10`}
    onClick={() => setIsMenuOpen(false)}
  ></div>

  {/* Sidebar */}
  <div
    className={`fixed inset-y-0 left-0 bg-gradient-to-b from-green-300 to-blue-300 w-64 transform ${
      isMenuOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-300 ease-in-out z-20 shadow-lg rounded-r-2xl`}
  >
    <div className="p-8 text-white font-semibold">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Menu</h2>
      </div>

      {isAuthenticated ? (
        <>
          <Link href="/" className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">
            Home
          </Link>
          <Link href="/my-search" className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">
            Search History
          </Link>
          <Link href="/add-child" className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">
            Add Child
          </Link>
        </>
      ) : (
        <>
          <Link href="/about-us" className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">
            About Us
          </Link>
          <Link href="/our-story" className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">
            Our Story
          </Link>
          {/* <Link href="/contact-us" className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">
            Contact Us
          </Link> */}
        </>
      )}
       {isAuthenticated ? (
              <button onClick={logout} className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">Logout</button>
            ) : (
              <Link href="/login" className="block px-4 py-2 mt-2 rounded-lg bg-white/15 bg-opacity-20 hover:bg-opacity-40 transition-colors duration-300">Login</Link>
            )}
    </div>
  </div>
</div>


      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Add New Child</h2>
            <div>
              <label className="block mb-2">Name:</label>
              <input type="text" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} className="border rounded-md p-2 w-full mb-4" required />
              <label className="block mb-2">Gender:</label>
              <select value={newChildGender} onChange={(e) => setNewChildGender(e.target.value)} className="border rounded-md p-2 w-full mb-4">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <label className="block mb-2">Age:</label>
              <input type="number" value={newChildAge} onChange={(e) => setNewChildAge(e.target.value)} className="border rounded-md p-2 w-full mb-4" required />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setShowModal(false)} className="bg-gray-300 rounded-md px-4 py-2">Cancel</button>
              <button onClick={handleAddChild} className="bg-blue-600 text-white rounded-md px-4 py-2">Add</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
