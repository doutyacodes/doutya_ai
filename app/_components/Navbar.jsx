"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useChildren } from "@/context/CreateContext";
import useAuth from "../hooks/useAuth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { childrenData, showPopupForUser,selectedAge, loading } = useChildren();
  const { isAuthenticated, } = useAuth();
const pathname = usePathname()
  return (
    <nav className={cn("w-full bg-transparent ",pathname!=="/" ? "md:min-h-24 max-md:py-[0.8vh] border-b-4 border-orange-600 max-md:max-h-[8.5vh]" : "md:min-h-24 max-md:py-[0.8vh] max-md:max-h-[8.5vh]")}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="block absolute top-10 left-2 z-[999999999] md:hidden opacity-0">
            <Menu />
          </div>
          <div className="opacity-0">
          Login
          </div>
          <Link href={"/"} className="mx-auto flex justify-center items-center relative h-[7.6vh] w-[40vw]">
            <Image
              src={"/images/logo2.png"}
              fill
              objectFit="contain"
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
                  <div className="relative h-[5.2vh] w-[12vw]">

                <Image
                  src={
                    "/images/boy.png"
                      
                  }
                  objectFit="contain"
                  fill
                  alt={ "gender"}
                />
                  </div>
                <span className="text-[1.3vh] text-blue-600">
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
