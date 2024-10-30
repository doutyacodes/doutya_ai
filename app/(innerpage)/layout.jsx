import React from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { ChildrenProvider } from "@/context/CreateContext";
import Navbar from "../_components/Navbar";

const ProtectLayout = ({ children }) => {
  return (
    <ProtectedRoute allowedRoutes={["/","/our-story"]}>
      <ChildrenProvider>
        <div className="relative min-h-screen md:pt-30 overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/videos/bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay to darken the background video (optional) */}
          {/* <div className="absolute inset-0 bg-black"></div> */}
          
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
