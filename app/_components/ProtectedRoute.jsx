"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, allowedRoutes = [] }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAllowed = 
      allowedRoutes.includes(pathname) || pathname.startsWith("/learn/")|| pathname.startsWith("/kids/")|| pathname.startsWith("/news/") || pathname.startsWith("/newsonmap") || pathname.startsWith("/newstech") || pathname.startsWith("/nearby");

      console.log("isAuthenticated", isAuthenticated, "isAllowed", isAllowed)

    if (!loading && !isAuthenticated && !isAllowed) {
      console.log("Redirecting...")
      router.replace("/login"); // Redirect to login page
    }
  }, [isAuthenticated, loading, pathname, router, allowedRoutes]);

  if (loading) {
    return <LoadingSpinner />; // Optionally, add a loading spinner
  }

  const isAllowed = 
    allowedRoutes.includes(pathname) || pathname.startsWith("/learn/")|| pathname.startsWith("/kids/")|| pathname.startsWith("/news/") || pathname.startsWith("/newsonmap") || pathname.startsWith("/newstech") || pathname.startsWith("/nearby");

  return isAuthenticated || isAllowed ? children : null;
};

export default ProtectedRoute;
