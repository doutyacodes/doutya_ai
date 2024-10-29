// hooks/useAuth.js
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // or wherever your token is stored
    if (token) {
      try {
        // Optionally verify the token (requires secret)
        const decoded = jwt.decode(token); // Decodes without verifying
        if (decoded) {
          // You can also perform a more thorough check here (like expiration)
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding token", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;
