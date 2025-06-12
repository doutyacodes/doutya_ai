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
    Info,
    RotateCw
  } from "lucide-react";
import { FaHandcuffs } from "react-icons/fa6";
import { GiCrossedSwords } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { applyGoogleMapsControlStyle } from "@/utils/googleMapsStyles";

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



const MobileFilterDropdown = ({ 
  availableLanguages,
  selectedLanguages,
  setSelectedLanguages,
  selectedCategories,
  setSelectedCategories,
  showFiltersDropdown,
  setShowFiltersDropdown,
  buttonStyle,
  fetchNewsData,
  mapRef 
}) => {
  const [activeFilter, setActiveFilter] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFiltersDropdown && !event.target.closest('.mobile-filter-dropdown')) {
        setShowFiltersDropdown(false);
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFiltersDropdown, setShowFiltersDropdown]);


  const FilterOption = ({ title, icon, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="text-xs text-gray-500">
        {title === 'Categories' ? `${selectedCategories.length}/${Object.keys(categoryIcons).length - 1}` : `${selectedLanguages.length}/${availableLanguages.length}`}
      </div>
    </button>
  );

  return (
    <div className="relative mobile-filter-dropdown">
      <button 
        onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
        className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
        style={buttonStyle}
      >
        <span>Filters</span>
      </button>

      {showFiltersDropdown && (
        <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg w-64 max-w-[calc(100vw-2rem)] z-20">
          <div className="border-b">
            <FilterOption
              title="Languages"
              icon={<Globe size={16} />}
              onClick={() => setActiveFilter(activeFilter === 'languages' ? null : 'languages')}
              isActive={activeFilter === 'languages'}
            />
            <FilterOption
              title="Categories"
              icon={<MapPin size={16} />}
              onClick={() => setActiveFilter(activeFilter === 'categories' ? null : 'categories')}
              isActive={activeFilter === 'categories'}
            />
          </div>

          {activeFilter === 'languages' && (
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Languages</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedLanguages(availableLanguages.map(lang => lang.code))}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setSelectedLanguages([])}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {availableLanguages.map((language) => (
                <div 
                  key={language.code}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  onClick={() => {
                    setSelectedLanguages(prev => 
                      prev.includes(language.code) 
                        ? prev.filter(code => code !== language.code)
                        : [...prev, language.code]
                    );
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedLanguages.includes(language.code)}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Globe size={16} className="text-green-500" />
                  <span className="text-sm">{language.name}</span>
                </div>
              ))}
            </div>
          )}

          {activeFilter === 'categories' && (
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Categories</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedCategories(Object.keys(categoryIcons).filter(cat => cat !== 'Default'))}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setSelectedCategories([])}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {Object.entries(categoryIcons).map(([category, icon]) => (
                category !== 'Default' && (
                  <div 
                    key={category}
                    className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedCategories(prev => 
                        prev.includes(category) 
                          ? prev.filter(cat => cat !== category)
                          : [...prev, category]
                      );
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category)}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div 
                      className="w-6 h-6 flex items-center justify-center rounded-full"
                      style={{ 
                        backgroundColor: categoryColors[category] || categoryColors.Default,
                        color: 'white'
                      }}
                    >
                      {React.cloneElement(icon, { size: 14, color: 'white' })}
                    </div>
                    <span className="text-sm">{category}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default function NewsMap() {
  const [newsItems, setNewsItems] = useState([]);
  const [groupedNews, setGroupedNews] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [mapBounds, setMapBounds] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const router = useRouter();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationPermissionState, setLocationPermissionState] = useState(null);

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [hasAskedForLocation, setHasAskedForLocation] = useState(false);

  const [userCountry, setUserCountry] = useState(null);
  const [countryCenter, setCountryCenter] = useState(center);

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


  // Handle map load
  const handleMapLoad = (map) => {
    setMapRef(map);

    // Inject custom style to adjust controls after map is fully loaded
    applyGoogleMapsControlStyle(); 
    
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


  // Custom Map Type Controls Component
  const MapTypeControls = ({ mapRef }) => {
    const [mapType, setMapType] = useState("roadmap");
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (isExpanded && !event.target.closest('.map-type-controls')) {
          setIsExpanded(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded]);
    
    const changeMapType = (type) => {
      if (!mapRef) return;
      mapRef.setMapTypeId(type);
      setMapType(type);
      setIsExpanded(false);
    };

    // Desktop view: Side-by-side buttons
    if (!isMobile) {
      /* the desktopcodewhch isalready good only */
    }
    
    // Mobile view: Dropdown menu
    return (
      <div className="absolute top-3 left-4 z-10 flex flex-col map-type-controls">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 mb-2 flex items-center justify-center"
          style={buttonStyle}
        >
          <span>{mapType === "roadmap" ? "Map" : "Satellite"}</span>
        </button>

        {isExpanded && (
          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden absolute top-12 left-0">
            <button 
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${mapType === "roadmap" ? "bg-gray-200" : ""}`}
              onClick={() => changeMapType("roadmap")}
            >
              Map
            </button>
            <button 
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${mapType === "satellite" ? "bg-gray-200" : ""}`}
              onClick={() => changeMapType("satellite")}
            >
              Satellite
            </button>
          </div>
        )}
      </div>
    );
  };



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

      <>
        {/* Filter Controls */}
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
              fetchNewsData={fetchNewsData}
              mapRef={mapRef}
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
              <ResetZoomButton mapRef={mapRef} buttonStyle={buttonStyle} fetchNewsData={fetchNewsData} selectedLanguages={selectedLanguages} 
              setSelectedLocation={setSelectedLocation}/>
            </div>
          )}
        </div>

        {/* Mobile Reset Button - positioned where pan control used to be */}
        {isMobile && (
          <div className="absolute right-1 z-10" style={{ bottom: '238px' }}>
            <MobileResetButton 
              mapRef={mapRef} 
              fetchNewsData={fetchNewsData} 
              selectedLanguages={selectedLanguages}
              setSelectedLocation={setSelectedLocation}
            />
          </div>
        )}
      </>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControlOptions: {
            position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM || 6,
          },
          panControl: false,
          rotateControl: false,
          scaleControl: false,
          gestureHandling: "greedy",
          clickableIcons: false,
          minZoom: 2,
          maxZoom: 18,
          restriction: {
            latLngBounds: {
              north: 85,
              south: -85,
              west: -180,
              east: 180,
            },
            strictBounds: true,
          },
          disableDefaultUI: true, // Try setting this to true
          zoomControl: true, // Then explicitly enable zoom control
        }}
        onLoad={handleMapLoad}
        // onIdle={handleBoundsChanged} // Commented out - not fetching based on bounds anymore
      >
        {/* Custom Map Type Controls */}
        <MapTypeControls mapRef={mapRef} />

        {/* Info Window */}
        {currentNews && (
          <InfoWindowF
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -5)
            }}
          >
          {/* The Card */}
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}