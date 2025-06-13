// "use client"
// import ReactDOMServer from "react-dom/server";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useMediaQuery } from 'react-responsive';
// import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";
// import { MarkerClusterer } from '@googlemaps/markerclusterer';
// import { 
//     MapPin, AlertTriangle, Building2, UserRound, Car, Cloud, 
//     PartyPopper, Swords, Megaphone, AlertCircle, Trophy, 
//     Heart, Briefcase, Film, Laptop, FlaskConical, GraduationCap, 
//     Leaf, Users, Train, Globe,
//     BadgeDollarSign,
//     Ambulance,
//     Clapperboard,
//     Shield,
//     Rocket,
//     Shirt,
//     BellRing,
//     Flag,
//     PawPrint,
//     Loader2,
//     Newspaper,
//     Vote,
//     MegaphoneIcon,
//     TrendingUp,
//     Music,
//     HandHeart,
//     Sparkles,
//     Info,
//     RotateCw
//   } from "lucide-react";
// import { FaHandcuffs } from "react-icons/fa6";
// import { GiCrossedSwords } from "react-icons/gi";
// import { useRouter } from "next/navigation";
// import { applyGoogleMapsControlStyle } from "@/utils/googleMapsStyles";

// // Map container styles
// const containerStyle = {
//   width: "100%",
//   height: "calc(100vh - 80px)",
// };

// // Default center position (world view)
// const center = {
//   lat: 20,
//   lng: 0,
// };

// // Map zoom levels
// const DEFAULT_ZOOM = 2;
// const USER_LOCATION_ZOOM = 7;


// export default function NewsMap() {
//   const [newsItems, setNewsItems] = useState([]);
//   const [groupedNews, setGroupedNews] = useState({});
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
//   const [mapBounds, setMapBounds] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [mapRef, setMapRef] = useState(null);
//   const router = useRouter();

//   const [showLocationModal, setShowLocationModal] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [locationError, setLocationError] = useState(null);
//   const [locationPermissionState, setLocationPermissionState] = useState(null);

//   const [availableLanguages, setAvailableLanguages] = useState([]);
//   const [selectedLanguages, setSelectedLanguages] = useState([]);
//   const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
//   const [hasAskedForLocation, setHasAskedForLocation] = useState(false);

//   const [userCountry, setUserCountry] = useState(null);
//   const [countryCenter, setCountryCenter] = useState(center);

//   // Category icons mapping using Lucide React components

//   const [selectedCategories, setSelectedCategories] = useState(
//     Object.keys(categoryIcons).filter(cat => cat !== 'Default')
//   );

//   // Add refs to store state for mobile restoration
//   const userLocationRef = useRef(null);
//   const mapCenterRef = useRef(null);
//   const mapZoomRef = useRef(null);
//   const isInitialLoadRef = useRef(true);
//   const userHasInteractedRef = useRef(false); // Track if user has manually moved the map

//   const markersRef = useRef([]);
//   const clusterRef = useRef(null);

//   // Load Google Maps script
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//   });

//   const isMobile = useMediaQuery({ maxWidth: 640 });

//   const buttonStyle = {
//     minWidth: isMobile ? '60px' : '100px',  // Changed from 80px to 60px for mobile
//     height: isMobile ? '28px' : '38px',     // Changed from 34px to 28px for mobile
//     fontSize: isMobile ? '12px' : '14px'    // Added smaller font size for mobile
//   };

//   // Store user location in sessionStorage for persistence

//   // Fetch news data based on map bounds

//   // Fetch user's country and center coordinates

//   // Fetch available languages

//   // Check location permission status

//   // Get user's location

//   // Handle allow button click in modal

//   // Handle cancel button click in modal

//   // Get current position

//   // Handle marker click
//   const handleMarkerClick = useCallback((locationKey, index = 0) => {
//     const [lat, lng] = locationKey.split(',').map(parseFloat);
//     setSelectedLocation({ key: locationKey, lat, lng });
//     setCurrentNewsIndex(index);
//   }, []);

//   // Initial data fetch and location request
//   useEffect(() => {
//     fetchLanguages();
//     // getUserLocation(); // Commented out - fetch full data instead of user location
//   }, [fetchLanguages]); // Removed getUserLocation and hasAskedForLocation dependencies

//   // Fetch user country on component mount
//   useEffect(() => {
//     fetchUserCountry();
//   }, [fetchUserCountry]);

//   // Handle selected languages change
//   useEffect(() => {
//     if (availableLanguages.length > 0 && selectedLanguages.length >= 0) {
//       // fetchNewsData(mapBounds, selectedLanguages);
//       fetchNewsData(null, selectedLanguages); // Pass null instead of mapBounds
//     }
//   }, [selectedLanguages, fetchNewsData, availableLanguages.length]); // Removed mapBounds dependency

//   // Handle page visibility change to restore map state on mobile ONLY
//   useEffect(() => {
//     // Only add visibility change handler for mobile devices
//     if (!isMobile) return;

//     const handleVisibilityChange = () => {
//       // Only restore location if:
//       // 1. Page is becoming visible
//       // 2. Map ref exists
//       // 3. User location exists
//       // 4. User hasn't manually interacted with the map
//       // 5. User gave permission (don't ask again)
//       if (!document.hidden && 
//           mapRef && 
//           userLocationRef.current && 
//           !userHasInteractedRef.current &&
//           locationPermissionState === 'granted') {
//         // Restore user location when page becomes visible again on mobile
//         setTimeout(() => {
//           mapRef.panTo(userLocationRef.current);
//           mapRef.setZoom(USER_LOCATION_ZOOM);
//         }, 100);
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
//   }, [mapRef, isMobile, locationPermissionState]);

//   // Handle marker clustering


//   // Handle zoom changes to update cluster marker sizes
//   useEffect(() => {
//     if (!mapRef || !clusterRef.current) return;
    
//     const handleZoomChange = () => {
//       // Small delay to ensure zoom has completed
//       setTimeout(() => {
//         // Get current markers
//         const currentMarkers = markersRef.current;
//         if (currentMarkers.length > 0) {
//           // Clear the existing cluster
//           clusterRef.current.clearMarkers();
//           clusterRef.current.setMap(null);
          
//           // Create new cluster with updated renderer
//           const newCluster = new MarkerClusterer({
//             map: mapRef,
//             markers: currentMarkers,
//             renderer: createClusterRenderer(),
//             algorithmOptions: {
//               maxZoom: 12,
//               radius: 80,
//             },
//           });

//           newCluster.addListener('click', (event, cluster, map) => {
//             handleClusterClick(event, cluster, map);
//           });
          
//           clusterRef.current = newCluster;
//         }
//       }, 100);
//     };
    
//     const zoomListener = mapRef.addListener('zoom_changed', handleZoomChange);
    
//     return () => {
//       if (zoomListener) {
//         google.maps.event.removeListener(zoomListener);
//       }
//     };
//   }, [mapRef]);

//   // Handle map load
//   const handleMapLoad = (map) => {
//     setMapRef(map);

//     // Inject custom style to adjust controls after map is fully loaded
//     // applyGoogleMapsControlStyle(); 
    
//     // If we have stored user location, apply it immediately
//     const storedLocation = getStoredUserLocation();
//     if (storedLocation && isInitialLoadRef.current) {
//       setUserLocation(storedLocation);
//       userLocationRef.current = storedLocation;
//       map.panTo(storedLocation);
//       map.setZoom(USER_LOCATION_ZOOM);
//       isInitialLoadRef.current = false;
//     }
    
//     // Add map interaction listeners to track user interaction
//     const addInteractionListeners = () => {
//       map.addListener('dragstart', () => {
//         userHasInteractedRef.current = true;
//       });
      
//       map.addListener('zoom_changed', () => {
//         // Only mark as interaction if it's not the initial zoom
//         if (!isInitialLoadRef.current) {
//           userHasInteractedRef.current = true;
//         }
//       });

//       // Also track clicks on the map
//       map.addListener('click', () => {
//         userHasInteractedRef.current = true;
//       });
//     };

//     // Add listeners immediately but mark initial load as complete after delay
//     addInteractionListeners();
//     setTimeout(() => {
//       isInitialLoadRef.current = false;
//     }, 2000);
    
//     // Add listeners after a short delay to avoid initial load events
//     setTimeout(addInteractionListeners, 1000);
//   };


// // Custom Zoom Controls Component
//   const ZoomControls = ({ mapRef }) => {
//     const handleZoomIn = () => {
//       if (!mapRef) return;
//       const currentZoom = mapRef.getZoom();
//       mapRef.setZoom(currentZoom + 1);
//     };

//     const handleZoomOut = () => {
//       if (!mapRef) return;
//       const currentZoom = mapRef.getZoom();
//       mapRef.setZoom(currentZoom - 1);
//     };

//     return (
//       <div className="absolute right-3.5 z-10 bg-white shadow-md rounded-lg overflow-hidden" style={{ bottom: isMobile ? '165px' : '120px' }}>
//         <button 
//           onClick={handleZoomIn}
//           className="block w-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center border-b border-gray-200"
//           style={{
//             width: isMobile ? '32px' : '40px',
//             height: isMobile ? '32px' : '40px',
//             fontSize: isMobile ? '16px' : '18px',
//             fontWeight: 'normal'
//           }}
//         >
//           +
//         </button>
//         <button 
//           onClick={handleZoomOut}
//           className="block w-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
//           style={{
//             width: isMobile ? '32px' : '40px',
//             height: isMobile ? '32px' : '40px',
//             fontSize: isMobile ? '16px' : '18px',
//             fontWeight: 'normal'
//           }}
//         >
//           −
//         </button>
//       </div>
//     );
//   };

//   const handleClusterClick = (event, cluster, map) => {
//     if (!mapRef) return;
    
//     // In newer versions, we need to access the cluster differently
//     // The event might contain the cluster information
//     let markers = [];
    
//     if (cluster && cluster.markers) {
//       markers = cluster.markers;
//     } else if (cluster && cluster.getMarkers) {
//       markers = cluster.getMarkers();
//     } else if (event && event.cluster) {
//       markers = event.cluster.markers || [];
//     } else {
//       console.log('Cluster structure:', cluster, 'Event:', event);
//       return;
//     }
    
//     if (markers.length === 0) return;
    
//     // Calculate bounds that include all markers in the cluster
//     const bounds = new google.maps.LatLngBounds();
//     markers.forEach(marker => {
//       bounds.extend(marker.getPosition());
//     });
    
//     // Smoothly fit the map to show all markers in the cluster
//     mapRef.fitBounds(bounds, {
//       duration: 800, // 800ms animation
//     });

//     // Ensure minimum zoom level for better visibility with smooth transition
//     const listener = google.maps.event.addListener(mapRef, 'idle', () => {
//       if (mapRef.getZoom() > 12) {
//         mapRef.setZoom(12);
//         // Add smooth transition for zoom adjustment too
//         setTimeout(() => {
//           mapRef.panTo(mapRef.getCenter());
//         }, 100);
//       }
//       google.maps.event.removeListener(listener);
//     });
//   };

//   // Loading state
//   if (!isLoaded) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
//           <div className="text-xl font-medium">Loading Map...</div>
//         </div>
//       </div>
//     );
//   }

//   // Get current news item for the info window
//   const getCurrentNewsItem = () => {
//     if (!selectedLocation || !groupedNews[selectedLocation.key]) return null;
//     return groupedNews[selectedLocation.key][currentNewsIndex];
//   };

//   const currentNews = getCurrentNewsItem();
//   const selectedNewsGroup = selectedLocation ? groupedNews[selectedLocation.key] : [];
//   const hasMultipleNews = selectedNewsGroup && selectedNewsGroup.length > 1;


//   // Determine map center and zoom - always use default for full world view
//   const mapCenter = countryCenter;
//   const mapZoom = DEFAULT_ZOOM; // Always use default zoom
//   // const mapCenter = userLocation || center; // Commented out
//   // const mapZoom = userLocation ? USER_LOCATION_ZOOM : DEFAULT_ZOOM; // Commented ou

//   return (
//     <div className="relative">
//       {/* Location permission modal */}
//       {showLocationModal && (
//         <LocationModal 
//           onAllow={handleAllowLocation}
//           onCancel={handleCancelLocation}
//           isLoading={locationLoading}
//           error={locationError}
//         />
//       )}

//       <>
//         {/* Filter Controls */}
//         <div className="absolute top-3 right-4 z-10">
//           {isMobile ? (
//             <MobileFilterDropdown
//               availableLanguages={availableLanguages}
//               selectedLanguages={selectedLanguages}
//               setSelectedLanguages={setSelectedLanguages}
//               selectedCategories={selectedCategories}
//               setSelectedCategories={setSelectedCategories}
//               showFiltersDropdown={showFiltersDropdown}
//               setShowFiltersDropdown={setShowFiltersDropdown}
//               buttonStyle={buttonStyle}
//               categoryIcons={categoryIcons}
//               fetchNewsData={fetchNewsData}
//               mapRef={mapRef}
//             />
//           ) : (
//             <div className="flex gap-2">
//               <LanguageFilter
//                 availableLanguages={availableLanguages}
//                 selectedLanguages={selectedLanguages}
//                 setSelectedLanguages={setSelectedLanguages}
//                 buttonStyle={buttonStyle}
//                 isMobile={isMobile}
//               />
//               <FilterPanel 
//                 selectedCategories={selectedCategories}
//                 setSelectedCategories={setSelectedCategories}
//                 buttonStyle={buttonStyle}
//                 isMobile={isMobile}
//                 categoryIcons={categoryIcons}
//               />
//               <ResetZoomButton mapRef={mapRef} buttonStyle={buttonStyle} fetchNewsData={fetchNewsData} selectedLanguages={selectedLanguages} 
//               setSelectedLocation={setSelectedLocation}/>
//             </div>
//           )}
//         </div>

//         {/* Mobile Reset Button - positioned where pan control used to be */}
//         {isMobile && (
//           <div className="absolute right-1 z-10" style={{ bottom: '238px' }}>
//             <MobileResetButton 
//               mapRef={mapRef} 
//               fetchNewsData={fetchNewsData} 
//               selectedLanguages={selectedLanguages}
//               setSelectedLocation={setSelectedLocation}
//             />
//           </div>
//         )}
//       </>

//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={mapCenter}
//         zoom={mapZoom}
//         options={{
//           fullscreenControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,
//           zoomControl: false,
//           panControl: false,
//           rotateControl: false,
//           scaleControl: false,
//           gestureHandling: "greedy",
//           clickableIcons: false,
//           minZoom: 2,
//           maxZoom: 18,
//           restriction: {
//             latLngBounds: {
//               north: 85,
//               south: -85,
//               west: -180,
//               east: 180,
//             },
//             strictBounds: true,
//           },
//           disableDefaultUI: true,
//         }}
//         onLoad={handleMapLoad}
//       >
//         {/* Custom Map Type Controls */}
//         <MapTypeControls mapRef={mapRef} />

//         {/* Custom Zoom Controls */}
//         <ZoomControls mapRef={mapRef} />

//         {/* Info Window */}
//         {currentNews && (
//           <InfoWindowF
//             position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
//             onCloseClick={() => setSelectedLocation(null)}
//             options={{
//               pixelOffset: new window.google.maps.Size(0, -5),
//               disableAutoPan: false,
//               maxWidth: window.innerWidth < 640 ? 280 : 320
//             }}
//           >
//           <div className="w-full max-w-[280px] sm:max-w-[320px] relative select-none min-h-[300px] sm:min-h-96 flex flex-col justify-between">
//             {/* Header section with category and close button aligned */}
//             <div className="relative w-full mb-3 flex-shrink-0 flex items-center justify-center">
//               <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full inline-flex items-center justify-center gap-0.5 shadow-sm">
//                 <span className="flex items-center justify-center text-[10px] sm:text-xs">
//                   {currentNews.category ? 
//                     categoryIcons[currentNews.category] || categoryIcons.Default : 
//                     categoryIcons.Default}
//                 </span>
//                 <span className="text-xs sm:text-sm">{currentNews.category || "News"}</span>
//               </span>
              
//               <button 
//                 onClick={() => setSelectedLocation(null)}
//                 className="absolute right-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors border border-gray-200"
//                 aria-label="Close"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <style jsx>{`
//               .gm-ui-hover-effect {
//                 display: none !important;
//               }
              
//               .gm-style-iw-chr {
//                 display: none !important;
//               }
              
//               .gm-style-iw-t button.gm-ui-hover-effect,
//               .gm-style-iw-chr button {
//                 display: none !important;
//               }
              
//               .gm-style-iw-c {
//                 padding: 8px !important;
//               }
              
//               .gm-style-iw-d {
//                 width: 100% !important;
//                 max-width: 100% !important;
//                 overflow: hidden !important;
//               }
                          
//               .summary-scroll::-webkit-scrollbar {
//                 width: 3px;
//               }
              
//               .summary-scroll::-webkit-scrollbar-track {
//                 background: #f1f5f9;
//                 border-radius: 2px;
//               }
              
//               .summary-scroll::-webkit-scrollbar-thumb {
//                 background: #cbd5e1;
//                 border-radius: 2px;
//               }
              
//               .summary-scroll::-webkit-scrollbar-thumb:hover {
//                 background: #94a3b8;
//               }
              
//               @media (max-width: 640px) {
//                 .gm-style-iw-c {
//                   padding: 6px !important;
//                 }
//               }
//             `}</style>
            
//             {/* Image section */}
//             <div className="relative h-24 sm:h-32 w-full overflow-hidden rounded-md sm:rounded-lg mb-3 flex-shrink-0">
//               <img 
//                 src={currentNews.image_url} 
//                 alt={currentNews.title}
//                 className="object-cover w-full h-full"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "/placeholders/news-placeholder.jpg";
//                 }}
//               />
//             </div>
            
//             {/* Title section */}
//             <h3 className="font-semibold text-sm sm:text-base mb-3 leading-tight flex-shrink-0">
//               {currentNews.title}
//             </h3>
            
//             {/* Summary Section with Fixed Height and Scroll */}
//             {currentNews.summary && (
//               <div className="mb-3 flex-shrink-0">
//                 <div 
//                   className="h-26 md:h-20 overflow-y-auto summary-scroll pr-1"
//                   key={`summary-${currentNews.id || currentNewsIndex}`}
//                 >
//                   <p className="text-xs sm:text-sm text-gray-700 leading-tight sm:leading-normal text-justify">
//                     {currentNews.summary}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Spacer to push bottom content down */}
//             <div className="flex-grow"></div>
            
//             {/* Source and date section */}
//             <div className="flex items-center justify-between mb-3 flex-shrink-0">
//               <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
//                 {currentNews.article_url && (
//                   <img
//                     src={getFavicon(currentNews.article_url)}
//                     alt=""
//                     className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 )}
//                 <p className="text-xs sm:text-sm text-gray-800 truncate font-medium sm:font-normal">
//                   Source: {currentNews.source_name}
//                 </p>
//               </div>
//               <p className="text-xs text-gray-600 flex-shrink-0 ml-2">
//                 {new Date(currentNews.created_at).toLocaleDateString(undefined, {
//                   month: 'short',
//                   day: 'numeric'
//                 })}
//               </p>
//             </div>
            
//             {/* Read article button */}
//             <button
//               onClick={() => openArticle(currentNews.article_url)}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium transition-colors shadow-sm flex-shrink-0"
//             >
//               Read Article
//             </button>
            
//             {/* Navigation buttons */}
//             {hasMultipleNews && (
//               <div className="flex items-center justify-between mt-3 flex-shrink-0">
//                 <button
//                   onClick={handlePrevNews}
//                   disabled={currentNewsIndex === 0}
//                   className={`p-1 rounded text-xs sm:text-sm ${
//                     currentNewsIndex === 0
//                       ? "text-gray-400 cursor-not-allowed"
//                       : "text-blue-600 hover:bg-blue-50"
//                   }`}
//                 >
//                   ← Prev
//                 </button>
//                 <span className="text-xs text-gray-500">
//                   {currentNewsIndex + 1} of {selectedNewsGroup.length}
//                 </span>
//                 <button
//                   onClick={handleNextNews}
//                   disabled={currentNewsIndex === selectedNewsGroup.length - 1}
//                   className={`p-1 rounded text-xs sm:text-sm ${
//                     currentNewsIndex === selectedNewsGroup.length - 1
//                       ? "text-gray-400 cursor-not-allowed"
//                       : "text-blue-600 hover:bg-blue-50"
//                   }`}
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}
//           </div>
//           </InfoWindowF>
//         )}
//       </GoogleMap>

//       {/* Loading overlay */}

//       {/* Error message */}

//     </div>
//   );
// }