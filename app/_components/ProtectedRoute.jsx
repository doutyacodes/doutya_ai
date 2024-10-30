"use client"
// components/ProtectedRoute.js

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login"); // Redirect to login page
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingSpinner />; // Optionally, add a loading spinner
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
