"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

const PerspectiveNavigation = ({ currentArticleIndex, allArticles, nextArticle, previousArticle, handleViewpointChange, router, position = 'overlay' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNavigationTrigger, setShowNavigationTrigger] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const isFirstPerspective = currentArticleIndex === 0;
  const hasNext = currentArticleIndex < allArticles.length - 1;
  const isLastPerspective = currentArticleIndex === allArticles.length - 1;
  const timeoutRef = useRef(null);
  const navRef = useRef(null);

  // Determine if we're on mobile (less than 768px)
  const isMobile = screenWidth < 768;

  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    // Initial size check
    setScreenWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide navigation when user interacts with screen (not navigation buttons) - mobile only
useEffect(() => {
  if (!isMobile) return;

  const handleTouchStart = (e) => {
    setIsTouching(true);
    // Only hide if the interaction is NOT on the navigation buttons
    if (navRef.current && !navRef.current.contains(e.target)) {
      setIsVisible(false);
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    // Show instantly when finger is lifted (no delay)
    setIsVisible(true);
  };

  const handleScroll = () => {
    // Only hide if user is touching the screen
    if (isTouching) {
      setIsVisible(false);
      clearTimeout(timeoutRef.current);
    }
  };

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('scroll', handleScroll);
  };
}, [isMobile, isTouching]);

  // Show navigation when hovering near edges (mobile only)
  const handleMouseMove = (e) => {
    if (!isMobile) return; // Disable edge detection on desktop
    
    const edgeThreshold = screenWidth * 0.15;
    
    if (e.clientX < edgeThreshold || e.clientX > (screenWidth - edgeThreshold)) {
      setIsVisible(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (e.clientX < edgeThreshold || e.clientX > (screenWidth - edgeThreshold)) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }, 300);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }
  };

  // Show triggers (small indicators) when navigation is hidden (mobile only)
  useEffect(() => {
    if (!isMobile) {
      setShowNavigationTrigger(false);
      return;
    }

    if (!isVisible) {
      const triggerTimeout = setTimeout(() => {
        setShowNavigationTrigger(true);
      }, 1000);
      
      return () => clearTimeout(triggerTimeout);
    } else {
      setShowNavigationTrigger(false);
    }
  }, [isVisible, isMobile]);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Initial setup
  useEffect(() => {
    if (isMobile) {
      // Mobile: Hide initially, then show after 1.5 seconds
      setIsVisible(false);
      const initialTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(initialTimeout);
    } else {
      // Desktop: Always show navigation
      setIsVisible(true);
    }
  }, [currentArticleIndex, isMobile]);

  const handlePreviousClick = () => {
    if (isFirstPerspective) {
      router.push('/');
    } else {
      handleViewpointChange(currentArticleIndex - 1);
    }
  };

  const handleNextClick = () => {
    handleViewpointChange(currentArticleIndex + 1);
  };

  // Desktop Left Navigation Button
  if (position === 'left' && !isMobile) {
    return (
      <div className="flex items-center justify-center">
        <div className='flex flex-col gap-3'>
          {/* Previous Article Button - Show when on first perspective */}
          {isFirstPerspective && previousArticle ? (
            <button 
              onClick={() => router.push(`/news/${previousArticle.id}`)}
              className="bg-red-600 rounded-lg p-4 shadow-lg hover:bg-red-900 border border-red-900 transition-all hover:scale-105 group relative"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-8 h-8 text-white flex-shrink-0" />
                <div>
                  <div className="text-xs text-red-100">Previous Article</div>
                  <div className="text-sm font-medium max-w-[120px] truncate text-white">
                    {previousArticle.title.substring(0, 25)}...
                  </div>
                </div>
              </div>
            <div className="absolute left-1/2 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-40 -translate-x-1/2 z-50">
                <p className="text-sm">{previousArticle.title}</p>
              </div>
            </button>
          ) : (
            <button 
              onClick={handlePreviousClick}
              className="bg-[rgba(255,255,255,0.95)] rounded-lg p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-8 h-8 text-red-800" />
                <div className="pr-2">
                  <div className="text-xs text-red-900">
                    Previous Perspective
                  </div>
                  <div className="text-sm font-medium max-w-[120px] truncate">
                    {currentArticleIndex > 0 && allArticles[currentArticleIndex - 1]?.viewpoint}
                  </div>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Desktop Right Navigation Button
  if (position === 'right' && !isMobile) {
    return (
      <div className="flex items-center justify-center">
        {isLastPerspective ? (
          <div className="flex flex-col gap-3">
            {nextArticle && (
              <button 
                onClick={() => router.push(`/news/${nextArticle.id}`)}
                className="bg-red-600 p-4 hover:bg-red-900 transition-colors rounded-lg shadow-lg border border-red-900 group relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="pl-2">
                    <div className="text-xs text-red-100">Next Article</div>
                    <div className="text-sm font-medium max-w-[120px] truncate text-white">
                      {nextArticle.title.substring(0, 25)}...
                    </div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
              <div className="absolute left-1/2 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-40 -translate-x-1/2 z-50">
                {/* <div className="absolute right-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50"> */}
                  <p className="text-sm">{nextArticle.title}</p>
                </div>
              </button>
            )}
          </div>
        ) : (
          <button 
            onClick={handleNextClick}
            className="bg-[rgba(255,255,255,0.95)] rounded-lg p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <div className="pl-2">
                <div className="text-xs text-red-900">Next Perspective</div>
                <div className="text-sm font-medium max-w-[120px] truncate">
                  {hasNext && allArticles[currentArticleIndex + 1]?.viewpoint}
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-red-800" />
            </div>
          </button>
        )}
      </div>
    );
  }

  // Mobile rendering (overlay style) - only show if no position specified or position is overlay
  if (isMobile || position === 'overlay') {
    return (
      <div onMouseMove={handleMouseMove} className="fixed inset-0 z-20 pointer-events-none">

        {/* Navigation container with ref for click detection */}
        <div ref={navRef} className="pointer-events-none">
          {/* Left Navigation Button */}
          <AnimatePresence>
            {isVisible && (
              <motion.div
                className="fixed top-1/2 -translate-y-1/2 left-2 z-30 pointer-events-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex flex-col gap-2'>
                  {/* Previous Article Button - Show when on first perspective */}
                  {isFirstPerspective && previousArticle ? (
                    <button 
                      onClick={() => router.push(`/news/${previousArticle.id}`)}
                      className="bg-red-600 rounded-lg p-2 shadow-lg hover:bg-red-900 border border-red-900 transition-all hover:scale-105 group relative scale-110"
                    >
                      <div className="flex items-center gap-1">
                        <ArrowLeft className="w-5 h-5 text-white flex-shrink-0" />
                        <div>
                          <div className="text-[9px] text-red-100">Previous Article</div>
                          <div className="text-[9px] font-medium max-w-[90px] truncate text-white">
                            {previousArticle.title.substring(0, 25)}...
                          </div>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button 
                      onClick={handlePreviousClick}
                      className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105 scale-110"
                    >
                      <div className="flex items-center gap-1">
                        <ChevronLeft className="w-5 h-5 text-red-800" />
                        <div className="pr-0.5">
                          <div className="text-[9px] text-red-900">
                            Previous Perspective
                          </div>
                          <div className="text-[9px] font-medium max-w-[70px] truncate">
                            {currentArticleIndex > 0 && allArticles[currentArticleIndex - 1]?.viewpoint}
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Navigation Buttons */}
          <AnimatePresence>
            {isVisible && (
              <motion.div
                className="fixed top-1/2 -translate-y-1/2 right-2 z-30 pointer-events-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {isLastPerspective ? (
                  <div className="flex flex-col gap-2">
                    {nextArticle && (
                      <button 
                        onClick={() => router.push(`/news/${nextArticle.id}`)}
                        className="bg-red-600 p-2 hover:bg-red-900 transition-colors rounded-lg shadow-lg border border-red-900 group relative scale-110"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="pl-0.5">
                            <div className="text-[9px] text-red-100">Next Article</div>
                            <div className="text-[9px] font-medium max-w-[70px] truncate text-white">
                              {nextArticle.title.substring(0, 25)}...
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={handleNextClick}
                    className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105 scale-110"
                  >
                    <div className="flex items-center gap-1">
                      <div className="pl-0.5">
                        <div className="text-[9px] text-red-900">Next Perspective</div>
                        <div className="text-[9px] font-medium max-w-[60px] truncate">
                          {hasNext && allArticles[currentArticleIndex + 1]?.viewpoint}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-800" />
                    </div>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Return null if conditions don't match
  return null;
};

export default PerspectiveNavigation;