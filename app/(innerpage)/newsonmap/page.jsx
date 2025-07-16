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
    RotateCw,
    DollarSign,
    AlertOctagon,
    Speaker,
    Target
  } from "lucide-react";
import { FaHandcuffs } from "react-icons/fa6";
import { GiCrossedSwords } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { applyGoogleMapsControlStyle } from "@/utils/googleMapsStyles";
import NewsMapModal, { useNewsMapModal } from "@/app/_components/NewsMapModal";

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

const categoryColors = {
    "Natural Disaster": "#DC2626", // red-600
    "Crime": "#B45309", // amber-700
    "Politics": "#4338CA", // indigo-600
    "Geopolitics": "#1E293B", // slate-800 (dark blue-gray)
    "Protest": "#EA580C", // orange-600
    "Accident": "#B91C1C", // red-700 (darker red for emphasis)
    "Weather": "#06B6D4", // cyan-500
    "Festival / Event": "#EC4899", // pink-500
    "Conflict / War": "#7F1D1D", // red-900 (darkest red)
    "Public Announcement": "#2563EB", // blue-600
    "Emergency Alert": "#EF4444", // red-500
    "Sports": "#CA8A04", // yellow-600
    "Health": "#E11D48", // rose-600
    "Business": "#475569", // slate-700
    "Entertainment": "#8B5CF6", // violet-500
    "Technology": "#1D4ED8", // blue-700
    "Science": "#0D9488", // teal-600
    "Education": "#047857", // emerald-700
    "Environment": "#65A30D", // lime-600
    "Social Issues": "#9333EA", // purple-600
    "Transportation": "#4B5563", // gray-600
    "Automobiles": "#3F3F46", // zinc-700
    "Finance": "#15803D", // green-700
    "Movies": "#C026D3", // fuchsia-600
    "Cricket": "#D97706", // amber-600
    "Military": "#57534E", // stone-600
    "Space": "#075985", // sky-800
    "Lifestyle": "#FB7185", // rose-400
    "Wildlife": "#C2410C", // orange-700
    "Default": "#6B7280" // gray-500
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
  
  switch (category) {
    case "Natural Disaster":
      IconComponent = AlertTriangle;
      break;
    case "Crime":
      IconComponent = FaHandcuffs;
      break;
    case "Politics":
      IconComponent = Vote;
      break;
    case "Geopolitics":
      IconComponent = Globe;
      break;
    case "Protest":
      IconComponent = Megaphone;
      break;
    case "Accident":
      IconComponent = AlertOctagon;
      break;
    case "Weather":
      IconComponent = Cloud;
      break;
    case "Festival / Event":
      IconComponent = PartyPopper;
      break;
    case "Conflict / War":
      IconComponent = GiCrossedSwords;
      break;
    case "Public Announcement":
      IconComponent = Speaker;
      break;
    case "Emergency Alert":
      IconComponent = BellRing;
      break;
    case "Sports":
      IconComponent = Trophy;
      break;
    case "Health":
      IconComponent = Heart;
      break;
    case "Business":
      IconComponent = DollarSign;
      break;
    case "Entertainment":
      IconComponent = Music;
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
      IconComponent = HandHeart;
      break;
    case "Transportation":
      IconComponent = Train;
      break;
    case "Automobiles":
      IconComponent = Car;
      break;
    case "Finance":
      IconComponent = TrendingUp;
      break;
    case "Movies":
      IconComponent = Clapperboard;
      break;
    case "Cricket":
      IconComponent = Target;
      break;
    case "Military":
      IconComponent = Shield;
      break;
    case "Space":
      IconComponent = Rocket;
      break;
    case "Lifestyle":
      IconComponent = Sparkles;
      break;
    case "Wildlife":
      IconComponent = PawPrint;
      break;
    default:
      IconComponent = Info;
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
  buttonStyle,
  categoryIcons,
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

const FilterPanel = ({ selectedCategories, setSelectedCategories, buttonStyle, isMobile, categoryIcons }) => {
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

const ResetZoomButton = ({ mapRef, buttonStyle, fetchNewsData, selectedLanguages, setSelectedLocation }) => {
  const handleResetZoom = () => {
    if (mapRef) {
      // Smooth animation to default view
      mapRef.panTo(center);
      mapRef.setZoom(DEFAULT_ZOOM);
    }
    setSelectedLocation(null)
    fetchNewsData(null, selectedLanguages);
  };

  return (
    <button 
      onClick={handleResetZoom}
      className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
      style={buttonStyle}
      title="Reset to world view"
    >
      <RotateCw size={16} className="mr-1" />
      <span className="text-sm">World View</span>
    </button>
  );
};

const MobileResetButton = ({ mapRef, fetchNewsData, selectedLanguages, setSelectedLocation }) => {
  const handleReset = () => {
    if (mapRef) {
      mapRef.panTo(center);
      mapRef.setZoom(DEFAULT_ZOOM);
    }
    setSelectedLocation(null)
    fetchNewsData(null, selectedLanguages);
  };

  return (
    <button 
      onClick={handleReset}
      className="bg-white border-4 border-gray-400 shadow-lg rounded-full hover:bg-gray-50 hover:border-blue-400 active:scale-95 transition-all duration-200 flex items-center justify-center"
      title="Reset to world view"
      style={{
        width: '55px',
        height: '55px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <span className="text-gray-700 hover:text-blue-600 font-semibold text-[9px] leading-tight text-center transition-colors duration-200">
        World<br />View
      </span>
    </button>
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

  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  const categoryIcons = {
      "Natural Disaster": <AlertTriangle size={window.innerWidth < 640 ? 12 : 16} className="text-red-600" />,
      "Crime": <FaHandcuffs size={window.innerWidth < 640 ? 12 : 16} className="text-amber-700" />,
      "Politics": <Vote size={window.innerWidth < 640 ? 12 : 16} className="text-indigo-600" />,
      "Geopolitics": <Globe size={window.innerWidth < 640 ? 12 : 16} className="text-slate-800" />,
      "Protest": <Megaphone size={window.innerWidth < 640 ? 12 : 16} className="text-orange-600" />,
      "Accident": <AlertOctagon size={window.innerWidth < 640 ? 12 : 16} className="text-red-700" />,
      "Weather": <Cloud size={window.innerWidth < 640 ? 12 : 16} className="text-cyan-500" />,
      "Festival / Event": <PartyPopper size={window.innerWidth < 640 ? 12 : 16} className="text-pink-500" />,
      "Conflict / War": <GiCrossedSwords size={window.innerWidth < 640 ? 12 : 16} className="text-red-900" />,
      "Public Announcement": <Speaker size={window.innerWidth < 640 ? 12 : 16} className="text-blue-600" />,
      "Emergency Alert": <BellRing size={window.innerWidth < 640 ? 12 : 16} className="text-red-500" />,
      "Sports": <Trophy size={window.innerWidth < 640 ? 12 : 16} className="text-yellow-600" />,
      "Health": <Heart size={window.innerWidth < 640 ? 12 : 16} className="text-rose-600" />,
      "Business": <DollarSign size={window.innerWidth < 640 ? 12 : 16} className="text-slate-700" />,
      "Entertainment": <Music size={window.innerWidth < 640 ? 12 : 16} className="text-violet-500" />,
      "Technology": <Laptop size={window.innerWidth < 640 ? 12 : 16} className="text-blue-700" />,
      "Science": <FlaskConical size={window.innerWidth < 640 ? 12 : 16} className="text-teal-600" />,
      "Education": <GraduationCap size={window.innerWidth < 640 ? 12 : 16} className="text-emerald-700" />,
      "Environment": <Leaf size={window.innerWidth < 640 ? 12 : 16} className="text-lime-600" />,
      "Social Issues": <HandHeart size={window.innerWidth < 640 ? 12 : 16} className="text-purple-600" />,
      "Transportation": <Train size={window.innerWidth < 640 ? 12 : 16} className="text-gray-600" />,
      "Automobiles": <Car size={window.innerWidth < 640 ? 12 : 16} className="text-zinc-700" />,
      "Finance": <TrendingUp size={window.innerWidth < 640 ? 12 : 16} className="text-green-700" />,
      "Movies": <Clapperboard size={window.innerWidth < 640 ? 12 : 16} className="text-fuchsia-600" />,
      "Cricket": <Target size={window.innerWidth < 640 ? 12 : 16} className="text-amber-600" />,
      "Military": <Shield size={window.innerWidth < 640 ? 12 : 16} className="text-stone-600" />,
      "Space": <Rocket size={window.innerWidth < 640 ? 12 : 16} className="text-sky-800" />,
      "Lifestyle": <Sparkles size={window.innerWidth < 640 ? 12 : 16} className="text-rose-400" />,
      "Wildlife": <PawPrint size={window.innerWidth < 640 ? 12 : 16} className="text-orange-700" />,
      "Default": <Info size={window.innerWidth < 640 ? 12 : 16} className="text-gray-500" />
  };


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
  const existingMarkersRef = useRef(new Map()); // Track markers by location key


  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const {
    isModalOpen,
    forceOpen,
    openModal,
    closeModal,
    checkAndOpenModal
  } = useNewsMapModal();

    // Use ref to ensure we only call checkAndOpenModal once
    const hasTriggeredModalCheck = useRef(false);

    // Check and open modal when component mounts (for auto-show on first 2 visits)
    useEffect(() => {
      // Only trigger once per component mount
      if (!hasTriggeredModalCheck.current) {
        hasTriggeredModalCheck.current = true;
        checkAndOpenModal();
      }
    }, []); // Empty dependency array - only run on mount

    // Reset the trigger flag when component unmounts
    useEffect(() => {
      return () => {
        hasTriggeredModalCheck.current = false;
      };
    }, []);

  const isMobile = useMediaQuery({ maxWidth: 640 });

  const buttonStyle = {
    minWidth: isMobile ? '60px' : '100px',  // Changed from 80px to 60px for mobile
    height: isMobile ? '28px' : '38px',     // Changed from 34px to 28px for mobile
    fontSize: isMobile ? '12px' : '14px'    // Added smaller font size for mobile
  };


  // Manual trigger function for help button
  const handleHelpClick = () => {
    openModal(true); // Force open regardless of visit count
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
  const fetchNewsData = useCallback(async (bounds, languages = [], isAutoRefresh = false) => {
    try {
      // Don't show loading spinner for auto-refresh
      if (!isAutoRefresh) {
        setIsLoading(true);
      }
      
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
      // Only show error for manual fetches, not auto-refresh
      if (!isAutoRefresh) {
        setError("Failed to load news data");
      }
    } finally {
      if (!isAutoRefresh) {
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch user's country and center coordinates
  const fetchUserCountry = useCallback(async () => {
    try {
      const response = await fetch('/api/news/user-location');
      if (response.ok) {
        const data = await response.json();
        setUserCountry(data.country);
        if (data.center) {
          setCountryCenter(data.center);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user country:', error);
      // Fallback to default center
      setCountryCenter(center);
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

  // Handle marker click
  const handleMarkerClick = useCallback((locationKey, index = 0) => {
    const [lat, lng] = locationKey.split(',').map(parseFloat);
    setSelectedLocation({ key: locationKey, lat, lng });
    setCurrentNewsIndex(index);
  }, []);

  const createClusterRenderer = () => {
    return {
      render: ({ count, position }) => {
        // Get current zoom level to adjust marker size
        const currentZoom = mapRef ? mapRef.getZoom() : 5;
        
        // Calculate marker size based on zoom level
        let baseSize, iconSize, fontSize, badgeRadius, strokeWidth;
        
        if (currentZoom <= 3) {
          // Very zoomed out (world view)
          baseSize = { width: 36, height: 42 };
          iconSize = 16;
          fontSize = "8";
          badgeRadius = 8;
          strokeWidth = 2;
        } else if (currentZoom <= 6) {
          // Country/continent level
          baseSize = { width: 44, height: 52 };
          iconSize = 20;
          fontSize = "9";
          badgeRadius = 10;
          strokeWidth = 2.5;
        } else {
          // Regional/city level
          baseSize = { width: 56, height: 66 };
          iconSize = 26;
          fontSize = "11";
          badgeRadius = 12;
          strokeWidth = 3;
        }
        
        // Create a distinctive cluster marker
        const clusterColor = '#9333EA'; // Purple color to distinguish from news markers
        
        const iconSvg = ReactDOMServer.renderToString(
          <Newspaper color="white" size={iconSize} strokeWidth={strokeWidth} />
        );

        console.log('Current zoom:', currentZoom, 'Base size:', baseSize);

        // Create SVG with proper scaling path
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${baseSize.width} ${baseSize.height}" width="${baseSize.width}" height="${baseSize.height}">
            <defs>
              <filter id="cluster-shadow-${Date.now()}" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.4" />
              </filter>
            </defs>
            
            <!-- Main cluster marker shape - classic map pin -->
            <path 
              d="
                M ${baseSize.width / 2},4
                C ${baseSize.width * 0.9},4 ${baseSize.width * 0.95},${baseSize.height * 0.5} ${baseSize.width / 2},${baseSize.height - 2}
                C ${baseSize.width * 0.05},${baseSize.height * 0.5} ${baseSize.width * 0.1},4 ${baseSize.width / 2},4
                Z
              "
              fill="${clusterColor}"
              stroke="white"
              stroke-width="${strokeWidth}"
              filter="url(#cluster-shadow-${Date.now()})"
            />

            
            <!-- Icon inside marker -->
            <g transform="translate(${baseSize.width/2 - iconSize/2}, ${baseSize.height * 0.2})">${iconSvg}</g>
            
            <!-- Count badge at top-right corner -->
            <circle 
              cx="${baseSize.width - (badgeRadius + 2)}" 
              cy="${badgeRadius + 2}" 
              r="${badgeRadius}" 
              fill="#EF4444" 
              stroke="white" 
              stroke-width="2" 
            />
            <text 
              x="${baseSize.width - (badgeRadius + 2)}" 
              y="${badgeRadius + 2 + parseInt(fontSize)/3}" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="bold" 
              text-anchor="middle" 
              fill="white"
            >${count}</text>
          </svg>
        `;
        
        return new google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
            scaledSize: new google.maps.Size(baseSize.width, baseSize.height), // Use dynamic scaling
            anchor: new google.maps.Point(baseSize.width/2, baseSize.height - 4),
          },
          zIndex: 10000, // Higher than regular markers
        });
      },
    };
  };

  // Initial data fetch and location request
  useEffect(() => {
    fetchLanguages();
    // getUserLocation(); // Commented out - fetch full data instead of user location
  }, [fetchLanguages]); // Removed getUserLocation and hasAskedForLocation dependencies

  // Fetch user country on component mount
  useEffect(() => {
    fetchUserCountry();
  }, [fetchUserCountry]);

  // Handle selected languages change
  useEffect(() => {
      if (availableLanguages.length > 0 && selectedLanguages.length >= 0) {
      fetchNewsData(null, selectedLanguages, false); // false = manual fetch
      }
  }, [selectedLanguages, fetchNewsData, availableLanguages.length]);

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

  // Handle marker clustering
  useEffect(() => {
    if (!mapRef || !isLoaded || Object.keys(groupedNews).length === 0) return;

    // Get current markers map
    const currentMarkers = existingMarkersRef.current;
    const newLocationKeys = new Set(Object.keys(groupedNews));
    const existingLocationKeys = new Set(currentMarkers.keys());

    // Remove markers that no longer exist
    for (const locationKey of existingLocationKeys) {
      if (!newLocationKeys.has(locationKey)) {
        const marker = currentMarkers.get(locationKey);
        if (marker) {
          marker.setMap(null);
          currentMarkers.delete(locationKey);
        }
      }
    }

    // Update or create markers
    const allMarkers = [];
    Object.keys(groupedNews).forEach((locationKey) => {
      const [lat, lng] = locationKey.split(',').map(parseFloat);
      const newsAtLocation = groupedNews[locationKey];
      const mainNews = newsAtLocation[0];
      
      if (mainNews.category && !selectedCategories.includes(mainNews.category)) {
        // Hide marker if category not selected
        if (currentMarkers.has(locationKey)) {
          currentMarkers.get(locationKey).setMap(null);
        }
        return;
      }
      
      const hasHighPriorityNews = newsAtLocation.some(news => news.is_high_priority);
      
      let marker = currentMarkers.get(locationKey);
      
      if (marker) {
        // Update existing marker
        marker.setMap(mapRef);
        marker.setIcon(createCategoryMarkerIcon(
          mainNews.category, 
          newsAtLocation.length, 
          hasHighPriorityNews
        ));
        marker.setZIndex(hasHighPriorityNews ? 9999 : 1);
      } else {
        // Create new marker
        marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef,
          icon: createCategoryMarkerIcon(
            mainNews.category, 
            newsAtLocation.length, 
            hasHighPriorityNews
          ),
          zIndex: hasHighPriorityNews ? 9999 : 1,
        });

        // Add click listener to new marker
        marker.addListener('click', () => {
          handleMarkerClick(locationKey);
        });

        currentMarkers.set(locationKey, marker);
      }
      
      allMarkers.push(marker);
    });

    // Update cluster with all visible markers
    if (clusterRef.current) {
      clusterRef.current.clearMarkers();
      clusterRef.current.setMap(null);
    }

    if (allMarkers.length > 0) {
      const cluster = new MarkerClusterer({
        map: mapRef,
        markers: allMarkers,
        renderer: createClusterRenderer(),
        algorithmOptions: {
          maxZoom: 12,
          radius: 80,
        },
      });

      cluster.addListener('click', (event, cluster, map) => {
        handleClusterClick(event, cluster, map);
      });
      clusterRef.current = cluster;
    }

    // Update markersRef for compatibility
    markersRef.current = allMarkers;

    // Cleanup function
    return () => {
      if (clusterRef.current) {
        clusterRef.current.clearMarkers();
        clusterRef.current.setMap(null);
      }
      // Don't clear existingMarkersRef here - we want to keep markers for reuse
    };
  }, [mapRef, isLoaded, groupedNews, selectedCategories]);

  // Handle zoom changes to update cluster marker sizes
  useEffect(() => {
    if (!mapRef || !clusterRef.current) return;
    
    const handleZoomChange = () => {
      // Small delay to ensure zoom has completed
      setTimeout(() => {
        // Get current markers
        const currentMarkers = markersRef.current;
        if (currentMarkers.length > 0) {
          // Clear the existing cluster
          clusterRef.current.clearMarkers();
          clusterRef.current.setMap(null);
          
          // Create new cluster with updated renderer
          const newCluster = new MarkerClusterer({
            map: mapRef,
            markers: currentMarkers,
            renderer: createClusterRenderer(),
            algorithmOptions: {
              maxZoom: 12,
              radius: 80,
            },
          });

          newCluster.addListener('click', (event, cluster, map) => {
            handleClusterClick(event, cluster, map);
          });
          
          clusterRef.current = newCluster;
        }
      }, 100);
    };
    
    const zoomListener = mapRef.addListener('zoom_changed', handleZoomChange);
    
    return () => {
      if (zoomListener) {
        google.maps.event.removeListener(zoomListener);
      }
    };
  }, [mapRef]);

  // Auto-refresh news data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (availableLanguages.length > 0) {
        fetchNewsData(null, selectedLanguages, true); // true = auto-refresh
        setLastFetchTime(Date.now());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchNewsData, selectedLanguages, availableLanguages.length]);

  // Cleanup all markers on component unmount
  useEffect(() => {
    return () => {
      // Clean up all markers when component unmounts
      existingMarkersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      existingMarkersRef.current.clear();
    };
  }, []);

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

// Custom Zoom Controls Component
  const ZoomControls = ({ mapRef }) => {
    const handleZoomIn = () => {
      if (!mapRef) return;
      const currentZoom = mapRef.getZoom();
      mapRef.setZoom(currentZoom + 1);
    };

    const handleZoomOut = () => {
      if (!mapRef) return;
      const currentZoom = mapRef.getZoom();
      mapRef.setZoom(currentZoom - 1);
    };

    return (
      <div className="absolute right-3.5 z-10 bg-white shadow-md rounded-lg overflow-hidden" style={{ bottom: isMobile ? '150px' : '115px' }}>
        <button 
          onClick={handleZoomIn}
          className="block w-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center border-b border-gray-200"
          style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 'normal'
          }}
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          className="block w-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
          style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 'normal'
          }}
        >
          −
        </button>
      </div>
    );
  };

  const handleClusterClick = (event, cluster, map) => {
    if (!mapRef) return;
    
    // In newer versions, we need to access the cluster differently
    // The event might contain the cluster information
    let markers = [];
    
    if (cluster && cluster.markers) {
      markers = cluster.markers;
    } else if (cluster && cluster.getMarkers) {
      markers = cluster.getMarkers();
    } else if (event && event.cluster) {
      markers = event.cluster.markers || [];
    } else {
      console.log('Cluster structure:', cluster, 'Event:', event);
      return;
    }
    
    if (markers.length === 0) return;
    
    // Calculate bounds that include all markers in the cluster
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
      bounds.extend(marker.getPosition());
    });
    
    // Smoothly fit the map to show all markers in the cluster
    mapRef.fitBounds(bounds, {
      duration: 800, // 800ms animation
    });

    // Ensure minimum zoom level for better visibility with smooth transition
    const listener = google.maps.event.addListener(mapRef, 'idle', () => {
      if (mapRef.getZoom() > 12) {
        mapRef.setZoom(12);
        // Add smooth transition for zoom adjustment too
        setTimeout(() => {
          mapRef.panTo(mapRef.getCenter());
        }, 100);
      }
      google.maps.event.removeListener(listener);
    });
  };

  // Help Button Component (place this below your ZoomControls component)
  const HelpButton = ({ isMobile }) => {
    return (
      <div className="absolute right-2.5 z-10" style={{ bottom: isMobile ? '100px' : '55px' }}>
        <button 
          onClick={handleHelpClick}
          className="bg-red-800 hover:bg-red-900 transition-colors duration-200 flex items-center justify-center rounded-full shadow-md"
          style={{
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
          }}
        >
          <svg 
            width={isMobile ? '20' : '24'} 
            height={isMobile ? '20' : '24'} 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
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
  const mapCenter = countryCenter;
  const mapZoom = DEFAULT_ZOOM; // Always use default zoom
  // const mapCenter = userLocation || center; // Commented out
  // const mapZoom = userLocation ? USER_LOCATION_ZOOM : DEFAULT_ZOOM; // Commented ou

  return (
    <div className="relative">
      
      {/* The Modal Component */}
      <NewsMapModal
        isOpen={isModalOpen}
        onClose={closeModal}
        forceOpen={forceOpen}
      />

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
              categoryIcons={categoryIcons}
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
                categoryIcons={categoryIcons}
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
          zoomControl: false,
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
          disableDefaultUI: true,
        }}
        onLoad={handleMapLoad}
      >
        {/* Custom Map Type Controls */}
        <MapTypeControls mapRef={mapRef} />

        {/* Custom Zoom Controls */}
        <ZoomControls mapRef={mapRef} />

        {/* Help Button below ZoomControls */}
        <HelpButton isMobile={isMobile} />

        {/* Info Window */}
        {currentNews && (
          <InfoWindowF
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -5),
              disableAutoPan: false,
              maxWidth: window.innerWidth < 640 ? 280 : 320
            }}
          >
          <div className="w-full max-w-[280px] sm:max-w-[320px] relative select-none min-h-[300px] sm:min-h-96 flex flex-col justify-between">
            {/* Header section with category and close button aligned */}
            <div className="relative w-full mb-3 flex-shrink-0 flex items-center justify-center">
              <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full inline-flex items-center justify-center gap-0.5 shadow-sm">
                <span className="flex items-center justify-center text-[10px] sm:text-xs">
                  {currentNews.category ? 
                    categoryIcons[currentNews.category] || categoryIcons.Default : 
                    categoryIcons.Default}
                </span>
                <span className="text-xs sm:text-sm">{currentNews.category || "News"}</span>
              </span>
              
              <button 
                onClick={() => setSelectedLocation(null)}
                className="absolute right-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors border border-gray-200"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <style jsx>{`
              .gm-ui-hover-effect {
                display: none !important;
              }
              
              .gm-style-iw-chr {
                display: none !important;
              }
              
              .gm-style-iw-t button.gm-ui-hover-effect,
              .gm-style-iw-chr button {
                display: none !important;
              }
              
              .gm-style-iw-c {
                padding: 8px !important;
              }
              
              .gm-style-iw-d {
                width: 100% !important;
                max-width: 100% !important;
                overflow: hidden !important;
              }
                          
              .summary-scroll::-webkit-scrollbar {
                width: 3px;
              }
              
              .summary-scroll::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 2px;
              }
              
              .summary-scroll::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 2px;
              }
              
              .summary-scroll::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
              
              @media (max-width: 640px) {
                .gm-style-iw-c {
                  padding: 6px !important;
                }
              }
            `}</style>
            
            {/* Image section */}
            <div className="relative h-24 sm:h-32 w-full overflow-hidden rounded-md sm:rounded-lg mb-3 flex-shrink-0">
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
            
            {/* Title section */}
            <h3 className="font-semibold text-sm sm:text-base mb-3 leading-tight flex-shrink-0">
              {currentNews.title}
            </h3>
            
            {/* Summary Section with Fixed Height and Scroll */}
            {currentNews.summary && (
              <div className="mb-3 flex-shrink-0">
                <div 
                  className="h-26 md:h-20 overflow-y-auto summary-scroll pr-1"
                  key={`summary-${currentNews.id || currentNewsIndex}`}
                >
                  <p className="text-xs sm:text-sm text-gray-700 leading-tight sm:leading-normal text-justify">
                    {currentNews.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Spacer to push bottom content down */}
            <div className="flex-grow"></div>
            
            {/* Source and date section */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                {currentNews.article_url && (
                  <img
                    src={getFavicon(currentNews.article_url)}
                    alt=""
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <p className="text-xs sm:text-sm text-gray-800 truncate font-medium sm:font-normal">
                  Source: {currentNews.source_name}
                </p>
              </div>
              <p className="text-xs text-gray-600 flex-shrink-0 ml-2">
                {new Date(currentNews.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            {/* Read article button */}
            <button
              onClick={() => openArticle(currentNews.article_url)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium transition-colors shadow-sm flex-shrink-0"
            >
              Read Article
            </button>
            
            {/* Navigation buttons */}
            {hasMultipleNews && (
              <div className="flex items-center justify-between mt-3 flex-shrink-0">
                <button
                  onClick={handlePrevNews}
                  disabled={currentNewsIndex === 0}
                  className={`p-1 rounded text-xs sm:text-sm ${
                    currentNewsIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  ← Prev
                </button>
                <span className="text-xs text-gray-500">
                  {currentNewsIndex + 1} of {selectedNewsGroup.length}
                </span>
                <button
                  onClick={handleNextNews}
                  disabled={currentNewsIndex === selectedNewsGroup.length - 1}
                  className={`p-1 rounded text-xs sm:text-sm ${
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