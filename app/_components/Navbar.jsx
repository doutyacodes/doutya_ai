"use client";
import { useChildren } from "@/context/CreateContext";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Crown,
  Info,
  Loader2,
  Mail,
  Menu,
  Shield,
  Star,
  Users,
  MessageSquare,
  X,
  LogOut
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FloatingBubbleNav from "./FloatingBubbleNav";
import SocialMediaNav from "./SocialMediaNav";

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

  // Check sections
  const isKidsSection = pathname.startsWith("/kids");
  const isDebatesSection = pathname.startsWith("/debates");
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

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Logout function
  const handleLogout = () => {
    try {
      // Clear all auth-related data
      localStorage.removeItem('user_token');
      localStorage.removeItem('selectedAge');
      
      // Clear any session storage
      sessionStorage.clear();
      
      // Reset user state
      setUserPlan(null);
      
      // Redirect to login or home page
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if there's an error
      window.location.href = '/auth/login';
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Modern Plan indicator component
  const PlanIndicator = () => {
    const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);

    if (planLoading || planError || !userPlan) {
      return null;
    }

    const planDetails = userPlan.plan_details;
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
            "group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 min-h-[36px] sm:min-h-[40px]",
            "bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10",
            planDetails.color
          )}
          title={`${planDetails.display_name} Plan - ${userPlan.exam_type?.name || 'No exam selected'}`}
        >
          <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
          <span className="hidden xs:inline sm:inline truncate max-w-[60px] sm:max-w-none">{planDetails.display_name}</span>
          <span className="xs:hidden sm:hidden font-bold">{planDetails.display_name.charAt(0)}</span>
          {userPlan.exam_type && (
            <span className="hidden lg:inline text-xs opacity-80 bg-white/10 px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[80px]">
              {userPlan.exam_type.name}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0 ${isPlanDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isPlanDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => setIsPlanDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 sm:mt-3 w-56 sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl py-2 sm:py-3 z-[9999] transform opacity-100 scale-100 transition-all duration-300 origin-top-right ring-1 ring-black/5 border border-white/20">
              <div className="absolute right-4 sm:right-6 -top-2 w-4 h-4 bg-white/95 backdrop-blur-xl transform rotate-45 border-l border-t border-black/5" />
              
              <div className="relative space-y-1 px-1 sm:px-2">
                <button
                  onClick={() => handlePlanNavigation('/upgrade-plan')}
                  className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-800 transition-all duration-300 w-full text-left rounded-xl sm:rounded-2xl min-h-[44px]"
                >
                  <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg sm:rounded-xl group-hover:bg-amber-200 transition-colors duration-300 flex-shrink-0">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-sm sm:text-base">Upgrade Plan</span>
                    <p className="text-xs text-gray-500 truncate">Unlock premium features</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePlanNavigation('/chat')}
                  className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-800 transition-all duration-300 w-full text-left rounded-xl sm:rounded-2xl min-h-[44px]"
                >
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-sm sm:text-base">AI Chat</span>
                    <p className="text-xs text-gray-500 truncate">Chat with AI assistants</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePlanNavigation('/debates')}
                  className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-800 transition-all duration-300 w-full text-left rounded-xl sm:rounded-2xl min-h-[44px]"
                >
                  <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg sm:rounded-xl group-hover:bg-purple-200 transition-colors duration-300 flex-shrink-0">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-sm sm:text-base">Debates</span>
                    <p className="text-xs text-gray-500 truncate">Join AI-powered discussions</p>
                  </div>
                </button>

                <div className="border-t border-gray-100 my-2 mx-2 sm:mx-4"></div>
                
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-800 transition-all duration-300 w-full text-left rounded-xl sm:rounded-2xl min-h-[44px]"
                >
                  <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg sm:rounded-xl group-hover:bg-red-200 transition-colors duration-300 flex-shrink-0">
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-sm sm:text-base">Logout</span>
                    <p className="text-xs text-gray-500 truncate">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Modern loading indicator
  const PlanLoadingIndicator = () => {
    if (!planLoading) return null;

    return (
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-100/80 to-gray-50/80 backdrop-blur-sm border border-gray-200/50 text-xs sm:text-sm font-medium shadow-sm min-h-[36px] sm:min-h-[40px]">
        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-gray-400 flex-shrink-0" />
        <span className="hidden sm:inline text-gray-600">Loading...</span>
      </div>
    );
  };

  // Modern navigation dropdown
  const NavDropdownAlt = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-100/80 to-gray-50/80 backdrop-blur-sm border border-gray-200/50 hover:border-red-300 text-gray-700 hover:text-red-800 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 min-h-[36px] sm:min-h-[40px]"
        >
          <Menu className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0 ${isDropdownOpen ? "rotate-90" : ""}`} />
          <span className="hidden sm:inline font-medium">Menu</span>
        </button>

        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 sm:mt-3 w-56 sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl py-2 sm:py-3 z-[9999] transform opacity-100 scale-100 transition-all duration-300 origin-top-right ring-1 ring-black/5 border border-white/20">
              <div className="absolute right-4 sm:right-6 -top-2 w-4 h-4 bg-white/95 backdrop-blur-xl transform rotate-45 border-l border-t border-black/5" />

              <div className="relative space-y-1 px-1 sm:px-2">
                <Link
                  href="/about-us"
                  className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-800 transition-all duration-300 rounded-xl sm:rounded-2xl min-h-[44px]"
                >
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-sm sm:text-base">About Us</span>
                    <p className="text-xs text-gray-500 truncate">Learn more about Doutya</p>
                  </div>
                </Link>

                <Link
                  href="/contact-us"
                  className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-800 transition-all duration-300 rounded-xl sm:rounded-2xl min-h-[44px]"
                >
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg sm:rounded-xl group-hover:bg-green-200 transition-colors duration-300 flex-shrink-0">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-sm sm:text-base">Contact Us</span>
                    <p className="text-xs text-gray-500 truncate">Get in touch with us</p>
                  </div>
                </Link>

                {userPlan && (
                  <>
                    <div className="border-t border-gray-100 my-2 mx-2 sm:mx-4"></div>
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl sm:rounded-2xl mx-1 sm:mx-2">
                      <div className="text-xs font-medium text-gray-500 mb-1">Current Plan</div>
                      <div className="font-bold text-gray-800 text-sm">
                        {userPlan.plan_details.display_name}
                        {userPlan.exam_type && (
                          <span className="text-xs text-gray-500 ml-2 font-normal truncate block sm:inline">
                            ({userPlan.exam_type.name})
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {userPlan && (
                  <>
                    <div className="border-t border-gray-100 my-2 mx-2 sm:mx-4"></div>
                    <button
                      onClick={handleLogout}
                      className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-800 transition-all duration-300 rounded-xl sm:rounded-2xl min-h-[44px] w-full text-left mx-1 sm:mx-2"
                    >
                      <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg sm:rounded-xl group-hover:bg-red-200 transition-colors duration-300 flex-shrink-0">
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-sm sm:text-base">Logout</span>
                        <p className="text-xs text-gray-500 truncate">Sign out of your account</p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Modern age selector
  const AgeSelector = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleAgeChange = (age) => {
      localStorage.setItem("selectedAge", age);
      updateSelectedAge(age);
      setIsDropdownOpen(false);
      window.location.reload();
    };

    const ages = Array.from({ length: 8 }, (_, i) => i + 6);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="group flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-100/80 to-indigo-100/80 backdrop-blur-sm border border-blue-200/50 text-blue-800 hover:from-blue-200/80 hover:to-indigo-200/80 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 min-h-[36px] sm:min-h-[40px]"
        >
          <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
            Age: {selectedAge}
          </span>
          <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 flex-shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-28 sm:w-32 md:w-40 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl py-2 sm:py-3 z-[9999] transform opacity-100 scale-100 transition-all duration-300 origin-top-left ring-1 ring-black/5 border border-white/20">
              <div className="absolute left-3 sm:left-4 md:left-6 -top-2 w-4 h-4 bg-white/95 backdrop-blur-xl transform rotate-45 border-l border-t border-black/5" />

              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl max-h-64 overflow-y-auto">
                <div className="px-1 sm:px-2 space-y-1">
                  {ages.map((age) => (
                    <button
                      key={age}
                      onClick={() => handleAgeChange(age.toString())}
                      className={`w-full text-center flex items-center justify-center px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 rounded-xl sm:rounded-2xl min-h-[36px] sm:min-h-[40px] ${
                        selectedAge === age.toString()
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-800"
                      }`}
                    >
                      <span className="font-semibold whitespace-nowrap">{age} years</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const getMainLogo = () => {
    if (isHyperlocalSection) {
      return (
        <div className="flex flex-col items-center group">
          <div className="relative h-[6vh] w-[30vw] sm:h-[7vh] sm:w-[25vw] md:h-[8vh] md:w-[20vw] lg:h-[9vh] lg:w-[18vw] transition-transform duration-300 group-hover:scale-[1.02]">
            <Image
              src="/images/hyperlocal.png"
              fill
              objectFit="contain"
              alt="Hyperlocal logo"
              className="object-center"
              priority
            />
          </div>
        </div>
      );
    }

    if (isDebatesSection) {
      return (
        <div className="flex flex-col items-center group">
          <div className="relative h-[6vh] w-[30vw] sm:h-[7vh] sm:w-[25vw] md:h-[8vh] md:w-[20vw] lg:h-[9vh] lg:w-[18vw] transition-transform duration-300 group-hover:scale-[1.02]">
            <Image
              src="/images/logo2.png"
              fill
              objectFit="contain"
              alt="Debates logo"
              className="object-center"
              priority
            />
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-[6vh] w-[30vw] sm:h-[7vh] sm:w-[25vw] md:h-[8vh] md:w-[20vw] lg:h-[9vh] lg:w-[18vw] group transition-transform duration-300 hover:scale-[1.02]">
        <Image
          src={isKidsSection ? "/images/logo5.png" : "/images/logo2.png"}
          fill
          objectFit="contain"
          alt={isKidsSection ? "Doutya Kids logo" : "Doutya logo"}
          className="object-center"
          priority
        />
      </div>
    );
  };

  return (
    <>
      <nav className={cn(
        "w-full bg-gradient-to-r from-white via-white to-blue-50/30 backdrop-blur-sm sticky top-0 z-[9997] border-b border-red-800/20 shadow-lg shadow-red-800/5",
        "min-h-[60px] sm:min-h-[64px] md:min-h-[72px]"
      )}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="relative grid items-center w-full h-full py-2 sm:py-3 md:py-4 md:grid-cols-3">
            {/* Left Column - Date and Age Selector */}
            <div className="hidden md:flex items-center justify-start">
              {!isKidsSection && (
                <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-100/80 to-gray-50/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 font-semibold text-sm shadow-sm">
                  <span className="hidden lg:inline">{getCurrentDate()}</span>
                  <span className="lg:hidden">{new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {isKidsSection && !isDebatesSection && <AgeSelector />}
            </div>

            {/* Logo Column with Mobile Controls */}
            <div className="flex items-center justify-between md:justify-center relative w-full">
              {/* Mobile Date/Age Selector - Left of Logo */}
              <div className="md:hidden flex items-center">
                {!isKidsSection && (
                  <div className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-gray-100/80 to-gray-50/80 backdrop-blur-sm text-gray-700 font-medium text-[10px] sm:text-xs shadow-sm border border-gray-200/50">
                    <span className="hidden xs:inline">{new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
                    <span className="xs:hidden">{new Date().getDate()}</span>
                  </div>
                )}
                {isKidsSection && !isDebatesSection && <AgeSelector />}
              </div>

              {/* Logo - Centered */}
              <Link href="/" className="z-10 flex-shrink-0 mx-2 sm:mx-4">
                {getMainLogo()}
              </Link>

              {/* Mobile Controls - Right */}
              <div className="md:hidden flex items-center gap-1 sm:gap-2">
                <PlanLoadingIndicator />
                <PlanIndicator />
                
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-red-100/80 to-rose-100/80 backdrop-blur-sm border border-red-200/50 text-red-800 hover:from-red-200/80 hover:to-rose-200/80 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  {isMobileMenuOpen ? 
                    <X size={16} className="transition-transform duration-300" /> : 
                    <Menu size={16} className="transition-transform duration-300" />
                  }
                </button>
              </div>
            </div>

            {/* Right Column - Desktop Controls */}
            <div className="hidden md:flex justify-end items-center">
              <div className="flex items-center gap-2 lg:gap-4">
                <PlanLoadingIndicator />
                <PlanIndicator />
                <SocialMediaNav />
                <NavDropdownAlt />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <FloatingBubbleNav
              showMenu={isMobileMenuOpen}
              setShowMenu={setIsMobileMenuOpen}
            />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;