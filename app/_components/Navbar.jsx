"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Menu, Search } from "lucide-react";
import ChildSelector from "./ChildSelecter";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildGender, setNewChildGender] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const { isAuthenticated, loading, logout } = useAuth();
  const {
    childrenData,
    updateChildrenData,
    selectedChildId,
    selectChild,
    selectChildAge,
    selectChildGender,
  } = useChildren();
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setUserLoading(true);
        if (isAuthenticated && childrenData.length === 0) {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;

          const response = await GlobalApi.GetUserChildren(token);
          updateChildrenData(response.data.data);
          if (response.data.data.length > 0) {
            selectChild(response.data.data[0].id);
            selectChildAge(response.data.data[0].age);
            selectChildGender(response.data.data[0].gender);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchChildren();
  }, [
    isAuthenticated,
    childrenData,
    updateChildrenData,
    selectChild,
    selectChildAge,
  ]);

  const handleAddChild = async () => {
    try {
      await GlobalApi.AddChild({
        name: newChildName,
        gender: newChildGender,
        age: newChildAge,
      });
      setShowModal(false);
      setNewChildName("");
      setNewChildGender("");
      setNewChildAge("");

      const response = await GlobalApi.GetUserChildren();
      updateChildrenData(response.data.data);
      selectChild(response.data.data[0].id);
      selectChildAge(response.data.data[0].age);
    } catch (error) {
      console.error("Failed to add child", error);
    }
  };

  if (loading) {
    return (
      <p className="w-full bg-white shadow-md fixed top-0 left-0 z-10 h-10">
        Loading...
      </p>
    );
  }

  return (
    <nav className="w-full bg-transparent min-h-16 border-b-4 border-[#f59e1e]">
      <div className="max-w-7xl mx-auto pr-1 ">
        <div className="flex items-center justify-between w-full">
          <div
            className={cn(
              "block absolute top-10 left-2 z-[999999999] md:hidden opacity-0"
            )}
          >
            <Menu />
          </div>
          <Link href={"/"} className=" mx-auto flex justify-center items-center">
            <Image src={"/images/logo2.png"} width={120} height={120} alt="logo" />
          </Link>
          {isAuthenticated ? (
            <ChildSelector />
          ) : (
            <Link className="font-semibold" href={"/login"}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
