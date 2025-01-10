"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import SocialMediaNav from "./SocialMediaNav";
import FloatingBubbleNav from "./FloatingBubbleNav";
import { ChevronDown, Info, Mail, MoreVertical, Menu as MenuIcon, Menu } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const NavDropdown = () => {
  
    return (
      <div className="relative">
        {/* Option 1: Using a "More" icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all duration-200"
          aria-label="Additional navigation"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
  
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right ring-1 ring-black ring-opacity-5">
            {/* Decorative pointer */}
            <div className="absolute right-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5" />
            
            <div className="relative bg-white rounded-lg">
              <Link 
                href="/about"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
              >
                <Info className="w-4 h-4" />
                <span className="font-medium">About Us</span>
              </Link>
              
              <Link 
                href="/contact"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Contact Us</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  {/* Option 2: Using an elegant button */}
  const NavDropdownAlt = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-orange-500 transition-all duration-200"
        >
          {/* <span className="text-sm font-medium">More</span> */}
          <Menu 
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right ring-1 ring-black ring-opacity-5">
            <div className="absolute right-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5" />
            
            <div className="relative bg-white rounded-lg">
              <Link 
                href="/about-us"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
              >
                <Info className="w-4 h-4" />
                <span className="font-medium">About Us</span>
              </Link>
              
              <Link 
                href="/contact-us"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Contact Us</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <nav className={cn("w-full bg-transparent md:min-h-16 max-md:py-[0.8vh] border-b-4 border-orange-600 max-md:max-h-[8.5vh] relative")}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative grid items-center w-full md:grid-cols-3">
            {/* Empty Left Column for Desktop */}
            <div className="hidden md:block" />
            
            {/* Logo Column - Centered */}
            <div className="flex items-center justify-center">
              <Link href="/">
                <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
                  <Image
                    src={pathname.includes("news") ? "/images/logo5.png" : 
                        pathname.includes("search") ? "/images/logo6.png" : 
                        "/images/logo4.png"}
                    fill
                    objectFit="contain"
                    alt="logo"
                    className="object-center"
                  />
                </div>
              </Link>
            </div>

            {/* Social Media Column - Desktop Only */}
            <div className="hidden md:flex justify-end items-center">
              <div className="flex items-center gap-4">
                <SocialMediaNav />
                <NavDropdownAlt /> {/* or <NavDropdownAlt /> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <FloatingBubbleNav />
    </>
  );
};

export default Navbar;
