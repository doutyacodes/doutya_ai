"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useChildren } from "@/context/CreateContext";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { childrenData, selectedName, loading } = useChildren();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="w-full bg-transparent min-h-12 border-b-4 border-[#f59e1e]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="block absolute top-10 left-2 z-[999999999] md:hidden opacity-0">
            <Menu />
          </div>
          <div className="opacity-0">
          Login
          </div>
          <Link href={"/"} className="mx-auto flex justify-center items-center">
            <Image
              src={"/images/logo2.png"}
              width={90}
              height={120}
              alt="logo"
            />
          </Link>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {/* {!isAuthenticated && (
                <Link href={"/login"} className="font-semibold">
                  Login
                </Link>
              )} */}
              {!isAuthenticated && (
                <div  className="font-semibold opacity-0">
                  Login
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
