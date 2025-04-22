"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import SocialMediaNav from "./SocialMediaNav";
import FloatingBubbleNav from "./FloatingBubbleNav";
import { ChevronDown, Info, Mail, MoreVertical, Menu, Home, Users, } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if we're in the kids section
  const isKidsSection = pathname.startsWith("/news");


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

  const NavDropdownAlt = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-800 transition-all duration-200"
        >
          <Menu 
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right ring-1 ring-black ring-opacity-5">
            <div className="absolute right-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5" />
            
            <div className="relative bg-white rounded-lg">
              <Link 
                href="/about-us"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
              >
                <Info className="w-4 h-4" />
                <span className="font-medium">About Us</span>
              </Link>
              
              <Link 
                href="/contact-us"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
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

  // Desktop toggle with text
  const DesktopZeaserKidsToggle = () => {
    return (
      <Link 
        href={isKidsSection ? "/viewpoint" : "/news"}
        className={`flex items-center justify-center p-1 rounded-full border-2 overflow-hidden ${
          isKidsSection 
            ? "bg-red-100 border-red-300" 
            : "border-gray-200 hover:border-red-200 hover:bg-red-50"
        } transition-all duration-200`}
        aria-label={isKidsSection ? "Go to Zeaser Home" : "Go to Zeaser Kids"}
      >
        <div className="relative h-16 w-60">
          <Image
            src={isKidsSection ? "/images/logo2.png" : "/images/logo5.jpg"}
            fill
            objectFit="contain"
            alt={isKidsSection ? "Zeaser Home logo" : "Zeaser Kids logo"}
          />
        </div>
      </Link>
    );
  };
  
  // // Mobile toggle with icons
  // const MobileZeaserKidsToggle = () => {
  //   return (
  //     <Link 
  //       href={isKidsSection ? "/viewpoint" : "/news"}
  //       className={`flex items-center justify-center w-8 h-8 rounded-full ${
  //         isKidsSection 
  //           ? "bg-orange-100 text-orange-600 border border-orange-300" 
  //           : "hover:bg-orange-50 text-gray-700 hover:text-orange-500 border border-gray-200"
  //       } transition-all duration-200`}
  //       aria-label={isKidsSection ? "Go to Zeaser Home" : "Go to Zeaser Kids"}
  //     >
  //       {isKidsSection ? (
  //         <Home className="w-4 h-4" />
  //       ) : (
  //        <Users className="w-4 h-4" />
  //       )}
  //     </Link>
  //   );
  // };

  const MobileZeaserKidsToggle = () => {
    return (
      <Link 
        href={isKidsSection ? "/viewpoint" : "/news"}
        className={`flex items-center justify-center rounded-full ${
          isKidsSection 
            ? "bg-red-100 border-1" 
            : "border-2 border-red-300 hover:bg-red-50"
        } transition-all duration-200 overflow-hidden`}
        aria-label={isKidsSection ? "Go to Zeaser Home" : "Go to Zeaser Kids"}
      >
        <div className="relative h-8 w-20">
          <Image
            src={isKidsSection ? "/images/logo2.png" : "/images/logo5.jpg"}
            fill
            objectFit="contain"
            alt={isKidsSection ? "Zeaser Home logo" : "Zeaser Kids logo"}
          />
        </div>
      </Link>
    );
  };
  
  return (
    <>
      <nav className={cn("w-full bg-transparent md:min-h-16 max-md:py-[0.8vh]  max-md:max-h-[8.5vh] relative")}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative grid items-center w-full md:grid-cols-3">
            {/* Left Column - Kids Toggle (Desktop) */}
            <div className="hidden md:flex items-center">
              <DesktopZeaserKidsToggle />
            </div>
            
            {/* Logo Column with Mobile Toggle on Left */}
            <div className="flex items-center justify-center relative">
              {/* Mobile Kids Toggle - Left of Logo */}
              <div className="md:hidden absolute left-0">
                <MobileZeaserKidsToggle />
              </div>
              
              <Link href="/">
                <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
                  <Image
                    src={isKidsSection ? "/images/logo5.jpg" : "/images/logo2.png"}
                    fill
                    objectFit="contain"
                    alt={isKidsSection ? "Zeaser Kids logo" : "Zeaser logo"}
                    className="object-center"
                  />
                </div>
              </Link>
            </div>

            {/* Social Media Column - Desktop Only */}
            <div className="hidden md:flex justify-end items-center">
              <div className="flex items-center gap-4">
                <SocialMediaNav />
                <NavDropdownAlt />
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