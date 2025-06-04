
// "use client"
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Newspaper, ArrowRight, ArrowLeft } from 'lucide-react';

// const PerspectiveNavigation = ({ currentArticleIndex, allArticles, nextArticle, previousArticle, handleViewpointChange, router }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
//   const isFirstPerspective = currentArticleIndex === 0;
//   const hasNext = currentArticleIndex < allArticles.length - 1;
//   const isLastPerspective = currentArticleIndex === allArticles.length - 1;

//   // Function to handle user interaction
//   const handleInteraction = () => {
//     setIsVisible(true);
//     setLastInteractionTime(Date.now());
//   };

//   useEffect(() => {
//     let timeoutId;
    
//     // Function to check if we should hide the navigation
//     const checkVisibility = () => {
//       const isMobile = window.innerWidth < 768; // md breakpoint
//       if (isMobile) {
//         const timeSinceLastInteraction = Date.now() - lastInteractionTime;
//         if (timeSinceLastInteraction > 1500) { // Hide after 1.5 seconds
//           setIsVisible(false);
//         }
//       } else {
//         setIsVisible(true); // Always visible on desktop
//       }
//     };

//     // Set up event listeners for user interaction
//     const handleScroll = () => handleInteraction();
//     const handleMouseMove = () => handleInteraction();
//     const handleTouch = () => handleInteraction();

//     window.addEventListener('scroll', handleScroll);
//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('touchstart', handleTouch);

//     // Initial visibility timeout
//     timeoutId = setTimeout(() => {
//       checkVisibility();
//     }, 3000);

//     // Regular check for visibility
//     const intervalId = setInterval(checkVisibility, 1000);

//     return () => {
//       clearTimeout(timeoutId);
//       clearInterval(intervalId);
//       window.removeEventListener('scroll', handleScroll);
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('touchstart', handleTouch);
//     };
//   }, [lastInteractionTime]);

//   const handlePreviousClick = () => {
//     if (!isVisible) return; // Prevent click when not visible
//     if (isFirstPerspective) {
//       router.push('/');
//     } else {
//       handleViewpointChange(currentArticleIndex - 1);
//     }
//   };

//   const handleNextClick = () => {
//     if (!isVisible) return; // Prevent click when not visible
//     handleViewpointChange(currentArticleIndex + 1);
//   };

//   return (
//     <>
//       {/* Left Navigation Button */}
//       <AnimatePresence>
//         {isVisible && (
//           <motion.div
//             className="fixed top-1/2 -translate-y-1/2 left-2 md:left-6 z-30"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className='flex flex-col gap-3'>
//               {/* Previous Article Button - Show when on first perspective */}
//               {isFirstPerspective && previousArticle ? (
//                 <button 
//                 onClick={() => router.push(`/news/${previousArticle.id}`)}
//                 className="bg-red-600 rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-900 border border-red-900 transition-all hover:scale-105 group relative"
//               >
//                 <div className="flex items-center gap-2">
//                   <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
//                   <div>
//                     <div className="text-[10px] md:text-xs text-red-100">Previous Article</div>
//                     <div className="text-[10px] md:text-sm font-medium max-w-[120px] md:max-w-[180px] truncate text-white">
//                       {previousArticle.title.substring(0, 30)}...
//                     </div>
//                   </div>
//                 </div>
//                 <div className="absolute left-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
//                   <p className="text-sm">{previousArticle.title}</p>
//                 </div>
//               </button>
//               ) : (
//                 <button 
//                   onClick={handlePreviousClick}
//                   className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
//                 >
//                   <div className="flex items-center gap-1 md:gap-2">
//                     <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
//                     <div className="pr-1 md:pr-2">
//                       <div className="text-[10px] md:text-xs text-red-900">
//                         Previous Perspective
//                       </div>
//                       <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
//                         {allArticles[currentArticleIndex - 1].viewpoint}
//                       </div>
//                     </div>
//                   </div>
//                 </button>
//               ) }

//           </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Right Navigation Buttons */}
//       <AnimatePresence>
//         {isVisible && (
//           <motion.div
//             className="fixed top-1/2 -translate-y-1/2 right-2 md:right-6 z-30"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 20 }}
//             transition={{ duration: 0.3 }}
//           >
//               {isLastPerspective ? (
//                 <div className="flex flex-col gap-3">
//                   {nextArticle && (
//                     <button 
//                     onClick={() => router.push(`/news/${nextArticle.id}`)}
//                     className="bg-red-600 p-2 md:p-4 hover:bg-red-900 transition-colors rounded-lg shadow-lg border border-red-900 group relative"
//                   >
//                     <div className="flex items-center justify-between gap-1 md:gap-2">
//                       <div className="pl-1 md:pl-2">
//                         <div className="text-[10px] md:text-xs text-red-100">Next Article</div>
//                         <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate text-white">
//                           {nextArticle.title.substring(0, 30)}...
//                         </div>
//                       </div>
//                       <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
//                     </div>
                    
//                     <div className="absolute right-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
//                       <p className="text-sm">{nextArticle.title}</p>
//                     </div>
//                   </button>
//                   )}
                  
//                 </div>
//               ) : (
//                 <button 
//                   onClick={handleNextClick}
//                   className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
//                 >
//                   <div className="flex items-center gap-1 md:gap-2">
//                     <div className="pl-1 md:pl-2">
//                       <div className="text-[10px] md:text-xs text-red-900">Next Perspective</div>
//                       <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
//                         {allArticles[currentArticleIndex + 1].viewpoint}
//                       </div>
//                     </div>
//                     <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
//                   </div>
//                 </button>
//               )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default PerspectiveNavigation;

/* --------------------------------------------------------------- */

// "use client"
// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

// const PerspectiveNavigation = ({ currentArticleIndex, allArticles, nextArticle, previousArticle, handleViewpointChange, router }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [showNavigationTrigger, setShowNavigationTrigger] = useState(false);
//   const [screenWidth, setScreenWidth] = useState(0);
//   const isFirstPerspective = currentArticleIndex === 0;
//   const hasNext = currentArticleIndex < allArticles.length - 1;
//   const isLastPerspective = currentArticleIndex === allArticles.length - 1;
//   const timeoutRef = useRef(null);
//   const navRef = useRef(null);

//   // Track screen size
//   useEffect(() => {
//     const handleResize = () => {
//       setScreenWidth(window.innerWidth);
//     };
    
//     // Initial size check
//     setScreenWidth(window.innerWidth);
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Hide navigation when user clicks outside nav, scrolls or touches elsewhere
//   useEffect(() => {
//     if (!isVisible) return;

//     const handleOutsideClick = (e) => {
//       // Check if click is outside the navigation elements
//       if (navRef.current && !navRef.current.contains(e.target)) {
//         setIsVisible(false);
//       }
//     };

//     const handleScroll = () => {
//       setIsVisible(false);
//     };

//     const handleTouchStart = (e) => {
//       // Check if touch is outside navigation elements
//       if (navRef.current && !navRef.current.contains(e.target)) {
//         setIsVisible(false);
//       }
//     };

//     // Add event listeners
//     document.addEventListener('mousedown', handleOutsideClick);
//     document.addEventListener('scroll', handleScroll, { passive: true });
//     document.addEventListener('touchstart', handleTouchStart, { passive: true });

//     return () => {
//       // Clean up event listeners
//       document.removeEventListener('mousedown', handleOutsideClick);
//       document.removeEventListener('scroll', handleScroll);
//       document.removeEventListener('touchstart', handleTouchStart);
//     };
//   }, [isVisible]);

//   // Show navigation when hovering near edges or when explicitly requested
//   const handleMouseMove = (e) => {
//     const edgeThreshold = screenWidth * 0.15; // 15% from either edge
    
//     if (e.clientX < edgeThreshold || e.clientX > (screenWidth - edgeThreshold)) {
//       setIsVisible(true);
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         // Keep visible when mouse remains near the edge
//         if (e.clientX < edgeThreshold || e.clientX > (screenWidth - edgeThreshold)) {
//           setIsVisible(true);
//         } else {
//           setIsVisible(false);
//         }
//       }, 300);
//     } else {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         setIsVisible(false);
//       }, 1000);
//     }
//   };

//   // Show triggers (small indicators) when navigation is hidden
//   useEffect(() => {
//     if (!isVisible) {
//       const triggerTimeout = setTimeout(() => {
//         setShowNavigationTrigger(true);
//       }, 1000);
      
//       return () => clearTimeout(triggerTimeout);
//     } else {
//       setShowNavigationTrigger(false);
//     }
//   }, [isVisible]);

//   // Clear timeout when component unmounts
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   // Initial setup
//   useEffect(() => {
//     // Show navigation briefly on load then hide
//     setIsVisible(true);
//     const initialTimeout = setTimeout(() => {
//       setIsVisible(false);
//     }, 3000);

//     return () => clearTimeout(initialTimeout);
//   }, [currentArticleIndex]); // Reset when perspective changes

//   const handlePreviousClick = () => {
//     if (isFirstPerspective) {
//       router.push('/');
//     } else {
//       handleViewpointChange(currentArticleIndex - 1);
//     }
//   };

//   const handleNextClick = () => {
//     handleViewpointChange(currentArticleIndex + 1);
//   };

//   return (
//     <div onMouseMove={handleMouseMove} className="fixed inset-0 z-20 pointer-events-none">
//       {/* Navigation triggers - small indicators when navigation is hidden */}
//       <AnimatePresence>
//         {showNavigationTrigger && !isVisible && (
//           <>
//             {/* Left trigger */}
//             <motion.div
//               className="fixed top-1/2 -translate-y-1/2 left-0 z-30 pointer-events-auto"
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 0.6, x: 0 }}
//               exit={{ opacity: 0, x: -10 }}
//               transition={{ duration: 0.3 }}
//               onClick={() => setIsVisible(true)}
//             >
//               <div className="bg-red-500 text-white rounded-r-lg p-1 shadow-md">
//                 <ChevronLeft className="w-5 h-5" />
//               </div>
//             </motion.div>
            
//             {/* Right trigger */}
//             <motion.div
//               className="fixed top-1/2 -translate-y-1/2 right-0 z-30 pointer-events-auto"
//               initial={{ opacity: 0, x: 10 }}
//               animate={{ opacity: 0.6, x: 0 }}
//               exit={{ opacity: 0, x: 10 }}
//               transition={{ duration: 0.3 }}
//               onClick={() => setIsVisible(true)}
//             >
//               <div className="bg-red-500 text-white rounded-l-lg p-1 shadow-md">
//                 <ChevronRight className="w-5 h-5" />
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Navigation container with ref for click detection */}
//       <div ref={navRef} className="pointer-events-none">
//         {/* Left Navigation Button */}
//         <AnimatePresence>
//           {isVisible && (
//             <motion.div
//               className="fixed top-1/2 -translate-y-1/2 left-2 md:left-6 z-30 pointer-events-auto"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className='flex flex-col gap-3'>
//                 {/* Previous Article Button - Show when on first perspective */}
//                 {isFirstPerspective && previousArticle ? (
//                   <button 
//                   onClick={() => router.push(`/news/${previousArticle.id}`)}
//                   className="bg-red-600 rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-900 border border-red-900 transition-all hover:scale-105 group relative"
//                 >
//                   <div className="flex items-center gap-2">
//                     <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
//                     <div>
//                       <div className="text-[10px] md:text-xs text-red-100">Previous Article</div>
//                       <div className="text-[10px] md:text-sm font-medium max-w-[120px] md:max-w-[180px] truncate text-white">
//                         {previousArticle.title.substring(0, 30)}...
//                       </div>
//                     </div>
//                   </div>
//                   <div className="absolute left-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
//                     <p className="text-sm">{previousArticle.title}</p>
//                   </div>
//                 </button>
//                 ) : (
//                   <button 
//                     onClick={handlePreviousClick}
//                     className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
//                   >
//                     <div className="flex items-center gap-1 md:gap-2">
//                       <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
//                       <div className="pr-1 md:pr-2">
//                         <div className="text-[10px] md:text-xs text-red-900">
//                           Previous Perspective
//                         </div>
//                         <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
//                           {currentArticleIndex > 0 && allArticles[currentArticleIndex - 1]?.viewpoint}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Right Navigation Buttons */}
//         <AnimatePresence>
//           {isVisible && (
//             <motion.div
//               className="fixed top-1/2 -translate-y-1/2 right-2 md:right-6 z-30 pointer-events-auto"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {isLastPerspective ? (
//                 <div className="flex flex-col gap-3">
//                   {nextArticle && (
//                     <button 
//                     onClick={() => router.push(`/news/${nextArticle.id}`)}
//                     className="bg-red-600 p-2 md:p-4 hover:bg-red-900 transition-colors rounded-lg shadow-lg border border-red-900 group relative"
//                   >
//                     <div className="flex items-center justify-between gap-1 md:gap-2">
//                       <div className="pl-1 md:pl-2">
//                         <div className="text-[10px] md:text-xs text-red-100">Next Article</div>
//                         <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate text-white">
//                           {nextArticle.title.substring(0, 30)}...
//                         </div>
//                       </div>
//                       <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
//                     </div>
                    
//                     <div className="absolute right-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
//                       <p className="text-sm">{nextArticle.title}</p>
//                     </div>
//                   </button>
//                   )}
//                 </div>
//               ) : (
//                 <button 
//                   onClick={handleNextClick}
//                   className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
//                 >
//                   <div className="flex items-center gap-1 md:gap-2">
//                     <div className="pl-1 md:pl-2">
//                       <div className="text-[10px] md:text-xs text-red-900">Next Perspective</div>
//                       <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
//                         {hasNext && allArticles[currentArticleIndex + 1]?.viewpoint}
//                       </div>
//                     </div>
//                     <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
//                   </div>
//                 </button>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default PerspectiveNavigation;

// "use client"
// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

// const PerspectiveNavigation = ({ currentArticleIndex, allArticles, nextArticle, previousArticle, handleViewpointChange, router }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [showNavigationTrigger, setShowNavigationTrigger] = useState(false);
//   const [screenWidth, setScreenWidth] = useState(0);
//   const [showSwipeGuide, setShowSwipeGuide] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
  
//   const isFirstPerspective = currentArticleIndex === 0;
//   const hasNext = currentArticleIndex < allArticles.length - 1;
//   const isLastPerspective = currentArticleIndex === allArticles.length - 1;
//   const timeoutRef = useRef(null);
//   const navRef = useRef(null);
//   const touchStartX = useRef(null);
//   const touchStartY = useRef(null);

//   // Track screen size and mobile state
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setScreenWidth(width);
//       setIsMobile(width < 768); // md breakpoint
//     };
    
//     // Initial size check
//     handleResize();
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Check if guide should be shown (only on mobile, max 2 times)
//   useEffect(() => {
//     if (!isMobile) return;

//     const guideShownCount = parseInt(localStorage.getItem('swipeGuideShownCount') || '0');
    
//     if (guideShownCount < 2) {
//       const timer = setTimeout(() => {
//         setShowSwipeGuide(true);
//         localStorage.setItem('swipeGuideShownCount', (guideShownCount + 1).toString());
        
//         // Auto hide guide after 4 seconds
//         setTimeout(() => {
//           setShowSwipeGuide(false);
//         }, 4000);
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [currentArticleIndex, isMobile]);

//   // Touch handlers for mobile swipe
//   useEffect(() => {
//     if (!isMobile) return;

//     const handleTouchStart = (e) => {
//       touchStartX.current = e.touches[0].clientX;
//       touchStartY.current = e.touches[0].clientY;
//     };

//     const handleTouchEnd = (e) => {
//       if (!touchStartX.current || !touchStartY.current) return;

//       const touchEndX = e.changedTouches[0].clientX;
//       const touchEndY = e.changedTouches[0].clientY;
      
//       const deltaX = touchStartX.current - touchEndX;
//       const deltaY = touchStartY.current - touchEndY;
      
//       // Only trigger if horizontal swipe is dominant and significant
//       if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
//         if (deltaX > 0) {
//           // Swipe left - go to next
//           if (isLastPerspective && nextArticle) {
//             router.push(`/news/${nextArticle.id}`);
//           } else if (hasNext) {
//             handleViewpointChange(currentArticleIndex + 1);
//           }
//         } else {
//           // Swipe right - go to previous
//           if (isFirstPerspective) {
//             if (previousArticle) {
//               router.push(`/news/${previousArticle.id}`);
//             } else {
//               router.push('/');
//             }
//           } else {
//             handleViewpointChange(currentArticleIndex - 1);
//           }
//         }
//       }

//       touchStartX.current = null;
//       touchStartY.current = null;
//     };

//     document.addEventListener('touchstart', handleTouchStart, { passive: true });
//     document.addEventListener('touchend', handleTouchEnd, { passive: true });

//     return () => {
//       document.removeEventListener('touchstart', handleTouchStart);
//       document.removeEventListener('touchend', handleTouchEnd);
//     };
//   }, [isMobile, currentArticleIndex, isFirstPerspective, isLastPerspective, hasNext, nextArticle, previousArticle, handleViewpointChange, router]);

//   // Desktop functionality (existing code)
//   useEffect(() => {
//     if (isMobile || !isVisible) return;

//     const handleOutsideClick = (e) => {
//       if (navRef.current && !navRef.current.contains(e.target)) {
//         setIsVisible(false);
//       }
//     };

//     const handleScroll = () => {
//       setIsVisible(false);
//     };

//     document.addEventListener('mousedown', handleOutsideClick);
//     document.addEventListener('scroll', handleScroll, { passive: true });

//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//       document.removeEventListener('scroll', handleScroll);
//     };
//   }, [isVisible, isMobile]);

//   // Desktop mouse move handler
//   const handleMouseMove = (e) => {
//     if (isMobile) return;
    
//     const edgeThreshold = screenWidth * 0.15;
    
//     if (e.clientX < edgeThreshold || e.clientX > (screenWidth - edgeThreshold)) {
//       setIsVisible(true);
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         if (e.clientX < edgeThreshold || e.clientX > (screenWidth - edgeThreshold)) {
//           setIsVisible(true);
//         } else {
//           setIsVisible(false);
//         }
//       }, 300);
//     } else {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         setIsVisible(false);
//       }, 1000);
//     }
//   };

//   // Show triggers for desktop
//   useEffect(() => {
//     if (isMobile) return;
    
//     if (!isVisible) {
//       const triggerTimeout = setTimeout(() => {
//         setShowNavigationTrigger(true);
//       }, 2000);
      
//       return () => clearTimeout(triggerTimeout);
//     } else {
//       setShowNavigationTrigger(false);
//     }
//   }, [isVisible, isMobile]);

//   // Initial setup for desktop
//   useEffect(() => {
//     if (isMobile) return;
    
//     setIsVisible(true);
//     const initialTimeout = setTimeout(() => {
//       setIsVisible(false);
//     }, 3000);

//     return () => clearTimeout(initialTimeout);
//   }, [currentArticleIndex, isMobile]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   const handlePreviousClick = () => {
//     if (isFirstPerspective) {
//       router.push('/');
//     } else {
//       handleViewpointChange(currentArticleIndex - 1);
//     }
//   };

//   const handleNextClick = () => {
//     handleViewpointChange(currentArticleIndex + 1);
//   };

//   // Render mobile swipe guide
//   const renderSwipeGuide = () => (
//     <AnimatePresence>
//       {showSwipeGuide && isMobile && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={() => setShowSwipeGuide(false)}
//         >
//           <motion.div
//             className="bg-white rounded-2xl p-6 max-w-sm mx-auto shadow-2xl"
//             initial={{ scale: 0.8, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.8, y: 20 }}
//             transition={{ type: "spring", duration: 0.5 }}
//           >
//             <div className="text-center">
//               <div className="mb-4">
//                 <div className="flex justify-center items-center space-x-4 mb-3">
//                   <div className="flex items-center space-x-2 text-gray-600">
//                     <ArrowLeft className="w-5 h-5" />
//                     <span className="text-sm">Swipe</span>
//                   </div>
//                   <div className="w-8 h-1 bg-gray-300 rounded"></div>
//                   <div className="flex items-center space-x-2 text-gray-600">
//                     <span className="text-sm">Swipe</span>
//                     <ArrowRight className="w-5 h-5" />
//                   </div>
//                 </div>
//               </div>
              
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Navigate Perspectives
//               </h3>
              
//               <p className="text-sm text-gray-600 mb-4">
//                 Swipe left or right to explore different perspectives on this story
//               </p>
              
//               <button
//                 onClick={() => setShowSwipeGuide(false)}
//                 className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
//               >
//                 Got it
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );

//   return (
//     <>
//       {/* Mobile: Only show swipe guide */}
//       {isMobile && renderSwipeGuide()}
      
//       {/* Desktop: Show existing navigation */}
//       {!isMobile && (
//         <div onMouseMove={handleMouseMove} className="fixed inset-0 z-20 pointer-events-none">
//           {/* Navigation triggers - small indicators when navigation is hidden */}
//           <AnimatePresence>
//             {showNavigationTrigger && !isVisible && (
//               <>
//                 {/* Left trigger */}
//                 <motion.div
//                   className="fixed top-1/2 -translate-y-1/2 left-0 z-30 pointer-events-auto"
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 0.6, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.3 }}
//                   onClick={() => setIsVisible(true)}
//                 >
//                   <div className="bg-red-500 text-white rounded-r-lg p-1 shadow-md">
//                     <ChevronLeft className="w-5 h-5" />
//                   </div>
//                 </motion.div>
                
//                 {/* Right trigger */}
//                 <motion.div
//                   className="fixed top-1/2 -translate-y-1/2 right-0 z-30 pointer-events-auto"
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 0.6, x: 0 }}
//                   exit={{ opacity: 0, x: 10 }}
//                   transition={{ duration: 0.3 }}
//                   onClick={() => setIsVisible(true)}
//                 >
//                   <div className="bg-red-500 text-white rounded-l-lg p-1 shadow-md">
//                     <ChevronRight className="w-5 h-5" />
//                   </div>
//                 </motion.div>
//               </>
//             )}
//           </AnimatePresence>

//           {/* Navigation container with ref for click detection */}
//           <div ref={navRef} className="pointer-events-none">
//             {/* Left Navigation Button */}
//             <AnimatePresence>
//               {isVisible && (
//                 <motion.div
//                   className="fixed top-1/2 -translate-y-1/2 left-2 md:left-6 z-30 pointer-events-auto"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className='flex flex-col gap-3'>
//                     {/* Previous Article Button - Show when on first perspective */}
//                     {isFirstPerspective && previousArticle ? (
//                       <button 
//                       onClick={() => router.push(`/news/${previousArticle.id}`)}
//                       className="bg-red-600 rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-900 border border-red-900 transition-all hover:scale-105 group relative"
//                     >
//                       <div className="flex items-center gap-2">
//                         <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
//                         <div>
//                           <div className="text-[10px] md:text-xs text-red-100">Previous Article</div>
//                           <div className="text-[10px] md:text-sm font-medium max-w-[120px] md:max-w-[180px] truncate text-white">
//                             {previousArticle.title.substring(0, 30)}...
//                           </div>
//                         </div>
//                       </div>
//                       <div className="absolute left-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
//                         <p className="text-sm">{previousArticle.title}</p>
//                       </div>
//                     </button>
//                     ) : (
//                       <button 
//                         onClick={handlePreviousClick}
//                         className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
//                       >
//                         <div className="flex items-center gap-1 md:gap-2">
//                           <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
//                           <div className="pr-1 md:pr-2">
//                             <div className="text-[10px] md:text-xs text-red-900">
//                               Previous Perspective
//                             </div>
//                             <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
//                               {currentArticleIndex > 0 && allArticles[currentArticleIndex - 1]?.viewpoint}
//                             </div>
//                           </div>
//                         </div>
//                       </button>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Right Navigation Buttons */}
//             <AnimatePresence>
//               {isVisible && (
//                 <motion.div
//                   className="fixed top-1/2 -translate-y-1/2 right-2 md:right-6 z-30 pointer-events-auto"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {isLastPerspective ? (
//                     <div className="flex flex-col gap-3">
//                       {nextArticle && (
//                         <button 
//                         onClick={() => router.push(`/news/${nextArticle.id}`)}
//                         className="bg-red-600 p-2 md:p-4 hover:bg-red-900 transition-colors rounded-lg shadow-lg border border-red-900 group relative"
//                       >
//                         <div className="flex items-center justify-between gap-1 md:gap-2">
//                           <div className="pl-1 md:pl-2">
//                             <div className="text-[10px] md:text-xs text-red-100">Next Article</div>
//                             <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate text-white">
//                               {nextArticle.title.substring(0, 30)}...
//                             </div>
//                           </div>
//                           <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
//                         </div>
                        
//                         <div className="absolute right-0 top-full mt-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
//                           <p className="text-sm">{nextArticle.title}</p>
//                         </div>
//                       </button>
//                       )}
//                     </div>
//                   ) : (
//                     <button 
//                       onClick={handleNextClick}
//                       className="bg-[rgba(255,255,255,0.95)] rounded-lg p-2 md:p-4 shadow-lg hover:bg-red-100 border border-red-500 transition-all hover:scale-105"
//                     >
//                       <div className="flex items-center gap-1 md:gap-2">
//                         <div className="pl-1 md:pl-2">
//                           <div className="text-[10px] md:text-xs text-red-900">Next Perspective</div>
//                           <div className="text-[10px] md:text-sm font-medium max-w-[80px] md:max-w-[150px] truncate">
//                             {hasNext && allArticles[currentArticleIndex + 1]?.viewpoint}
//                           </div>
//                         </div>
//                         <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
//                       </div>
//                     </button>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default PerspectiveNavigation;