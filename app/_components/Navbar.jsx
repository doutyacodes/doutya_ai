"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useChildren } from "@/context/CreateContext";
import useAuth from "../hooks/useAuth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  FaBox,
  FaGift,
  FaHome,
  FaInfoCircle,
  FaNewspaper,
  FaSearch,
  FaUserAlt,
  FaUserCircle,
} from "react-icons/fa";
import { IoChevronDownOutline, IoGlobeSharp } from "react-icons/io5";
import { GiBriefcase, GiPerspectiveDiceFive } from "react-icons/gi";
import { IoIosTrophy, IoMdGlobe } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import SocialMediaNav from "./SocialMediaNav";
import FloatingBubbleNav from "./FloatingBubbleNav";

const Navbar = () => {
  const {
    childrenData,
    showPopupForUser,
    selectedAge,
    loading,
    selectedRegion,
    showPopupRegion,
  } = useChildren();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const links = [
    { label: "News", icon: GiPerspectiveDiceFive, links: "/viewpoint" },

    // { label: "News", icon: IoGlobeSharp, links: "/news" },
    // { label: "Careers", icon: GiBriefcase, links: "/tests" },
    // { label: "Challenges", icon: IoIosTrophy, links: "/challenges" },
    // { label: "Community", icon: FaPeopleGroup, links: "/communities" },
    { label: "Magic Box", links: "/search", icon: FaGift },
    { label: "Kids News", icon: FaNewspaper, links: "/news" },

    { label: "Our Story", links: "/our-story", icon: FaInfoCircle },
  ];
  return (
    <>
       <nav className={cn("w-full bg-transparent md:min-h-16 max-md:py-[0.8vh] border-b-4 border-orange-600 max-md:max-h-[8.5vh] relative")}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid items-center w-full grid-cols-3">
            {/* Logo Column */}
            <div className="flex items-center">
              <Link href="/">
                <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
                  <Image
                    src={pathname.includes("news") ? "/images/logo5.png" : 
                        pathname.includes("search") ? "/images/logo6.png" : 
                        "/images/logo4.png"}
                    fill
                    objectFit="contain"
                    alt="logo"
                    className="object-left"
                  />
                </div>
              </Link>
            </div>

            {/* Navigation Links Column - Desktop */}
            <div className="hidden md:flex justify-center items-center">
              <nav className="flex items-center space-x-8">
                <Link 
                  href="/" 
                  className="text-gray-800 hover:text-orange-600 font-medium transition-colors relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </Link>
                <Link 
                  href="/about-us" 
                  className="text-gray-800 hover:text-orange-600 font-medium transition-colors relative group"
                >
                  About Us
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </Link>
                <Link 
                  href="/contact-us" 
                  className="text-gray-800 hover:text-orange-600 font-medium transition-colors relative group"
                >
                  Contact
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </Link>
              </nav>
            </div>

            {/* Right Column - Social Media & Age Selector - Desktop Only */}
            {!loading && (
              <div className="hidden md:flex justify-end items-center max-md:mr-3">
                <div className="flex items-center gap-4">
                  {!isAuthenticated && pathname.includes("news") && (
                    <div onClick={() => showPopupForUser()} className="flex flex-col w-fit gap-[1px] items-center">
                      <span className="text-[1.5vh] font-bold text-black flex items-center gap-1">
                        <span>Age - {selectedAge}</span>
                        <IoChevronDownOutline size={10} />
                      </span>
                    </div>
                  )}
                  <SocialMediaNav />
                </div>
              </div>
            )}

            {/* Mobile Menu Button - Right aligned on mobile */}
            <div className="md:hidden col-start-3 flex justify-end">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-800 p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50">
            <div className="px-4 py-2 space-y-2">
              <Link 
                href="/" 
                className="block py-2 text-gray-800 hover:text-orange-600"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/about-us" 
                className="block py-2 text-gray-800 hover:text-orange-600"
                onClick={toggleMobileMenu}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="block py-2 text-gray-800 hover:text-orange-600"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
              
              {/* Mobile Social Media & Age Selector */}
              {!loading && !isAuthenticated && pathname.includes("news") && (
                <div className="py-2 border-t">
                  <div onClick={() => showPopupForUser()} className="flex items-center gap-1">
                    <span className="text-[1.5vh] font-bold text-black">
                      Age - {selectedAge}
                    </span>
                    <IoChevronDownOutline size={10} />
                  </div>
                </div>
              )}
              <div className="py-2">
                <SocialMediaNav />
              </div>
            </div>
          </div>
        )}
      </nav>
      <FloatingBubbleNav />
    </>
  );
};

export default Navbar;
