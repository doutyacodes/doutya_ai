"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useChildren } from "@/context/CreateContext";
import useAuth from "../hooks/useAuth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { IoGlobeSharp } from "react-icons/io5";
import { GiBriefcase } from "react-icons/gi";
import { IoIosTrophy } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";

const Navbar = () => {
  const { childrenData, showPopupForUser, selectedAge, loading } =
    useChildren();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const links = [
    { label: "Home", icon: FaHome, links: "/" },
    { label: "News", icon: IoGlobeSharp, links: "/news" },
    { label: "Careers", icon: GiBriefcase, links: "/tests" },
    { label: "Challenges", icon: IoIosTrophy, links: "/challenges" },
    { label: "Community", icon: FaPeopleGroup, links: "/communities" },
  ];
  return (
    <nav
      className={cn(
        "w-full bg-transparent ",
        pathname !== "/"
          ? "md:min-h-24 max-md:py-[0.8vh] border-b-4 border-orange-600 max-md:max-h-[8.5vh]"
          : "md:min-h-24 max-md:py-[0.8vh] max-md:max-h-[8.5vh]"
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="block absolute top-10 left-2 z-[999999999] md:hidden opacity-0">
            <Menu />
          </div>
          <div className="opacity-0">Login</div>
          <Link
            href={"/"}
            className="mx-auto flex justify-center items-center relative h-[7.6vh] w-[40vw]"
          >
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
                <div
                  onClick={() => showPopupForUser()}
                  className="flex flex-col w-fit gap-[1px] items-center "
                >
                  <div className="relative h-[5.2vh] w-[12vw]">
                    <Image
                      src={"/images/boy.png"}
                      objectFit="contain"
                      fill
                      alt={"gender"}
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
      <div className="md:hidden fixed z-[999999999999999999] bottom-1 left-0 bg-[#f04229] p-2 w-full flex justify-around items-center">
        {links.map(({ label, icon: Icon, links }, idx) => {
          const isActive =
            links === "/"
              ? pathname === links // Exact match for the root path
              : pathname.includes(links); // Partial match for sub-paths

          return (
            <Link
              href={links}
              key={idx}
              className={`flex flex-col items-center gap-0 ${
                isActive ? "opacity-100" : "opacity-50"
              }`}
            >
              <Icon size={24} color="white" />
              <p className="text-[9px] text-white">{label}</p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
