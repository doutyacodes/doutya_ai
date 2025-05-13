"use client"
import ReactDOMServer from "react-dom/server";
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { 
    MapPin, AlertTriangle, Building2, UserRound, Car, Cloud, 
    PartyPopper, Swords, Megaphone, AlertCircle, Trophy, 
    Heart, Briefcase, Film, Laptop, FlaskConical, GraduationCap, 
    Leaf, Users, Train, Globe
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
  "Accident": <Car size={24} className="text-amber-600" />,
  "Weather": <Cloud size={24} className="text-blue-400" />,
  "Festival / Event": <PartyPopper size={24} className="text-purple-500" />,
  "Conflict / War": <Swords size={24} className="text-red-800" />,
  "Public Announcement": <Megaphone size={24} className="text-blue-600" />,
  "Emergency Alert": <AlertCircle size={24} className="text-red-500" />,
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

const createCategoryMarkerIcon = (category, newsCount = 0) => {
  const color = category ? categoryColors[category] || categoryColors.Default : categoryColors.Default;
  
  // Get the corresponding icon for the category
    // Get the corresponding icon for the category
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
  
  // Create SVG string from the icon component with improved styling
  const iconSvg = ReactDOMServer.renderToString(
    <IconComponent color="white" size={22} strokeWidth={2.5} />
  );
  
  // Create the SVG marker with improved visibility
  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 58" width="48" height="58">
        <!-- Enhanced drop shadow filter -->
        <defs>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.4" />
          </filter>
        </defs>
        
        <!-- Marker background with stronger white border -->
        <path 
          d="M24 2C14.06 2 6 10.06 6 20c0 9.5 18 32 18 32s18-22.5 18-32c0-9.94-8.06-18-18-18z" 
          fill="${color}"
          stroke="white"
          stroke-width="3"
          filter="url(#shadow)"
        />
        
        <!-- Icon positioned in center of marker -->
        <g transform="translate(13, 11) scale(1)">${iconSvg}</g>
        
        <!-- Counter background circle for multiple items -->
        ${newsCount > 1 ? `
          <circle cx="36" cy="12" r="10" fill="white" stroke="#333" stroke-width="1.5" />
          <text x="36" y="16" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="#333">${newsCount}</text>
        ` : ''}
      </svg>
    `)}`,
    scaledSize: { width: 48, height: 58 },
    anchor: { x: 24, y: 52 },
    labelOrigin: { x: 24, y: 20 }
  };
};

// Group news by location


const MapLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-10">
      {/* Mobile and Desktop Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 mb-2 block md:hidden"
      >
        {isExpanded ? 'Hide Legend' : 'Show Legend'}
      </button>

      {/* Legend Container with added bg-opacity */}
      <div 
        className={`
          bg-white/70 backdrop-blur-sm shadow-lg rounded-lg p-4 
          ${isExpanded ? 'block' : 'hidden md:block'}
          max-h-[70vh] overflow-y-auto
          w-64 max-w-[calc(100vw-2rem)]
        `}
      >
        <h3 className="text-lg font-semibold mb-3 border-b pb-2">News Categories</h3>
        
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(categoryIcons).map(([category, icon]) => (
            category !== 'Default' && (
              <div 
                key={category} 
                className="flex items-center space-x-3 hover:bg-gray-50/90 p-2 rounded transition-colors"
              >
                {/* Render the icon */}
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

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Fetch news data based on map bounds
 

  // Get user's location



  // Initial data fetch and location request
  useEffect(() => {
    fetchNewsData();
    getUserLocation();
  }, [fetchNewsData, getUserLocation]);

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

      <MapLegend /> {/* the legends */}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || center}
        zoom={userLocation ? USER_LOCATION_ZOOM : DEFAULT_ZOOM}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: true,
          zoomControl: true,
          gestureHandling: "greedy", // This enables one finger pan on mobile
        }}
        onLoad={(map) => setMapRef(map)}
        onIdle={(map) => handleBoundsChanged(map)}
      >
        {/* News Markers */}
        {Object.keys(groupedNews).map((locationKey) => {
        const [lat, lng] = locationKey.split(',').map(parseFloat);
        const newsAtLocation = groupedNews[locationKey];
        const mainNews = newsAtLocation[0]; // Use the first (most recent) news for the marker
        
        return (
          <MarkerF
            key={locationKey}
            position={{ lat, lng }}
            onClick={() => handleMarkerClick(locationKey)}
            icon={createCategoryMarkerIcon(mainNews.category, newsAtLocation.length)}
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

      {/* Error message */}
    </div>
  );
}