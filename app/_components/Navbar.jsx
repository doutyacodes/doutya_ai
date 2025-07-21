"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import SocialMediaNav from "./SocialMediaNav";
import FloatingBubbleNav from "./FloatingBubbleNav";
import {
  ChevronDown,
  Info,
  Mail,
  MoreVertical,
  Menu,
  Home,
  Users,
  Newspaper,
  PenLine,
  Crown,
  Star,
  Shield,
  Loader2,
} from "lucide-react";
import { useChildren } from "@/context/CreateContext";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState(null);

  const {
    getCurrentAge,
    updateSelectedAge,
    clearSelectedAge,
    showPopupForUser,
  } = useChildren();

  const selectedAge = getCurrentAge();

  // Check if we're in the kids section
  const isKidsSection = pathname.startsWith("/kids");
  // Check if we're in the maps section
  const isMapsSection = pathname.startsWith("/newsonmap");
  const isHyperlocalSection = pathname.startsWith("/nearby");
  const isNewsSection = pathname === "/news";

  // Fetch user plan data
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        setPlanLoading(true);
        setPlanError(null);
        const token = localStorage.getItem('user_token');
        if (!token) {
          // If no token, user is not logged in - don't show plan
          setPlanLoading(false);
          return;
        }

        const response = await fetch('/api/user/plan', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUserPlan(data);
        } else if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('user_token');
          setUserPlan(null);
        } else {
          const errorData = await response.json();
          setPlanError(errorData.message || 'Failed to fetch plan');
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
        setPlanError('Network error');
      } finally {
        setPlanLoading(false);
      }
    };

    fetchUserPlan();
  }, [pathname]);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Plan indicator component with real data
 // Plan indicator component with real data
const PlanIndicator = () => {
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);

  // Don't show anything while loading or if there's an error or no user
  if (planLoading || planError || !userPlan) {
    return null;
  }

  const planDetails = userPlan.plan_details;

  // Icon mapping
  const iconMap = {
    Shield: Shield,
    Star: Star,
    Crown: Crown,
  };

  const IconComponent = iconMap[planDetails.icon] || Shield;

  const handlePlanNavigation = (path) => {
    setIsPlanDropdownOpen(false);
    window.location.href = path;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer",
          planDetails.color,
          planDetails.hover_color
        )}
        title={`${planDetails.display_name} Plan - ${userPlan.exam_type?.name || 'No exam selected'}`}
      >
        <IconComponent className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{planDetails.display_name}</span>
        <span className="sm:hidden">{planDetails.display_name.charAt(0)}</span>
        {userPlan.exam_type && (
          <span className="hidden md:inline text-xs opacity-75">
            • {userPlan.exam_type.name}
          </span>
        )}
      </button>

      {isPlanDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right ring-1 ring-black ring-opacity-5">
          <div className="absolute right-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5" />

          <div className="relative bg-white rounded-lg">
            <button
              onClick={() => handlePlanNavigation('/upgrade-plan')}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200 w-full text-left"
            >
              <Crown className="w-4 h-4" />
              <span className="font-medium">Upgrade Plan</span>
            </button>

            <button
              onClick={() => handlePlanNavigation('/chat')}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200 w-full text-left"
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isPlanDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsPlanDropdownOpen(false)}
        />
      )}
    </div>
  );
};

  // Loading indicator for plan
  const PlanLoadingIndicator = () => {
    if (!planLoading) return null;

    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 text-xs font-medium">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden sm:inline text-gray-500">Loading...</span>
      </div>
    );
  };

  const NavDropdownAlt = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-800 transition-all duration-200"
        >
          <Menu
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right ring-1 ring-black ring-opacity-5">
            <div className="absolute right-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5" />

            <div className="relative bg-white rounded-lg">
              <Link
                href="/about-us"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
              >
                <Info className="w-4 h-4" />
                <span className="font-medium">About Us</span>
              </Link>

              <Link
                href="/contact-us"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Contact Us</span>
              </Link>

              {/* Show plan details in dropdown for mobile */}
              {userPlan && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-4 py-2.5">
                    <div className="text-xs text-gray-500 mb-1">Current Plan</div>
                    <div className="font-medium text-gray-800">
                      {userPlan.plan_details.display_name}
                      {userPlan.exam_type && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({userPlan.exam_type.name})
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AgeSelector = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleAgeChange = (age) => {
      localStorage.setItem("selectedAge", age);
      updateSelectedAge(age);
      setIsDropdownOpen(false);
      // Reload the page to fetch new data
      window.location.reload();
    };

    const ages = Array.from({ length: 8 }, (_, i) => i + 6); // Creates array [6,7,...13]
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full  text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-300 hover:border-transparent group"
        >
          <span className="text-xs md:text-sm font-medium group-hover:text-gray-800">
            Age: {selectedAge}
          </span>
          <ChevronDown
            className={`w-3 h-3 md:w-4 md:h-4 text-gray-600 group-hover:text-gray-800 transition-all duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 mt-1 md:mt-2 w-24 md:w-32 bg-white rounded-lg shadow-lg py-1 md:py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-left ring-1 ring-black ring-opacity-5">
            <div className="absolute left-2 md:left-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5" />

            <div className="relative bg-white rounded-lg max-h-32 md:max-h-48 overflow-y-auto">
              {ages.map((age) => (
                <button
                  key={age}
                  onClick={() => handleAgeChange(age.toString())}
                  className={`w-full text-left flex items-center gap-2 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 ${
                    selectedAge === age.toString()
                      ? "bg-gray-200 text-gray-800 font-semibold"
                      : "hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <span>{age}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getMainLogo = () => {
    // Check if we're in the hyperlocal section
    if (isHyperlocalSection) {
      return (
        <div className="flex flex-col items-center">
          <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
            <Image
              src="/images/hyperlocal.png"
              fill
              objectFit="contain"
              alt="Hyperlocal logo"
              className="object-center"
            />
          </div>
        </div>
      );
    }

    if (isMapsSection) {
      return (
        <div className="flex flex-col items-center">
          <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
            <Image
              src="/images/newsmap.png"
              fill
              objectFit="contain"
              alt="Doutya logo"
              className="object-center"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
        <Image
          src={isKidsSection ? "/images/logo5.png" : "/images/logo2.png"}
          fill
          objectFit="contain"
          alt={isKidsSection ? "Doutya Kids logo" : "Doutya logo"}
          className="object-center"
        />
      </div>
    );
  };

  return (
    <>
      <nav
        className={cn(
          "w-full bg-white md:min-h-16 max-md:py-[0.8vh] max-md:max-h-[8.5vh] relative border-b-4 border-red-800/80 shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative grid items-center w-full md:grid-cols-3">
            {/* Left Column - Date and Age Selector */}
            <div className="hidden md:flex items-center justify-start">
              {!isKidsSection && (
                <div className="text-gray-700 font-medium text-sm">
                  {getCurrentDate()}
                </div>
              )}
              {isKidsSection && !isMapsSection && <AgeSelector />}
            </div>

            {/* Logo Column with Mobile Age Selector on Left */}
            <div className="flex items-center justify-center relative">
              {/* Mobile Date/Age Selector - Left of Logo */}
              <div className="md:hidden absolute left-0">
                {!isKidsSection && (
                  <div className="text-gray-700 font-medium text-[10px]">
                    {getCurrentDate()}
                  </div>
                )}
                {isKidsSection && !isMapsSection && <AgeSelector />}
              </div>

              <Link href="/">{getMainLogo()}</Link>

              {/* Mobile Plan + Menu Button - Right of Logo */}
              <div className="md:hidden absolute right-0 flex items-center gap-2">
                {/* Mobile Plan Indicators */}
                <PlanLoadingIndicator />
                <PlanIndicator />
                
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-1.5 transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                >
                  <Menu size={18} className="text-red-900 hover:text-red-800" />
                </button>
                <FloatingBubbleNav
                  showMenu={isMobileMenuOpen}
                  setShowMenu={setIsMobileMenuOpen}
                />
              </div>
            </div>

            {/* Right Column - Plan Indicator, Social Media, and Menu */}
            <div className="hidden md:flex justify-end items-center">
              <div className="flex items-center gap-3">
                {/* Plan Indicator or Loading */}
                <PlanLoadingIndicator />
                <PlanIndicator />
                
                <SocialMediaNav />
                <NavDropdownAlt />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;