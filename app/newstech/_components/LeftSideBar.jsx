"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSignOutAlt,
} from "react-icons/fa";
import { 
  ChevronRight, 
  Menu, 
  Map, 
  BookOpen, 
  BarChart3,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const LeftSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/newstech/logout', { method: 'GET' });
    localStorage.removeItem("token");
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.push("/newstech/login");
  };

  const navLinks = [
    {
      label: "Doutya Mapper",
      links: "/newstech/mapper",
      icon: Map,
    },
    {
      label: "Doutya Narrative",
      links: "/newstech/narrative",
      icon: BookOpen,
    },
    {
      label: "Doutya Analyse",
      links: "/newstech/analyse",
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button - Always visible on mobile */}
      <div
        onClick={toggleCollapse}
        className="block md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md text-red-800"
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!isCollapsed && (
        <div
          onClick={toggleCollapse}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <motion.div
        animate={{ 
          width: isCollapsed ? "4rem" : "14rem",
          x: isCollapsed && window.innerWidth < 768 ? -100 : 0 
        }}
        className={cn(
          "min-h-screen shadow-lg bg-[#f8f8f8] fixed left-0 top-0 z-40 flex flex-col p-3",
          "md:relative", // Make it relative on desktop
          isCollapsed ? "md:block hidden" : "block" // Hide on mobile when collapsed
        )}
        initial={{ width: "4rem" }}
      >
        {/* Sidebar Header - Collapse Toggle Button */}
        <div
          className="hidden md:flex items-center justify-center rounded-full bg-red-800 w-6 h-6 absolute -right-3 top-5 cursor-pointer"
          onClick={toggleCollapse}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-white"
          >
            <ChevronRight size={16} />
          </motion.div>
        </div>

        {/* Logo or Brand (optional) */}
        {/* <div className="mt-6 mb-8 flex justify-center">
          <div className={cn(
            "font-bold text-red-800",
            isCollapsed ? "text-sm" : "text-xl"
          )}>
            {isCollapsed ? "D" : "Doutya"}
          </div>
        </div> */}

        <div className="mt-6 mb-8 flex justify-center">

        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-3">
          {navLinks.map(({ label, icon: Icon, links }, idx) => {
            const isActive = pathname.includes(links);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={handleItemClick}
              >
                <Link
                  href={links || "/"}
                  className={cn(
                    "flex items-center p-2 rounded-lg transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-start",
                    isActive 
                      ? "bg-red-100 text-red-800" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-red-800" : "text-gray-600"}
                  />
                  <span
                    className={cn(
                      "transition-all duration-300",
                      isCollapsed ? "hidden" : "ml-3 text-sm"
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div
          onClick={() => {
            handleItemClick();
            handleLogout();
          }}
          className={cn(
            "flex items-center p-2 mt-8 mb-4 rounded-lg cursor-pointer transition-all duration-300",
            isCollapsed ? "justify-center" : "justify-start",
            "hover:bg-red-100"
          )}
        >
          <FaSignOutAlt
            size={20}
            className="text-gray-600"
          />
          <span
            className={cn(
              "transition-all duration-300 text-gray-600",
              isCollapsed ? "hidden" : "ml-3 text-sm"
            )}
          >
            Logout
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default LeftSideBar;