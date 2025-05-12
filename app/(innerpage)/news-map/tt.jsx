
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
            {/* the news card code */}
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Loading overlay */}


      {/* Error message */}

    </div>
  );
}