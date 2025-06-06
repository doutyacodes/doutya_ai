"use client"
import ReactDOMServer from "react-dom/server";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { 
    MapPin, AlertTriangle, Building2, UserRound, Car, Cloud, 
    PartyPopper, Swords, Megaphone, AlertCircle, Trophy, 
    Heart, Briefcase, Film, Laptop, FlaskConical, GraduationCap, 
    Leaf, Users, Train, Globe,
    BadgeDollarSign,
    Ambulance,
    Clapperboard,
    Shield,
    Rocket,
    Shirt,
    BellRing,
    Flag,
    PawPrint,
    Loader2,
    Newspaper,
    Vote,
    MegaphoneIcon,
    TrendingUp,
    Music,
    HandHeart,
    Sparkles,
    Info
  } from "lucide-react";
import { FaHandcuffs } from "react-icons/fa6";
import { GiCrossedSwords } from "react-icons/gi";

// Map container styles
const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

// Default center position (world view)
const center = {
  lat: 20,
  lng: 0,
};

// Map zoom levels
const DEFAULT_ZOOM = 2;
const USER_LOCATION_ZOOM = 7;

// Category icons mapping using Lucide React components

// Get website favicon

// Group news by location

const LanguageFilter = ({ 
  availableLanguages, 
  selectedLanguages, 
  setSelectedLanguages, 
  buttonStyle, 
  isMobile 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLanguage = (languageCode) => {
    setSelectedLanguages(prev => {
      if (prev.includes(languageCode)) {
        return prev.filter(code => code !== languageCode);
      } else {
        return [...prev, languageCode];
      }
    });
  };

  const selectAllLanguages = () => {
    setSelectedLanguages(availableLanguages.map(lang => lang.code));
  };

  const clearAllLanguages = () => {
    setSelectedLanguages([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && !event.target.closest('.language-filter')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  return (
    <div className="relative language-filter">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
        style={buttonStyle}
      >
        <Globe size={16} className="mr-1" />
        <span className="text-sm">Languages</span>
      </button>

      {isExpanded && (
        <div 
          className={`absolute top-12 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-4 max-h-[70vh] overflow-y-auto w-64 max-w-[calc(100vw-2rem)] z-20 ${
            isMobile ? 'right-0' : 'left-0'
          }`}
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-lg font-semibold">Languages</h3>
            <div className="flex gap-2">
              <button 
                onClick={selectAllLanguages}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                All
              </button>
              <button 
                onClick={clearAllLanguages}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {availableLanguages.map((language) => (
              <div 
                key={language.code} 
                className="flex items-center space-x-3 hover:bg-gray-50/90 p-2 rounded transition-colors cursor-pointer"
                onClick={() => toggleLanguage(language.code)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedLanguages.includes(language.code)}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600"
                />
                <div 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500"
                >
                  <Globe size={16} color="white" />
                </div>
                <span className="text-sm text-gray-700">{language.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterPanel = ({ selectedCategories, setSelectedCategories, buttonStyle, isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories(Object.keys(categoryIcons).filter(cat => cat !== 'Default'));
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && !event.target.closest('.filter-panel')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  return (
    <div className="filter-panel">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 mb-2 w-full flex items-center justify-center"
        style={buttonStyle}
      >
        <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
      </button>

      {isExpanded && (
        <div 
          className={`bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-4 max-h-[70vh] overflow-y-auto w-64 max-w-[calc(100vw-2rem)] ${isMobile ? 'absolute top-12 right-0' : ''}`}
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-lg font-semibold">News Filters</h3>
            <div className="flex gap-2">
              <button 
                onClick={selectAllCategories}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                All
              </button>
              <button 
                onClick={clearAllCategories}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(categoryIcons).map(([category, icon]) => (
              category !== 'Default' && (
                <div 
                  key={category} 
                  className="flex items-center space-x-3 hover:bg-gray-50/90 p-2 rounded transition-colors cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(category)}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600"
                  />
                  
                  <div 
                    className="w-8 h-8 flex items-center justify-center rounded-full"
                    style={{ 
                      backgroundColor: categoryColors[category] || categoryColors.Default,
                      color: 'white'
                    }}
                  >
                    {React.cloneElement(icon, { 
                      size: 20, 
                      strokeWidth: 2.5,
                      color: 'white'
                    })}
                  </div>
                  <span className="text-sm text-gray-700">{category}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function NewsMap() {

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);


  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(categoryIcons).filter(cat => cat !== 'Default')
  );

  // Add refs to store state for mobile restoration
  const userLocationRef = useRef(null);
  const mapCenterRef = useRef(null);
  const mapZoomRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const userHasInteractedRef = useRef(false); // Track if user has manually moved the map

  const markersRef = useRef([]);
  const clusterRef = useRef(null);

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const isMobile = useMediaQuery({ maxWidth: 640 });

  const buttonStyle = {
    minWidth: isMobile ? '80px' : '100px',
    height: isMobile ? '34px' : '38px'
  };

  // Store user location in sessionStorage for persistence

  // Retrieve user location from sessionStorage

  // Fetch news data based on map bounds
  const fetchNewsData = useCallback(async (bounds, languages = []) => {
    try {
      setIsLoading(true);
      
      let url = '/api/news/map';
      const params = new URLSearchParams();
      
      // Comment out bounds filtering - fetch all data
      // if (bounds) {
      //   const { north, south, east, west } = bounds;
      //   params.append('north', north);
      //   params.append('south', south);
      //   params.append('east', east);
      //   params.append('west', west);
      // }
      
      if (languages.length > 0) {
        params.append('languages', languages.join(','));
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      
      const data = await response.json();
      setNewsItems(data);
      
      const grouped = groupNewsByLocation(data);
      setGroupedNews(grouped);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch available languages

  // Check location permission status

  // Get user's location

  // Handle allow button click in modal

  // Handle cancel button click in modal

  // Get current position

  // Handle marker click

  // Initial data fetch and location request

  // Handle selected languages change

  // Handle page visibility change to restore map state on mobile ONLY

  // Handle marker clustering

  // Handle zoom changes to update cluster marker sizes

  // Handle map load
    const handleMapLoad = (map) => {
        setMapRef(map);
        
        // If we have stored user location, apply it immediately
        const storedLocation = getStoredUserLocation();
        if (storedLocation && isInitialLoadRef.current) {
        setUserLocation(storedLocation);
        userLocationRef.current = storedLocation;
        map.panTo(storedLocation);
        map.setZoom(USER_LOCATION_ZOOM);
        isInitialLoadRef.current = false;
        }
        
        // Add map interaction listeners to track user interaction
        const addInteractionListeners = () => {
        map.addListener('dragstart', () => {
            userHasInteractedRef.current = true;
        });
        
        map.addListener('zoom_changed', () => {
            // Only mark as interaction if it's not the initial zoom
            if (!isInitialLoadRef.current) {
            userHasInteractedRef.current = true;
            }
        });

        // Also track clicks on the map
        map.addListener('click', () => {
            userHasInteractedRef.current = true;
        });
        };

    // Add listeners immediately but mark initial load as complete after delay
    addInteractionListeners();
    setTimeout(() => {
        isInitialLoadRef.current = false;
    }, 2000);
    
    // Add listeners after a short delay to avoid initial load events
    setTimeout(addInteractionListeners, 1000);
    };

  // Navigate through news at the same location
  
  // Open article in new tab

  // Custom Map Type Controls Component

  // Loading state

  // Get current news item for the info window

  // Determine map center and zoom - always use default for full world view
  const mapCenter = center; // Always use default center
  const mapZoom = DEFAULT_ZOOM; // Always use default zoom
  // const mapCenter = userLocation || center; // Commented out
  // const mapZoom = userLocation ? USER_LOCATION_ZOOM : DEFAULT_ZOOM; // Commented ou

  return (
    <div className="relative">
      {/* Location permission modal */}
      {showLocationModal && (
        <LocationModal 
          onAllow={handleAllowLocation}
          onCancel={handleCancelLocation}
          isLoading={locationLoading}
          error={locationError}
        />
      )}

      {/* Filter Controls - Desktop and Mobile */}
      <div className="absolute top-3 right-4 z-10">
        {isMobile ? (
          <MobileFilterDropdown
            availableLanguages={availableLanguages}
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            showFiltersDropdown={showFiltersDropdown}
            setShowFiltersDropdown={setShowFiltersDropdown}
            buttonStyle={buttonStyle}
          />
        ) : (
          <div className="flex gap-2">
            <LanguageFilter
              availableLanguages={availableLanguages}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              buttonStyle={buttonStyle}
              isMobile={isMobile}
            />
            <FilterPanel 
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              buttonStyle={buttonStyle}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
        }}
        onLoad={handleMapLoad}
        // onIdle={handleBoundsChanged} // Commented out - not fetching based on bounds anymore
      >
        {/* Custom Map Type Controls */}

        {/* Info Window Card*/}

      </GoogleMap>

      {/* Loading overlay */}
    </div>
  );
}