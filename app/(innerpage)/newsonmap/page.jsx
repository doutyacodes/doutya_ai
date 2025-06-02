"use client"
import ReactDOMServer from "react-dom/server";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";
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
    Loader2
  } from "lucide-react";

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
const categoryIcons = {
  "Natural Disaster": <AlertTriangle size={24} className="text-red-600" />,
  "Crime": <AlertCircle size={24} className="text-red-700" />,
  "Politics": <Building2 size={24} className="text-blue-800" />,
  "Protest": <UserRound size={24} className="text-orange-500" />,
  "Accident": <Ambulance size={24} className="text-amber-600" />,
  "Weather": <Cloud size={24} className="text-blue-400" />,
  "Festival / Event": <PartyPopper size={24} className="text-purple-500" />,
  "Conflict / War": <Swords size={24} className="text-red-800" />,
  "Public Announcement": <Megaphone size={24} className="text-blue-600" />,
  "Emergency Alert": <BellRing size={24} className="text-red-500" />,
  "Sports": <Trophy size={24} className="text-yellow-600" />,
  "Health": <Heart size={24} className="text-green-600" />,
  "Business": <Briefcase size={24} className="text-gray-700" />,
  "Entertainment": <Film size={24} className="text-pink-500" />,
  "Technology": <Laptop size={24} className="text-indigo-500" />,
  "Science": <FlaskConical size={24} className="text-teal-600" />,
  "Education": <GraduationCap size={24} className="text-blue-700" />,
  "Environment": <Leaf size={24} className="text-green-500" />,
  "Social Issues": <Users size={24} className="text-purple-600" />,
  "Transportation": <Train size={24} className="text-cyan-600" />,
  "Automobiles": <Car size={24} className="text-red-400" />,
  "Finance": <BadgeDollarSign size={24} className="text-green-700" />,
  "Movies": <Clapperboard size={24} className="text-purple-700" />,
  "Cricket": <Flag size={24} className="text-green-400" />,
  "Military": <Shield size={24} className="text-gray-800" />,
  "Space": <Rocket size={24} className="text-indigo-600" />,
  "Lifestyle": <Shirt size={24} className="text-pink-400" />,
  "Wildlife": <PawPrint size={24} className="text-amber-500" />,
  "Default": <Globe size={24} className="text-gray-500" />
};

const categoryColors = {
  "Natural Disaster": "#FF8C00",
  "Crime": "#2E8B57",
  "Politics": "#1E90FF",
  "Protest": "#FF4500",
  "Accident": "#8A2BE2",
  "Weather": "#00CED1",
  "Festival / Event": "#FF1493",
  "Conflict / War": "#B22222",
  "Public Announcement": "#FFD700",
  "Emergency Alert": "#FF00FF",
  "Sports": "#00FF00",
  "Health": "#DC143C",
  "Business": "#4682B4",
  "Entertainment": "#FF69B4",
  "Technology": "#7B68EE",
  "Science": "#A9A9A9",
  "Education": "#000000",
  "Environment": "#228B22",
  "Social Issues": "#FF6347",
  "Transportation": "#40E0D0",
  "Automobiles": "#C71585",
  "Finance": "#008080",
  "Movies": "#800080",
  "Cricket": "#DAA520",
  "Military": "#556B2F",
  "Space": "#483D8B",
  "Lifestyle": "#FF7F50",
  "Wildlife": "#6B8E23",
  "Default": "#A52A2A"
};

// Get website favicon
const getFavicon = (articleUrl) => {
  try {
    const domain = new URL(articleUrl).hostname.replace("www.", "");
    return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
  } catch (error) {
    console.error("Error getting favicon:", error);
    return null;
  }
};

const createCategoryMarkerIcon = (category, newsCount = 0, hasHighPriority = false) => {
  const color = category ? categoryColors[category] || categoryColors.Default : categoryColors.Default;
  
  const markerSize = hasHighPriority ? { width: 52, height: 62 } : { width: 48, height: 58 };
  const iconSize = hasHighPriority ? 24 : 22;
  const strokeWidth = hasHighPriority ? 3 : 2.5;
  
  let IconComponent;
  
  switch(category) {
    case "Natural Disaster":
      IconComponent = AlertTriangle;
      break;
    case "Crime":
      IconComponent = AlertCircle;
      break;
    case "Politics":
      IconComponent = Building2;
      break;
    case "Protest":
      IconComponent = UserRound;
      break;
    case "Accident":
      IconComponent = Car;
      break;
    case "Weather":
      IconComponent = Cloud;
      break;
    case "Festival / Event":
      IconComponent = PartyPopper;
      break;
    case "Conflict / War":
      IconComponent = Swords;
      break;
    case "Public Announcement":
      IconComponent = Megaphone;
      break;
    case "Emergency Alert":
      IconComponent = AlertCircle;
      break;
    case "Sports":
      IconComponent = Trophy;
      break;
    case "Health":
      IconComponent = Heart;
      break;
    case "Business":
      IconComponent = Briefcase;
      break;
    case "Entertainment":
      IconComponent = Film;
      break;
    case "Technology":
      IconComponent = Laptop;
      break;
    case "Science":
      IconComponent = FlaskConical;
      break;
    case "Education":
      IconComponent = GraduationCap;
      break;
    case "Environment":
      IconComponent = Leaf;
      break;
    case "Social Issues":
      IconComponent = Users;
      break;
    case "Transportation":
      IconComponent = Train;
      break;
    default:
      IconComponent = Globe;
  }

  const iconSvg = ReactDOMServer.renderToString(
    <IconComponent color="white" size={iconSize} strokeWidth={strokeWidth} />
  );

  const priorityIndicator = hasHighPriority ? `
    <circle cx="38" cy="8" r="6" fill="#FF0000" stroke="white" stroke-width="2" />
    <circle cx="38" cy="8" r="3" fill="white" />
  ` : '';

  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${markerSize.width} ${markerSize.height}" width="${markerSize.width}" height="${markerSize.height}">
        <defs>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.4" />
          </filter>
        </defs>
        
        <path 
          d="M24 2C14.06 2 6 10.06 6 20c0 9.5 18 32 18 32s18-22.5 18-32c0-9.94-8.06-18-18-18z" 
          fill="${color}"
          stroke="white"
          stroke-width="${hasHighPriority ? 4 : 3}"
          filter="url(#shadow)"
        />
        
        <g transform="translate(${hasHighPriority ? 12 : 13}, 11) scale(1)">${iconSvg}</g>
        
        ${priorityIndicator}
        
        ${newsCount > 1 ? `
          <circle cx="36" cy="12" r="10" fill="white" stroke="#333" stroke-width="1.5" />
          <text x="36" y="16" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="#333">${newsCount}</text>
        ` : ''}
      </svg>
    `)}`,
    scaledSize: markerSize,
    anchor: { x: 24, y: hasHighPriority ? 56 : 52 },
    labelOrigin: { x: 24, y: 20 }
  };
};

// Group news by location
const groupNewsByLocation = (newsItems) => {
  const groupedNews = {};
  
  newsItems.forEach(news => {
    const locationKey = `${news.latitude},${news.longitude}`;
    
    if (!groupedNews[locationKey]) {
      groupedNews[locationKey] = [];
    }
    
    groupedNews[locationKey].push(news);
  });
  
  Object.keys(groupedNews).forEach(key => {
    groupedNews[key].sort((a, b) => {
      if (a.is_high_priority !== b.is_high_priority) {
        return b.is_high_priority - a.is_high_priority;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
  });
  
  return groupedNews;
};

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

const MobileFilterDropdown = ({ 
  availableLanguages,
  selectedLanguages,
  setSelectedLanguages,
  selectedCategories,
  setSelectedCategories,
  showFiltersDropdown,
  setShowFiltersDropdown,
  buttonStyle
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

function LocationModal({ onAllow, onCancel, isLoading, error }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">Location Permission Required</h3>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <MapPin className="h-12 w-12 text-red-800" />
          </div>
          <p className="text-gray-700 mb-3">
            Please allow location access to continue.
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onAllow}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Getting Location...
              </span>
            ) : (
              'Allow Location Access'
            )}
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationPermissionState, setLocationPermissionState] = useState(null);

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [hasAskedForLocation, setHasAskedForLocation] = useState(false);


  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(categoryIcons).filter(cat => cat !== 'Default')
  );

  // Add refs to store state for mobile restoration
  const userLocationRef = useRef(null);
  const mapCenterRef = useRef(null);
  const mapZoomRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const userHasInteractedRef = useRef(false); // Track if user has manually moved the map

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
  const storeUserLocation = (location) => {
    try {
      sessionStorage.setItem('userLocation', JSON.stringify(location));
      userLocationRef.current = location;
    } catch (e) {
      console.warn('Could not store user location in sessionStorage');
    }
  };

  // Retrieve user location from sessionStorage
  const getStoredUserLocation = () => {
    try {
      const stored = sessionStorage.getItem('userLocation');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Could not retrieve user location from sessionStorage');
      return null;
    }
  };

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
  const fetchLanguages = useCallback(async () => {
    try {
      const response = await fetch('/api/news/languages');
      if (!response.ok) {
        throw new Error('Failed to fetch languages');
      }
      const result = await response.json(); 
      setAvailableLanguages(result.languages);
      const allLanguageCodes = result.languages.map(lang => lang.code);
      setSelectedLanguages(allLanguageCodes);
      
      // fetchNewsData(mapBounds, allLanguageCodes);
      fetchNewsData(null, allLanguageCodes); // Pass null instead of mapBounds
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  }, [fetchNewsData, mapBounds]);

  // Check location permission status
  const checkLocationPermission = useCallback(async () => {
    if (!navigator.permissions || !navigator.geolocation) {
      return 'unavailable';
    }

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      setLocationPermissionState(permission.state);
      return permission.state;
    } catch (error) {
      console.error("Error checking location permission:", error);
      return 'unavailable';
    }
  }, []);

  // Get user's location
  // const getUserLocation = useCallback(async () => {
  //   // First check if we have stored location
  //   const storedLocation = getStoredUserLocation();
  //   if (storedLocation) {
  //     setUserLocation(storedLocation);
  //     userLocationRef.current = storedLocation;
  //     return;
  //   }

  //   // Check permission status
  //   const permissionState = await checkLocationPermission();
    
  //   if (permissionState === 'granted') {
  //     // Permission already granted, get location silently
  //     getCurrentPosition();
  //   } else if (permissionState === 'prompt') {
  //     // Show our custom modal
  //     setShowLocationModal(true);
  //   }
  //   // If denied or unavailable, just use default view without showing modal
  // }, [checkLocationPermission]);

  // Get user's location
const getUserLocation = useCallback(async () => {
  // If we already asked for permission, don't ask again
  if (hasAskedForLocation) return;

  // First check if we have stored location
  const storedLocation = getStoredUserLocation();
  if (storedLocation) {
    setUserLocation(storedLocation);
    userLocationRef.current = storedLocation;
    setHasAskedForLocation(true);
    return;
  }

  // Check permission status
  const permissionState = await checkLocationPermission();
  
  if (permissionState === 'granted') {
    // Permission already granted, get location silently
    getCurrentPosition();
    setHasAskedForLocation(true);
  } else if (permissionState === 'prompt' && !hasAskedForLocation) {
    // Show our custom modal only if we haven't asked before
    setShowLocationModal(true);
    setHasAskedForLocation(true);
  }
  // If denied or unavailable, just use default view without showing modal
}, [checkLocationPermission, hasAskedForLocation]);


  // Handle allow button click in modal
  const handleAllowLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    getCurrentPosition();
  };
  
  // Handle cancel button click in modal
  const handleCancelLocation = () => {
    setShowLocationModal(false);
    console.log("User declined location access, using default world view");
  };

  // Get current position
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        
        setUserLocation(location);
        storeUserLocation(location);
        
        // If map is available, pan and zoom to user location
        if (mapRef) {
          mapRef.panTo(location);
          mapRef.setZoom(USER_LOCATION_ZOOM);
        }
        
        setShowLocationModal(false);
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setLocationError("Failed to get your location. Please try again or use the default view.");
        setLocationLoading(false);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  // Initial data fetch and location request
  useEffect(() => {
    fetchLanguages();
    // getUserLocation(); // Commented out - fetch full data instead of user location
  }, [fetchLanguages]); // Removed getUserLocation and hasAskedForLocation dependencies

    // Handle selected languages change
    useEffect(() => {
      if (availableLanguages.length > 0 && selectedLanguages.length >= 0) {
        // fetchNewsData(mapBounds, selectedLanguages);
        fetchNewsData(null, selectedLanguages); // Pass null instead of mapBounds
      }
    }, [selectedLanguages, fetchNewsData, availableLanguages.length]); // Removed mapBounds dependency

  // Handle page visibility change to restore map state on mobile ONLY
  useEffect(() => {
    // Only add visibility change handler for mobile devices
    if (!isMobile) return;

    const handleVisibilityChange = () => {
      // Only restore location if:
      // 1. Page is becoming visible
      // 2. Map ref exists
      // 3. User location exists
      // 4. User hasn't manually interacted with the map
      // 5. User gave permission (don't ask again)
      if (!document.hidden && 
          mapRef && 
          userLocationRef.current && 
          !userHasInteractedRef.current &&
          locationPermissionState === 'granted') {
        // Restore user location when page becomes visible again on mobile
        setTimeout(() => {
          mapRef.panTo(userLocationRef.current);
          mapRef.setZoom(USER_LOCATION_ZOOM);
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [mapRef, isMobile, locationPermissionState]);

  // Handle map bounds change
  const handleBoundsChanged = useCallback(() => {
    if (!mapRef) return;
    
    try {
      const bounds = mapRef.getBounds();
      if (bounds) {
        // Mark that user has interacted with the map
        userHasInteractedRef.current = true;
        
        const newBounds = {
          north: bounds.getNorthEast().lat(),
          south: bounds.getSouthWest().lat(),
          east: bounds.getNorthEast().lng(),
          west: bounds.getSouthWest().lng()
        };
        
        // Only fetch if bounds have changed significantly
        if (!mapBounds || 
            Math.abs(newBounds.north - mapBounds.north) > 0.5 ||
            Math.abs(newBounds.south - mapBounds.south) > 0.5 ||
            Math.abs(newBounds.east - mapBounds.east) > 0.5 ||
            Math.abs(newBounds.west - mapBounds.west) > 0.5) {
          setMapBounds(newBounds);
        }
      }
    } catch (error) {
      console.error('Error getting map bounds:', error);
    }
  }, [mapRef, mapBounds]);

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

  // Handle marker click
  const handleMarkerClick = (locationKey, index = 0) => {
    const [lat, lng] = locationKey.split(',').map(parseFloat);
    setSelectedLocation({ key: locationKey, lat, lng });
    setCurrentNewsIndex(index);
  };

  // Navigate through news at the same location
  const handleNextNews = () => {
    if (selectedLocation && groupedNews[selectedLocation.key]) {
      const maxIndex = groupedNews[selectedLocation.key].length - 1;
      setCurrentNewsIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
    }
  };

  const handlePrevNews = () => {
    setCurrentNewsIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Open article in new tab
  const openArticle = (url) => {
    window.open(url, '_blank');
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
      return (
        <div className="absolute top-3 left-4 z-10 flex flex-row map-type-controls">
          <button 
            onClick={() => changeMapType("roadmap")}
            className={`bg-white shadow-md p-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center rounded-l-lg border-r border-gray-200 ${mapType === "roadmap" ? "bg-gray-100" : ""}`}
            style={{
              ...buttonStyle,
              color: mapType === "roadmap" ? "black" : "rgba(0,0,0,0.5)",
              fontWeight: mapType === "roadmap" ? "500" : "normal"
            }}
          >
            Map
          </button>
          <button 
            onClick={() => changeMapType("satellite")}
            className={`bg-white shadow-md p-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center rounded-r-lg ${mapType === "satellite" ? "bg-gray-100" : ""}`}
            style={{
              ...buttonStyle,
              color: mapType === "satellite" ? "black" : "rgba(0,0,0,0.5)",
              fontWeight: mapType === "satellite" ? "500" : "normal"
            }}
          >
            Satellite
          </button>
        </div>
      );
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

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <div className="text-xl font-medium">Loading Map...</div>
        </div>
      </div>
    );
  }

  // Get current news item for the info window
  const getCurrentNewsItem = () => {
    if (!selectedLocation || !groupedNews[selectedLocation.key]) return null;
    return groupedNews[selectedLocation.key][currentNewsIndex];
  };

  const currentNews = getCurrentNewsItem();
  const selectedNewsGroup = selectedLocation ? groupedNews[selectedLocation.key] : [];
  const hasMultipleNews = selectedNewsGroup && selectedNewsGroup.length > 1;


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
        <MapTypeControls mapRef={mapRef} />

        {/* News Markers */}
        {Object.keys(groupedNews)
          .sort((locationKeyA, locationKeyB) => {
            const newsAtLocationA = groupedNews[locationKeyA];
            const newsAtLocationB = groupedNews[locationKeyB];
            
            const hasHighPriorityA = newsAtLocationA.some(news => news.is_high_priority);
            const hasHighPriorityB = newsAtLocationB.some(news => news.is_high_priority);
            
            if (hasHighPriorityA && !hasHighPriorityB) return 1;
            if (!hasHighPriorityA && hasHighPriorityB) return -1;
            return 0;
          })
          .map((locationKey) => {
            const [lat, lng] = locationKey.split(',').map(parseFloat);
            const newsAtLocation = groupedNews[locationKey];
            const mainNews = newsAtLocation[0];
            
            if (mainNews.category && !selectedCategories.includes(mainNews.category)) {
              return null;
            }
            
            const hasHighPriorityNews = newsAtLocation.some(news => news.is_high_priority);
            
            return (
              <MarkerF
                key={locationKey}
                position={{ lat, lng }}
                onClick={() => handleMarkerClick(locationKey)}
                icon={createCategoryMarkerIcon(
                  mainNews.category, 
                  newsAtLocation.length, 
                  hasHighPriorityNews
                )}
                zIndex={hasHighPriorityNews ? 9999 : 1}
                label={
                  newsAtLocation.length > 1 
                  ? {
                      text: `${newsAtLocation.length}`,
                      color: "#333",
                      fontSize: "12px",
                      fontWeight: "bold"
                  }
                  : null
                }
              />
            );
          })}

        {/* Info Window */}
        {currentNews && (
          <InfoWindowF
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -5)
            }}
          >
            <div className="max-w-xs relative select-none">
              <div className="relative w-full mb-2">
                <div className="flex justify-center">
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-800 text-sm font-medium rounded-full inline-flex items-center justify-center gap-1 shadow-sm">
                    <span className="flex items-center justify-center">
                      {currentNews.category ? 
                        categoryIcons[currentNews.category] || categoryIcons.Default : 
                        categoryIcons.Default}
                    </span>
                    <span>{currentNews.category || "News"}</span>
                  </span>
                </div>

                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 shadow-sm transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <style jsx>{`
                .gm-ui-hover-effect {
                  display: none !important;
                }
                
                .gm-style .gm-style-iw-c {
                  padding-top: 12px !important;
                }
              `}</style>
              
              <div className="relative h-40 w-full overflow-hidden rounded-lg mb-3">
                <img 
                  src={currentNews.image_url} 
                  alt={currentNews.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholders/news-placeholder.jpg";
                  }}
                />
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{currentNews.title}</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {currentNews.article_url && (
                    <img
                      src={getFavicon(currentNews.article_url)}
                      alt=""
                      className="w-4 h-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="text-sm text-gray-600">
                    Source: {currentNews.source_name}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(currentNews.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <button
                onClick={() => openArticle(currentNews.article_url)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Read Full Article
              </button>
              
              {hasMultipleNews && (
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={handlePrevNews}
                    disabled={currentNewsIndex === 0}
                    className={`p-1 rounded ${
                      currentNewsIndex === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-500">
                    {currentNewsIndex + 1} of {selectedNewsGroup.length}
                  </span>
                  <button
                    onClick={handleNextNews}
                    disabled={currentNewsIndex === selectedNewsGroup.length - 1}
                    className={`p-1 rounded ${
                      currentNewsIndex === selectedNewsGroup.length - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white py-2 px-4 rounded-full shadow-md z-10">
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
            <span>Loading news...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 py-2 px-4 rounded-full shadow-md z-10">
          {error}
        </div>
      )}
    </div>
  );
}