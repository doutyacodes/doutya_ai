"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useChildren } from "@/context/CreateContext";
import useAuth from "../hooks/useAuth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FaBox, FaGift, FaHome, FaInfoCircle, FaNewspaper, FaSearch, FaUserAlt, FaUserCircle } from "react-icons/fa";
import { IoChevronDownOutline, IoGlobeSharp } from "react-icons/io5";
import { GiBriefcase } from "react-icons/gi";
import { IoIosTrophy, IoMdGlobe } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";

const Navbar = () => {
  const { childrenData, showPopupForUser, selectedAge, loading ,selectedRegion,
    showPopupRegion} =
    useChildren();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const links = [
    { label: "News", icon: FaNewspaper, links: "/" },
    // { label: "News", icon: IoGlobeSharp, links: "/news" },
    // { label: "Careers", icon: GiBriefcase, links: "/tests" },
    // { label: "Challenges", icon: IoIosTrophy, links: "/challenges" },
    // { label: "Community", icon: FaPeopleGroup, links: "/communities" },
    { label: "Magic Box", links: "/search", icon: FaGift },
    { label: "Our Story", links: "/our-story", icon: FaInfoCircle },

  ];
  return (
    <nav
      className={cn(
        "w-full bg-transparent md:min-h-16 max-md:py-[0.8vh] border-b-4 border-orange-600 max-md:max-h-[8.5vh]"
          
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between w-full">
        <div
                onClick={() => showPopupRegion()}
                className="flex flex-col w-fit gap-[1px] items-center"
              >
                <IoMdGlobe size={28} color="#845EC2" />
                <span className="text-[1.3vh] text-blue-600 flex gap-1 items-center">
                 <span>{selectedRegion}</span>  <IoChevronDownOutline size={10} />
                </span>
              </div>
          <div className="opacity-0 text-xs">Login</div>
          <Link
            href={"/"}
            className="mx-auto flex justify-center items-center relative h-[7.6vh] w-[40vw]"
          >
            <Image
              src={"/images/logo2.png"}
              fill
              objectFit="contain"
              alt="logo"
            />
          </Link>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="max-md:mr-3">
              {/* {!isAuthenticated && (
                <Link href={"/login"} className="font-semibold">
                  Login
                </Link>
              )} */}
              {!isAuthenticated && (
                <div
                onClick={() => showPopupForUser()}
                className="flex flex-col w-fit gap-[1px] items-center"
              >
                <FaUserCircle size={28} color="#845EC2" />
                <span className="text-[1.3vh] text-blue-600 flex items-center gap-1">
                 
                  <span> Age - {selectedAge}</span>  <IoChevronDownOutline size={10} />

                </span>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden fixed z-[999999999999999999] bottom-0 left-0 bg-[#f04229] p-2 w-full flex justify-around items-center">
        {links.map(({ label, icon: Icon, links }, idx) => {
          const isActive =
            links === "/"
              ? pathname === links // Exact match for the root path
              : pathname.includes(links); // Partial match for sub-paths

          return (
            <Link
              href={links}
              key={idx}
              className={`flex flex-col items-center gap-0 ${
                (isActive || (label=="Home" && (pathname.includes("news"))))  ? "opacity-100" : "opacity-50"
              }`}
            >
              <Icon size={24} color="white" />
              <p className="text-[9px] text-white">{label}</p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
