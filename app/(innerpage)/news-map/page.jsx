"use client"
import ReactDOMServer from "react-dom/server";
import { useState, useEffect, useCallback } from "react";
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

// Category colors for markers
const categoryColors = {
  "Natural Disaster": "#ef4444",
  "Crime": "#b91c1c",
  "Politics": "#1e40af",
  "Protest": "#f97316",
  "Accident": "#d97706",
  "Weather": "#60a5fa",
  "Festival / Event": "#a855f7",
  "Conflict / War": "#991b1b",
  "Public Announcement": "#2563eb",
  "Emergency Alert": "#ef4444",
  "Sports": "#ca8a04",
  "Health": "#16a34a",
  "Business": "#4b5563",
  "Entertainment": "#ec4899",
  "Technology": "#6366f1",
  "Science": "#0d9488",
  "Education": "#1d4ed8",
  "Environment": "#22c55e",
  "Social Issues": "#9333ea",
  "Transportation": "#06b6d4",
  "Default": "#6b7280"
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

// Create SVG marker URLs with embedded category icons
// Update the createCategoryMarkerIcon function to use the Lucide React components

const createCategoryMarkerIcon = (category) => {
    const color = category ? categoryColors[category] || categoryColors.Default : categoryColors.Default;
    
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
  
    // Create SVG string from the icon component
    const iconSvg = ReactDOMServer.renderToString(
      <IconComponent color="white" size={16} />
    );
    
    // Create the SVG marker with the rendered icon
    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
          <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <g transform="translate(6, 5) scale(0.75)">${iconSvg}</g>
        </svg>
      `)}`,
      scaledSize: { width: 36, height: 36 },
      anchor: { x: 18, y: 36 },
      labelOrigin: { x: 18, y: 36 }
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
  
  // Sort each group by created_at (newest first)
  Object.keys(groupedNews).forEach(key => {
    groupedNews[key].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  });
  
  return groupedNews;
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
  const fetchNewsData = useCallback(async (bounds) => {
    try {
      setIsLoading(true);
      
      // Create bounds parameters if available
      let url = '/api/news/map';
      if (bounds) {
        const { north, south, east, west } = bounds;
        url += `?north=${north}&south=${south}&east=${east}&west=${west}`;
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
  }, []);

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
            // Show a custom prompt explaining why we need location
            const confirmGeolocation = window.confirm(
              "Would you like to see news from your local area? Please allow location access."
            );
            if (confirmGeolocation) {
              getCurrentPosition();
            }
          }
          // If denied, we'll use the default world view
        });
    }
  }, []);

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
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  };

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
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || center}
        zoom={userLocation ? USER_LOCATION_ZOOM : DEFAULT_ZOOM}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: true,
          zoomControl: true,
        }}
        onLoad={(map) => setMapRef(map)}
        onIdle={(map) => handleBoundsChanged(map)}
      >
        {/* News Markers */}
        {Object.keys(groupedNews).map((locationKey) => {
          const [lat, lng] = locationKey.split(',').map(parseFloat);
          const newsAtLocation = groupedNews[locationKey];
          const mainNews = newsAtLocation[0]; // Use the first (most recent) news for the marker
          const categoryColor = mainNews.category ? 
            categoryColors[mainNews.category] || categoryColors.Default : 
            categoryColors.Default;
          
          return (
            <MarkerF
                key={locationKey}
                position={{ lat, lng }}
                onClick={() => handleMarkerClick(locationKey)}
                icon={createCategoryMarkerIcon(mainNews.category)}
                label={
                    newsAtLocation.length > 1 
                    ? {
                        text: `${newsAtLocation.length}`,
                        color: "#333",
                        fontSize: "10px",
                        fontWeight: "bold",
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