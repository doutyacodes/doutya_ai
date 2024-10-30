import React from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { ChildrenProvider } from "@/context/CreateContext";
import Navbar from "../_components/Navbar";

const ProtectLayout = ({ children }) => {
  return (
    <ProtectedRoute allowedRoutes={["/"]}>
      <ChildrenProvider>
        <div className="min-h-screen bg-gradient-to-br from-[#1e5f9f] via-[#40cb9f] to-[#1e5f9f] pt-20">
          <Navbar />
          {children}
        </div>
      </ChildrenProvider>
    </ProtectedRoute>
  );
};

export default ProtectLayout;
