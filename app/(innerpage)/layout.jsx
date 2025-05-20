// import React from "react";
// import ProtectedRoute from "../_components/ProtectedRoute";
// import { ChildrenProvider } from "@/context/CreateContext";
// import Navbar from "../_components/Navbar";
// import SideBar from "../_components/SideBar";
// import RightSideBar from "../_components/RightSideBar";
// import LayoutWrapper from "../_components/LayoutWrapper";
// import BottomNavigation from "../_components/BottomNav";

// const ProtectLayout = ({ children }) => {
//   return (
//     <ProtectedRoute allowedRoutes={["/","/search", "/our-story","/our-features","/about-us", "/contact-us", "/news-kids", "news-map", "/testing3","/news", "/newstech", "/landing"]}>
//       <ChildrenProvider>
//         <div className="relative min-h-screen flex bg-white">
//           {/* <SideBar /> */}

//           {/* Content */}
//           <LayoutWrapper >
//             <Navbar />
//             <div className="w-full">
//             {children}
//             </div>
//             <BottomNavigation />
//           </LayoutWrapper>
//           {/* <RightSideBar /> */}
//         </div>
//       </ChildrenProvider>
//     </ProtectedRoute>
//   );
// };

// export default ProtectLayout;
"use client"

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../_components/ProtectedRoute";
import { ChildrenProvider } from "@/context/CreateContext";
import Navbar from "../_components/Navbar";
import SideBar from "../_components/SideBar";
import RightSideBar from "../_components/RightSideBar";
import LayoutWrapper from "../_components/LayoutWrapper";
import BottomNavigation from "../_components/BottomNav";

const ProtectLayout = ({ children }) => {
  const pathname = usePathname();
  const [showBottomNav, setShowBottomNav] = useState(true);
  
  useEffect(() => {
    // Hide bottom nav for /news/[id] and /news-kids/[id] routes
    const isNewsDetailPage = /^\/news\/[^\/]+$/.test(pathname);
    const isKidsNewsDetailPage = /^\/news-kids\/[^\/]+$/.test(pathname);
    
    setShowBottomNav(!(isNewsDetailPage || isKidsNewsDetailPage));
  }, [pathname]);

  return (
    <ProtectedRoute allowedRoutes={["/","/search", "/our-story","/our-features","/about-us", "/contact-us", "/news-kids", "news-map", "/testing3","/news", "/newstech", "/landing"]}>
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