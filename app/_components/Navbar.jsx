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
