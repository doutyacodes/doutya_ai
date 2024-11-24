"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useChildren } from "@/context/CreateContext";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { childrenData, showPopupForUser,selectedAge, loading } = useChildren();
  const { isAuthenticated, } = useAuth();

  return (
    <nav className="w-full bg-transparent min-h-16 border-b-4 border-[#f59e1e]">
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
              width={110}
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
                <div onClick={()=>showPopupForUser()} className="flex flex-col w-fit gap-[1px] items-center ">
                <Image
                  src={
                    "/images/boy.png"
                      
                  }
                  width={32}
                  height={32}
                  alt={ "gender"}
                />
                <span className="text-[9px] text-blue-600">
                  Guest, {selectedAge}
                </span>
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
