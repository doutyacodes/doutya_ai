"use client";
import React from "react";
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
  const links = [
    { label: "News", icon: GiPerspectiveDiceFive, links: "/viewpoint" },
    { label: "Magic Box", links: "/search", icon: FaGift },
    { label: "Kids News", icon: FaNewspaper, links: "/news" },

    { label: "Our Story", links: "/our-story", icon: FaInfoCircle },
  ];
  return (
    <>
      <nav
        className={cn(
          "w-full bg-transparent md:min-h-16 max-md:py-[0.8vh] border-b-4 border-orange-600 max-md:max-h-[8.5vh]"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid items-center w-full grid-cols-2">
            <div className="flex justify-center items-center">
              <div>
                <Link
                  href={"/"}
                  className="mx-auto flex justify-center items-center relative h-[7.6vh] w-[40vw] md:h-[9vh] md:w-[50vw]"
                >
                  <Image
                    src={pathname.includes("news") ? "/images/logo5.png" :pathname.includes("search") ? "/images/logo6.png" : "/images/logo4.png"}
                    fill
                    objectFit="contain"
                    alt="logo"
                  />
                </Link>
              </div>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="max-md:mr-3 w-full justify-end items-center flex">
                <div className="flex items-center gap-4">
                  {!isAuthenticated && pathname.includes("news") && (
                    <div onClick={() => showPopupForUser()} className="flex flex-col w-fit gap-[1px] items-center">
                      <span className="text-[1.5vh] font-bold text-black flex items-center gap-1">
                        <span> Age - {selectedAge}</span>{" "}
                        <IoChevronDownOutline size={10} />
                      </span>
                    </div>
                  )}
                  <SocialMediaNav />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <FloatingBubbleNav />
    </>
  );
};

export default Navbar;
