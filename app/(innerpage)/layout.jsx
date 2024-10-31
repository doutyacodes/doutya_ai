import React from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { ChildrenProvider } from "@/context/CreateContext";
import Navbar from "../_components/Navbar";

const ProtectLayout = ({ children }) => {
  return (
    <ProtectedRoute allowedRoutes={["/","/our-story","/about-us"]}>
      <ChildrenProvider>
        <div className="relative min-h-screen  pt-14 bg-gradient-to-br from-[#1e5f9f] via-[#40cb9f] to-[#1e5f9f]">
        
          {/* Content */}
          <div className="relative z-10">
            <Navbar />
            {children}
          </div>
        </div>
      </ChildrenProvider>
    </ProtectedRoute>
  );
};

export default ProtectLayout;
