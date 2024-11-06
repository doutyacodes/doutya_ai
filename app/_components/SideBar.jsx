"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaBook,
  FaTasks,
  FaUserFriends,
  FaMedal,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "../hooks/useAuth";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const { isAuthenticated, loading, logout } = useAuth();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = () => {
    setIsCollapsed(true);
  };

  const navLinks = [
    { label: "Search", links: "/", icon: FaSearch },
    { label: "Learn", links: "/learn", icon: FaBook },
    { label: "Tests", links: "/tests", icon: FaTasks },
    { label: "Activities", links: "/activities", icon: FaUserFriends },
    { label: "Communities", links: "/communities", icon: FaUserFriends },
    // { label: "My Badges", links: "/badges", icon: FaMedal },
    // { label: "My Searches", links: "/my-search", icon: FaHistory },
    // { label: "My Profile", links: "/my-profile", icon: FaUser },
    { label: "Settings", links: "/settings", icon: FaCog },
  ];

  return (
    <>
      <div
        onClick={toggleCollapse}
        className={cn(
          "",
          isCollapsed
            ? "block absolute top-7 left-3 z-[999999999] md:hidden"
            : "hidden"
        )}
      >
        <Menu />
      </div>
      {!isCollapsed && (
        <div
          onClick={toggleCollapse}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] md:hidden"
        />
      )}
      <motion.div
        animate={{ width: isCollapsed ? "6rem" : "14rem" }}
        className={cn(
          "min-h-screen shadow-lg bg-[#f8f8f8]  max-md:fixed z-[9999999] flex flex-col p-3 rounded-md lg:block ",
          isCollapsed ? "hidden" : "flex"
        )}
        initial={{ width: "6rem" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: isCollapsed ? 1 : 1 }}
            animate={{ opacity: isCollapsed ? 1 : 1 }}
            className="text-2xl font-bold text-blue-600"
          >
            {isCollapsed ? (
              <Image
                onClick={toggleCollapse}
                src={"/images/logo.png"}
                alt="logo"
                width={60}
                height={60}
              />
            ) : (
              <Image
                src={"/images/logo2.png"}
                alt="logo"
                width={120}
                height={120}
                className=""
              />
            )}
          </motion.div>
          {/* {!isCollapsed && (
            <button onClick={toggleCollapse} className="ml-auto p-1">
              ➡️
            </button>
          )} */}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-8 space-y-4">
          {navLinks.map(({ label, icon: Icon, links }, idx) => {
            const isActive =
              links === "/"
                ? pathname === links // Exact match for the root path
                : pathname.includes(links); // Partial match for other links
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={handleItemClick} // Collapse sidebar when item is clicked
              >
                <Link
                  href={links || "/"}
                  className={cn(
                    "flex items-center p-2 hover:bg-blue-100 rounded-lg cursor-pointer",
                    isCollapsed ? "flex-col justify-center gap-2" : "flex-row"
                  )}
                >
                  <Icon
                    size={24}
                    className={isActive ? "text-red-500" : "text-black"}
                  />
                  <span
                    className={`ml-3 ${
                      isCollapsed ? "text-[10px] text-nowrap" : "block"
                    } transition-all duration-300 ${
                      isActive ? "text-red-500" : ""
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
          {/* {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: navLinks.length * 0.1 }}
              onClick={logout}
              className={cn(
                "flex items-center p-2 hover:bg-blue-100 rounded-lg cursor-pointer",
                isCollapsed ? "flex-col justify-center gap-2" : "flex-row"
              )}
            >
              <FaSignOutAlt size={24} className="text-black" />
              <span
                    className={`ml-3 ${
                      isCollapsed ? "text-[10px] text-nowrap " : "block"
                    } transition-all duration-300 `}
                  >
                Sign Out
              </span>
            </motion.div>
          )} */}
        </nav>
      </motion.div>
    </>
  );
};

export default SideBar;
