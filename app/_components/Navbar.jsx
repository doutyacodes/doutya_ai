"use client";
import Link from "next/link";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth(); // Assuming logout is part of your useAuth hook

  if (loading) {
    return (
      <p className="w-full bg-white shadow-md fixed top-0 left-0 z-10 h-10">
        Loading...
      </p>
    ); // or a spinner component
  }

  return (
    <nav className="w-full md:bg-transparent bg-white max-md:shadow-md fixed top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-600">Doutya Ai</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#products" className="text-white max-md:text-gray-700 hover:text-orange-600">
              Products
            </a>
            <a href="#faq" className="text-white max-md:text-gray-700 hover:text-orange-600">
              FAQ
            </a>
            <a href="#about" className="text-white max-md:text-gray-700 hover:text-orange-600">
              About
            </a>
            <Link href="/testing" className="text-white max-md:text-gray-700 hover:text-orange-600">
              Test Voice
            </Link>

            {/* {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-white bg-red-600 py-3 px-7 rounded-md font-bold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/signup"
                className="text-white bg-orange-600 py-3 px-7 rounded-md font-bold"
              >
                Get Started
              </Link>
            )} */}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <a href="#products" className="block px-4 py-2 text-gray-700 hover:text-orange-600">
              Products
            </a>
            <a href="#faq" className="block px-4 py-2 text-gray-700 hover:text-orange-600">
              FAQ
            </a>
            <a href="#about" className="block px-4 py-2 text-gray-700 hover:text-orange-600">
              About
            </a>
            <Link href="/testing" className="block px-4 py-2 text-gray-700 hover:text-orange-600">
              Test Voice
            </Link>
            
            {/* {isAuthenticated ? (
              <button
                onClick={logout}
                className="block px-4 py-2 text-white bg-red-600 rounded-md font-bold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/signup"
                className="block px-4 py-2 text-white bg-orange-600 rounded-md font-bold"
              >
                Get Started
              </Link>
            )} */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
