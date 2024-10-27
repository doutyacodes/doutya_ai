"use client"
import Link from 'next/link';
import React, { useState } from 'react'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-orange-600">Doutya Ai</h1>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#products" className="text-gray-700 hover:text-orange-600">
                  Products
                </a>
                <a href="#faq" className="text-gray-700 hover:text-orange-600">
                  FAQ
                </a>
                <a href="#about" className="text-gray-700 hover:text-orange-600">
                  About
                </a>
                <Link href="/testing" className="text-gray-700 hover:text-orange-600">
                  Test Voice
                </Link>
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
                <a
                  href="#products"
                  className="block px-4 py-2 text-gray-700 hover:text-orange-600"
                >
                  Products
                </a>
                <a
                  href="#faq"
                  className="block px-4 py-2 text-gray-700 hover:text-orange-600"
                >
                  FAQ
                </a>
                <a
                  href="#about"
                  className="block px-4 py-2 text-gray-700 hover:text-orange-600"
                >
                  About
                </a>
                <Link
                  href="/testing"
                  className="block px-4 py-2 text-gray-700 hover:text-orange-600"
                >
                  Test Voice
                </Link>
              </div>
            )}
          </div>
        </nav>
      )
}

export default Navbar