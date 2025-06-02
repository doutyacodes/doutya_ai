"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ChevronDown, Info, Mail, MoreVertical, Menu, Home, Users, Newspaper, } from 'lucide-react';
import SocialMediaNav from "@/app/_components/SocialMediaNav";
import FloatingBubbleNav from "@/app/_components/FloatingBubbleNav";

const Nav = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedAge, setSelectedAge] = useState(() => {
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedAge') || '6';
    }
    return '6'; // Default age if not in browser or no stored age
  });
  
  // Check if we're in the kids section
  const isKidsSection = pathname.startsWith("/kids");
  // Check if we're in the maps section
  const isMapsSection = pathname.startsWith("/newsonmap");

const NavDropdownAlt = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    
    // Check if the current path is in the NewsTeach section
    const isNewsTechPath = pathname?.includes("/newstech");

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
                {isNewsTechPath ? (
                <Link 
                    href="/newstech"
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
                >
                    <Home className="w-4 h-4" />
                    <span className="font-medium">Doutya Home</span>
                </Link>
                ) : (
                <Link 
                    href="/newstech"
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
                >
                    <Newspaper className="w-4 h-4" />
                    <span className="font-medium">NewsTech</span>
                </Link>
                )}

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

  const AgeSelector = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleAgeChange = (age) => {
      localStorage.setItem('selectedAge', age);
      setSelectedAge(age);
      setIsDropdownOpen(false);
      // Reload the page to fetch new data
      window.location.reload();
    };
  
    const ages = Array.from({length: 10}, (_, i) => i + 4); // Creates array [4,5,...13]
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-400 text-red-800 hover:border-red-500 hover:text-red-900 transition-all duration-200"
        >
          <span className="text-sm font-medium">Age: {selectedAge}</span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
  
        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-left ring-1 ring-black ring-opacity-5">
            <div className="absolute left-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5" />
            
            <div className="relative bg-white rounded-lg max-h-48 overflow-y-auto">
              {ages.map((age) => (
                <button
                  key={age}
                  onClick={() => handleAgeChange(age.toString())}
                  className={`w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200 ${
                    selectedAge === age.toString() ? 'bg-red-200 text-red-800 font-semibold' : 'hover:bg-red-100 hover:text-red-700'
                  }`}
                >
                  <span>{age}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Function to determine which logo to show in the center
  const getMainLogo = () => {
    if (isMapsSection) {
      return (
        <div className="flex flex-col items-center">
          <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
            <Image
              src="/images/newsmap.png"
              fill
              objectFit="contain"
              alt="Doutya logo"
              className="object-center"
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
        <Image
          src={isKidsSection ? "/images/logo5.png" : "/images/logo2.png"}
          fill
          objectFit="contain"
          alt={isKidsSection ? "Doutya Kids logo" : "Doutya logo"}
          className="object-center"
        />
      </div>
    );
  };
  
  return (
    <>
      <nav className={cn("w-full bg-white md:min-h-16 max-md:py-[0.8vh] max-md:max-h-[8.5vh] relative border-b-4 border-red-800/80 shadow-sm")}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative grid items-center w-full md:grid-cols-3">
            {/* Left Column - Empty space to maintain layout (previously Kids Toggle) */}
            <div className="hidden md:flex items-center justify-start">
              {/* DesktopDoutyaKidsToggle is commented out but space is maintained */}
                {isKidsSection && !isMapsSection && <AgeSelector />}
            </div>
            
            {/* Logo Column with Mobile Age Selector on Left */}
            <div className="flex items-center justify-center relative">
              {/* Mobile Age Selector - Left of Logo */}
              <div className="md:hidden absolute left-0">
                {isKidsSection && !isMapsSection && <AgeSelector />}
              </div>
              
              <Link href="/">
                {getMainLogo()}
              </Link>
              
              {/* Mobile Menu Button - Right of Logo */}
              <div className="md:hidden absolute right-0">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="bg-red-900 text-white p-1.5 rounded-full shadow-md hover:bg-red-800 transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                >
                  <Menu size={18} />
                </button>
                <FloatingBubbleNav showMenu={isMobileMenuOpen} setShowMenu={setIsMobileMenuOpen} />
              </div>
            </div>

            {/* Social Media Column - Desktop Only */}
            <div className="hidden md:flex justify-end items-center">
              <div className="flex items-center gap-4">
                {/* {isKidsSection && !isMapsSection && <AgeSelector />} */}
                <SocialMediaNav />
                <NavDropdownAlt />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;