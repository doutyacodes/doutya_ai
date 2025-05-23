"use client"
import ReactDOMServer from "react-dom/server";
import React, { useState, useEffect, useCallback } from "react";
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
  "Accident": <Ambulance size={24} className="text-amber-600" />, // Changed to Ambulance
  "Weather": <Cloud size={24} className="text-blue-400" />,
  "Festival / Event": <PartyPopper size={24} className="text-purple-500" />,
  "Conflict / War": <Swords size={24} className="text-red-800" />,
  "Public Announcement": <Megaphone size={24} className="text-blue-600" />,
  "Emergency Alert": <BellRing size={24} className="text-red-500" />, // Changed to BellRing
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
  "Natural Disaster": "#FF8C00",     // Dark Orange
  "Crime": "#2E8B57",                // Sea Green
  "Politics": "#1E90FF",             // Dodger Blue
  "Protest": "#FF4500",              // Orangered
  "Accident": "#8A2BE2",             // Blue Violet
  "Weather": "#00CED1",              // Dark Turquoise
  "Festival / Event": "#FF1493",     // Deep Pink
  "Conflict / War": "#B22222",       // Firebrick (your red)
  "Public Announcement": "#FFD700",  // Gold
  "Emergency Alert": "#FF00FF",      // Fuchsia
  "Sports": "#00FF00",               // Bright Lime
  "Health": "#DC143C",               // Crimson (reddish but distinct from Firebrick)
  "Business": "#4682B4",             // Steel Blue
  "Entertainment": "#FF69B4",        // Hot Pink
  "Technology": "#7B68EE",           // Medium Slate Blue
  "Science": "#A9A9A9",              // Dark Gray (as you requested)
  "Education": "#000000",            // Black
  "Environment": "#228B22",          // Forest Green
  "Social Issues": "#FF6347",        // Tomato (warmer, more orange-red)
  "Transportation": "#40E0D0",       // Turquoise
  "Automobiles": "#C71585",          // Medium Violet Red
  "Finance": "#008080",              // Teal
  "Movies": "#800080",               // Purple
  "Cricket": "#DAA520",              // Goldenrod
  "Military": "#556B2F",             // Dark Olive Green
  "Space": "#483D8B",                // Dark Slate Blue
  "Lifestyle": "#FF7F50",            // Coral
  "Wildlife": "#6B8E23",             // Olive Drab
  "Default": "#A52A2A"               // Brown
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
  
  // Make high priority markers slightly larger
  const markerSize = hasHighPriority ? { width: 52, height: 62 } : { width: 48, height: 58 };
  const iconSize = hasHighPriority ? 24 : 22;
  const strokeWidth = hasHighPriority ? 3 : 2.5;
  
  // Get the corresponding icon for the category
  let IconComponent;
  // ... (keep all your existing switch cases)
  
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

  // Create SVG string from the icon component
  const iconSvg = ReactDOMServer.renderToString(
    <IconComponent color="white" size={iconSize} strokeWidth={strokeWidth} />
  );

  // High priority indicator
  const priorityIndicator = hasHighPriority ? `
    <!-- High Priority Indicator - Red dot -->
    <circle cx="38" cy="8" r="6" fill="#FF0000" stroke="white" stroke-width="2" />
    <circle cx="38" cy="8" r="3" fill="white" />
  ` : '';

  // Create the SVG marker with dynamic sizing
  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${markerSize.width} ${markerSize.height}" width="${markerSize.width}" height="${markerSize.height}">
        <defs>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.4" />
          </filter>
        </defs>
        
        <!-- Marker background with stronger border for high priority -->
        <path 
          d="M24 2C14.06 2 6 10.06 6 20c0 9.5 18 32 18 32s18-22.5 18-32c0-9.94-8.06-18-18-18z" 
          fill="${color}"
          stroke="white"
          stroke-width="${hasHighPriority ? 4 : 3}"
          filter="url(#shadow)"
        />
        
        <!-- Icon positioned in center of marker -->
        <g transform="translate(${hasHighPriority ? 12 : 13}, 11) scale(1)">${iconSvg}</g>
        
        <!-- High Priority Indicator -->
        ${priorityIndicator}
        
        <!-- Counter background circle for multiple items -->
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
  
  // REPLACE THE EXISTING SORTING LOGIC WITH THIS:
  // Sort each group by priority first, then by created_at (newest first)
  Object.keys(groupedNews).forEach(key => {
    groupedNews[key].sort((a, b) => {
      // First sort by priority (high priority first)
      if (a.is_high_priority !== b.is_high_priority) {
        return b.is_high_priority - a.is_high_priority;
      }
      // If priority is same, sort by created_at (newest first)
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

  return (
    <div className="relative">
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
          className={`absolute top-12 bg-white/70 backdrop-blur-sm shadow-lg rounded-lg p-4 max-h-[70vh] overflow-y-auto w-64 max-w-[calc(100vw-2rem)] z-20 ${
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
    <div className="relative">
      <button 
        onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
        className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
        style={buttonStyle}
      >
        <span>Filters</span>
      </button>

      {showFiltersDropdown && (
        <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-64 max-w-[calc(100vw-2rem)] z-20">
          {/* Filter Options */}
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

          {/* Language Filter Content */}
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

          {/* Category Filter Content */}
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
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded when page loads

  // Function to toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Select all categories
  const selectAllCategories = () => {
    setSelectedCategories(Object.keys(categoryIcons).filter(cat => cat !== 'Default'));
  };

  // Clear all categories
  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="">
      {/* Fixed position toggle button for both mobile and desktop */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 mb-2 w-full flex items-center justify-center"
        style={buttonStyle}
      >
        <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
      </button>

      {/* Filter Container with opacity - positioned differently based on device */}
      {isExpanded && (
        <div 
          className={`bg-white/70 backdrop-blur-sm shadow-lg rounded-lg p-4 max-h-[70vh] overflow-y-auto w-64 max-w-[calc(100vw-2rem)] ${isMobile ? 'absolute top-12 right-0' : ''}`}
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
                  {/* Checkbox */}
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(category)}
                    onChange={() => {}} // Handled by the div click
                    className="w-4 h-4 text-blue-600"
                  />
                  
                  {/* Icon */}
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

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(categoryIcons).filter(cat => cat !== 'Default')
  );

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const mapControlStyles = {
    // Common styles for both map type and filter buttons
    button: {
      minWidth: '100px',
      height: '38px',
      '@media (max-width: 640px)': {
        minWidth: '80px',
        height: '34px',
        fontSize: '0.875rem',
      }
    }
  };

  // Then inside your component function
  const isMobile = useMediaQuery({ maxWidth: 640 });

  // Use this to conditionally apply styles
  const buttonStyle = {
    minWidth: isMobile ? '80px' : '100px',
    height: isMobile ? '34px' : '38px'
  };

// Replace your existing fetchNewsData and fetchLanguages functions with these:

// Fetch news data based on map bounds
const fetchNewsData = useCallback(async (bounds, languages = []) => {
  try {
    setIsLoading(true);
    
    // Create bounds parameters if available
    let url = '/api/news/map';
    const params = new URLSearchParams();
    
    if (bounds) {
      const { north, south, east, west } = bounds;
      params.append('north', north);
      params.append('south', south);
      params.append('east', east);
      params.append('west', west);
    }
    
    // Add language filtering
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
    
    // Group news by location
    const grouped = groupNewsByLocation(data);
    setGroupedNews(grouped);
  } catch (err) {
    console.error("Error fetching news:", err);
    setError("Failed to load news data");
  } finally {
    setIsLoading(false);
  }
}, []); // Remove selectedLanguages dependency

// Fetch available languages
const fetchLanguages = useCallback(async () => {
  try {
    const response = await fetch('/api/newstech/news-map/languages');
    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }
    const result = await response.json();
    setAvailableLanguages(result.languages);
    // Select all languages by default
    const allLanguageCodes = result.languages.map(lang => lang.code);
    setSelectedLanguages(allLanguageCodes);
    
    // Fetch news data after languages are loaded with the new languages
    fetchNewsData(mapBounds, allLanguageCodes);
  } catch (err) {
    console.error("Error fetching languages:", err);
  }
}, [fetchNewsData, mapBounds]); // Keep only necessary dependencies


  // Get user's location
  const getUserLocation = useCallback(() => {
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              // Permission already granted, get location
              getCurrentPosition();
            } else if (permissionStatus.state === "prompt") {
              // Show our custom modal instead of the browser prompt
              setShowLocationModal(true);
            } else if (permissionStatus.state === "denied") {
              // If permission is already denied, just use default view
              console.log("Location permission was previously denied");
            }
          })
          .catch(err => {
            console.error("Error checking location permission:", err);
          });
      }
    }, []);

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

  // Updated to handle modal states
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // If map is available, pan and zoom to user location
        if (mapRef) {
          mapRef.panTo({ lat: latitude, lng: longitude });
          mapRef.setZoom(USER_LOCATION_ZOOM);
        }
        
        // Hide modal and reset loading state
        setShowLocationModal(false);
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setLocationError("Failed to get your location. Please try again or use the default view.");
        setLocationLoading(false);
      }
    );
  };

  
// Initial data fetch and location request
useEffect(() => {
  fetchLanguages();
  getUserLocation();
}, []);

// Handle selected languages change (separate effect)
useEffect(() => {
  // Only refetch if languages are already loaded and changed
  if (availableLanguages.length > 0 && selectedLanguages.length >= 0) {
    fetchNewsData(mapBounds, selectedLanguages);
  }
}, [selectedLanguages, mapBounds, fetchNewsData, availableLanguages.length]);

  // Handle map bounds change
  const handleBoundsChanged = (map) => {
    const bounds = map.getBounds();
    if (bounds) {
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
        fetchNewsData(newBounds);
      }
    }
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
  
  // State to track if the screen is in mobile view
  const [isMobile, setIsMobile] = useState(false);
  
  // Effect to check screen size and update isMobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const changeMapType = (type) => {
    if (!mapRef) return;
    mapRef.setMapTypeId(type);
    setMapType(type);
    setIsExpanded(false);
  };

  // Desktop view: Side-by-side buttons
   if (!isMobile) {
    return (
      <div className="absolute top-3 left-4 z-10 flex flex-row">
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
    <div className="absolute top-3 left-4 z-10 flex flex-col">
      {/* Main toggle button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 mb-2 flex items-center justify-center"
        style={buttonStyle}
      >
        <span>{mapType === "roadmap" ? "Map" : "Satellite"}</span>
      </button>

      {/* Dropdown options */}
      {isExpanded && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden absolute top-12 left-0">
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
        <div className="text-xl font-medium">Loading Map...</div>
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
        center={userLocation || center}
        zoom={userLocation ? USER_LOCATION_ZOOM : DEFAULT_ZOOM}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false, // Disable default map type control
          zoomControl: true,
          gestureHandling: "greedy", // This enables one finger pan on mobile
        }}
        onLoad={(map) => setMapRef(map)}
        onIdle={(map) => handleBoundsChanged(map)}
      >
        {/* Custom Map Type Controls */}
        <MapTypeControls mapRef={mapRef} />

       {/* News Markers - Sorted by priority for rendering order */}
      {Object.keys(groupedNews)
        .sort((locationKeyA, locationKeyB) => {
          // Sort location keys so high priority locations render last (appear on top)
          const newsAtLocationA = groupedNews[locationKeyA];
          const newsAtLocationB = groupedNews[locationKeyB];
          
          const hasHighPriorityA = newsAtLocationA.some(news => news.is_high_priority);
          const hasHighPriorityB = newsAtLocationB.some(news => news.is_high_priority);
          
          // High priority locations should render last (return 1 to move to end)
          if (hasHighPriorityA && !hasHighPriorityB) return 1;
          if (!hasHighPriorityA && hasHighPriorityB) return -1;
          return 0;
        })
        .map((locationKey) => {
          const [lat, lng] = locationKey.split(',').map(parseFloat);
          const newsAtLocation = groupedNews[locationKey];
          const mainNews = newsAtLocation[0];
          
          // Skip this marker if its category is not in the selected categories
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
              // High priority markers get higher z-index
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
              {/* Custom header with category badge and custom close button */}
              <div className="relative w-full mb-2">
              {/* Category badge centered */}
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

              {/* Close button at top-right corner */}
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

              
              {/* Add CSS to hide the default close button */}
              <style jsx>{`
                .gm-ui-hover-effect {
                  display: none !important;
                }
                
                /* Target the parent container's top padding to remove extra space */
                .gm-style .gm-style-iw-c {
                  padding-top: 12px !important;
                }
              `}</style>
              
              {/* News Image */}
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
              
              {/* News Content */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{currentNews.title}</h3>
              
              {/* Source with Favicon */}
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
              
              {/* Action Button */}
              <button
                onClick={() => openArticle(currentNews.article_url)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Read Full Article
              </button>
              
              {/* Navigation Controls for Multiple News */}
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
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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