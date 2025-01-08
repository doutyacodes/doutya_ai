"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PerspectiveNavigation = ({ currentArticleIndex, allArticles, handleViewpointChange, router }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const isFirstPerspective = currentArticleIndex === 0;
  const hasNext = currentArticleIndex < allArticles.length - 1;
  
  // Function to handle user interaction
  const handleInteraction = () => {
    setIsVisible(true);
    setLastInteractionTime(Date.now());
  };

  useEffect(() => {
    let timeoutId;
    
    // Function to check if we should hide the navigation
    const checkVisibility = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint
      if (isMobile) {
        const timeSinceLastInteraction = Date.now() - lastInteractionTime;
        if (timeSinceLastInteraction > 2000) { // 3 seconds
          setIsVisible(false);
        }
      } else {
        setIsVisible(true); // Always visible on desktop
      }
    };

    // Set up event listeners for user interaction
    const handleScroll = () => handleInteraction();
    const handleMouseMove = () => handleInteraction();
    const handleTouch = () => handleInteraction();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch);

    // Initial visibility timeout
    timeoutId = setTimeout(() => {
      checkVisibility();
    }, 3000);

    // Regular check for visibility
    const intervalId = setInterval(checkVisibility, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [lastInteractionTime]);

  const handlePreviousClick = () => {
    if (!isVisible) return; // Prevent click when not visible
    if (isFirstPerspective) {
      router.push('/');
    } else {
      handleViewpointChange(currentArticleIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (!isVisible) return; // Prevent click when not visible
    handleViewpointChange(currentArticleIndex + 1);
  };

  return (
    <>
      {/* Left Navigation Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed top-1/2 -translate-y-1/2 left-2 md:left-6 z-30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={handlePreviousClick}
              className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-orange-50 border border-orange-300 transition-all hover:scale-105"
            >
              <div className="flex items-center gap-1 md:gap-2">
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                <div className="pr-1 md:pr-2">
                  <div className="text-[10px] md:text-xs text-orange-600">
                    {isFirstPerspective ? "Back to News" : "Previous Perspective"}
                  </div>
                  {!isFirstPerspective && (
                    <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px]">
                      {allArticles[currentArticleIndex - 1].viewpoint}
                    </div>
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Navigation Button */}
      <AnimatePresence>
        {isVisible && hasNext && (
          <motion.div
            className="fixed top-1/2 -translate-y-1/2 right-2 md:right-6 z-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={handleNextClick}
              className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-orange-50 border border-orange-300 transition-all hover:scale-105"
            >
              <div className="flex items-center gap-1 md:gap-2">
                <div className="pl-1 md:pl-2">
                  <div className="text-[10px] md:text-xs text-orange-600">Next Perspective</div>
                  <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px]">
                    {allArticles[currentArticleIndex + 1].viewpoint}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerspectiveNavigation;