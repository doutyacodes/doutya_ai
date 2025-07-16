"use client"

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../_components/ProtectedRoute";
import { ChildrenProvider } from "@/context/CreateContext";
import Navbar from "../_components/Navbar";
import LayoutWrapper from "../_components/LayoutWrapper";
import BottomNavigation from "../_components/BottomNav";

const ProtectLayout = ({ children }) => {
const pathname = usePathname();
  const [showBottomNav, setShowBottomNav] = useState(true);

  useEffect(() => {
    // Hide bottom nav on home page ("/"), show on all other pages
    setShowBottomNav(pathname !== "/");
  }, [pathname]);

  return (
    <ProtectedRoute allowedRoutes={["/","/pricing","/our-story","/our-features","/about-us", "/contact-us", "/newsonmap", "/landing"]}>
      <ChildrenProvider>
        <div className="relative min-h-screen flex bg-white">
          {/* <SideBar /> */}

          {/* Content */}
          <LayoutWrapper >
            <Navbar />
            <div className="w-full">
              {children}
            </div>
            {showBottomNav && <BottomNavigation />}
          </LayoutWrapper>
          {/* <RightSideBar /> */}
        </div>
      </ChildrenProvider>
    </ProtectedRoute>
  );
};

export default ProtectLayout;