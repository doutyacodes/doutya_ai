

"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Newspaper, ArrowRight, ArrowLeft } from 'lucide-react';

const PerspectiveNavigation = ({ currentArticleIndex, allArticles, nextArticle, previousArticle, handleViewpointChange, router }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const isFirstPerspective = currentArticleIndex === 0;
  const hasNext = currentArticleIndex < allArticles.length - 1;
  const isLastPerspective = currentArticleIndex === allArticles.length - 1;

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
        if (timeSinceLastInteraction > 1500) { // Hide after 1.5 seconds
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
            <div className='flex flex-col gap-3'>
              {/* Previous Article Button - Show when on first perspective */}
              {isFirstPerspective && previousArticle ? (
                <button 
                onClick={() => router.push(`/news/${previousArticle.id}`)}
                className="bg-red-600 rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-900 border border-red-900 transition-all hover:scale-105 group relative"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
                  <div>
                    <div className="text-[10px] md:text-xs text-red-100">Previous Article</div>
                    <div className="text-[10px] md:text-sm font-medium max-w-[120px] md:max-w-[180px] truncate text-white">
                      {previousArticle.title.substring(0, 30)}...
                    </div>
                  </div>
                </div>
                <div className="absolute left-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
                  <p className="text-sm">{previousArticle.title}</p>
                </div>
              </button>
              ) : (
                <button 
                  onClick={handlePreviousClick}
                  className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
                    <div className="pr-1 md:pr-2">
                      <div className="text-[10px] md:text-xs text-red-900">
                        Previous Perspective
                      </div>
                      <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
                        {allArticles[currentArticleIndex - 1].viewpoint}
                      </div>
                    </div>
                  </div>
                </button>
              ) }

              {/* <button 
                onClick={handlePreviousClick}
                className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-orange-50 border border-orange-300 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                  <div className="pr-1 md:pr-2">
                    <div className="text-[10px] md:text-xs text-orange-600">
                      {isFirstPerspective ? "Back to Home" : "Previous Perspective"}
                    </div>
                    {!isFirstPerspective && (
                      <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
                        {allArticles[currentArticleIndex - 1].viewpoint}
                      </div>
                    )}

                    {isFirstPerspective && (
                      <div>
                          <div className="text-[10px] md:text-sm font-medium">View all articles</div>
                      </div>
                    )}
                  </div>
                </div>
              </button> */}
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Navigation Buttons */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed top-1/2 -translate-y-1/2 right-2 md:right-6 z-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
              {isLastPerspective ? (
                <div className="flex flex-col gap-3">
                  {nextArticle && (
                    <button 
                    onClick={() => router.push(`/news/${nextArticle.id}`)}
                    className="bg-red-600 p-2 md:p-4 hover:bg-red-900 transition-colors rounded-lg shadow-lg border border-red-900 group relative"
                  >
                    <div className="flex items-center justify-between gap-1 md:gap-2">
                      <div className="pl-1 md:pl-2">
                        <div className="text-[10px] md:text-xs text-red-100">Next Article</div>
                        <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate text-white">
                          {nextArticle.title.substring(0, 30)}...
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    
                    <div className="absolute right-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
                      <p className="text-sm">{nextArticle.title}</p>
                    </div>
                  </button>
                  )}

                  {/* <button 
                    onClick={() => router.push('/news')}
                    className="bg-[rgba(255,255,255,0.95)] p-2 md:p-4 hover:bg-orange-50 transition-colors rounded-t-lg rounded-lg shadow-lg border border-orange-300"
                  >
                    <div className="flex items-center justify-between gap-1 md:gap-2">
                      <div className="pl-1 md:pl-2">
                        <div className="text-[10px] md:text-xs text-orange-600">Back to Home</div>
                        <div className="text-[10px] md:text-sm font-medium">View all articles</div>
                        </div>
                      <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                    </div>
                  </button> */}
                  
                </div>
              ) : (
                <button 
                  onClick={handleNextClick}
                  className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="pl-1 md:pl-2">
                      <div className="text-[10px] md:text-xs text-red-900">Next Perspective</div>
                      <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
                        {allArticles[currentArticleIndex + 1].viewpoint}
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
                  </div>
                </button>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerspectiveNavigation;