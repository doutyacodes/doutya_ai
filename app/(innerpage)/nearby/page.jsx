"use client"
import ReactDOMServer from "react-dom/server";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF, Circle  } from "@react-google-maps/api";
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
    X,
    Loader2,
    Newspaper,
    Tag,
    HardHat,
    Vote,
    Calendar,
    Flame,
    ShieldCheck,
    Bus,
    Siren,
    CloudRain,
    Search,
    RefreshCw,
    RotateCw
  } from "lucide-react";
import { useRouter } from "next/navigation";
import CreatorPopupModal from "@/app/_components/CreatorPopupModal";
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

const MAX_RADIUS_KM = 10; // 10km radius limit
const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers
const USER_LOCATION_ZOOM = 14; // Zoom level when user location is available
const DEFAULT_ZOOM = 10; // Default zoom level
// Add buffer factor to create extended restriction bounds
const BUFFER_FACTOR = 1.5; // Allow 50% more area beyond the data radius


// Category icons mapping using Lucide React components for local community news
const categoryIcons = {
  "News": <Newspaper size={24} className="text-blue-600" />,
  "Alert": <AlertTriangle size={24} className="text-red-600" />,
  "Emergency": <Siren size={24} className="text-red-700" />,
  "Weather": <CloudRain size={24} className="text-sky-500" />,
  "Events": <Calendar size={24} className="text-purple-600" />,
  "Festival": <PartyPopper size={24} className="text-pink-500" />,
  "Obituary": <Heart size={24} className="text-gray-700" />,
  "Public Notice": <Megaphone size={24} className="text-orange-600" />,
  "Lost & Found": <Search size={24} className="text-teal-600" />,
  "Ads": <Tag size={24} className="text-green-600" />,
  "Classifieds": <Briefcase size={24} className="text-yellow-600" />,
  "Default": <Globe size={24} className="text-gray-500" />
};

// Category colors for map markers or other UI elements
const categoryColors = {
  "News": "#2563EB",         // Blue-600
  "Alert": "#DC2626",        // Red-600
  "Emergency": "#B91C1C",    // Red-700
  "Weather": "#0EA5E9",      // Sky-500
  "Events": "#9333EA",       // Purple-600
  "Festival": "#EC4899",     // Pink-500
  "Obituary": "#374151",     // Gray-700
  "Public Notice": "#EA580C", // Orange-600
  "Lost & Found": "#0D9488", // Teal-600
  "Ads": "#16A34A",          // Green-600
  "Classifieds": "#CA8A04", // Yellow-600
  "Default": "#6B7280"       // Gray-500
};

// Category descriptions for reference
const categoryDescriptions = {
  "News": "General local news and updates",
  "Alert": "Important community alerts and warnings",
  "Emergency": "Emergency situations and urgent notices",
  "Weather": "Local weather updates and warnings",
  "Events": "Community events and gatherings",
  "Festival": "Local festivals and celebrations",
  "Obituary": "Community obituaries and memorials",
  "Public Notice": "Official announcements and public notices",
  "Lost & Found": "Lost items, missing persons, found items",
  "Ads": "Local advertisements and promotions",
  "Default": "Uncategorized content"
};

const createCategoryMarkerIcon = (category, newsCount = 0, itemType = 'news') => {
  // Get color based on category or item type
  let color;
  if (itemType === 'obituary') {
    color = "#374151"; // Gray-700 for obituaries
  } else if (itemType === 'classified') {
    color = "#16A34A"; // Green-600 for classifieds
  } else {
    color = category ? categoryColors[category] || categoryColors.Default : categoryColors.Default;
  }
  
  // Get the corresponding icon for the category or item type
  let IconComponent;
  
  if (itemType === 'obituary') {
    IconComponent = Heart; // Heart icon for obituaries
  } else if (itemType === 'classified') {
    IconComponent = Tag; // Tag icon for classifieds
  } else {
    // Handle news categories
    switch(category) {
      case "News":
        IconComponent = Newspaper;
        break;
      case "Alert":
        IconComponent = AlertTriangle;
        break;
      case "Emergency":
        IconComponent = Siren;
        break;
      case "Weather":
        IconComponent = CloudRain;
        break;
      case "Events":
        IconComponent = Calendar;
        break;
      case "Festival":
        IconComponent = PartyPopper;
        break;
      case "Public Notice":
        IconComponent = Megaphone;
        break;
      case "Lost & Found":
        IconComponent = Search;
        break;
      case "Ads":
        IconComponent = Tag;
        break;
      case "Classifieds":
        IconComponent = Briefcase;
        break;
      default:
        IconComponent = Globe;
    }
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

const ResetZoomButton = ({ mapRef, buttonStyle, fetchNewsData, setSelectedLocation }) => {
  const handleResetZoom = () => {
    if (mapRef) {
      // Smooth animation to default view
      mapRef.panTo(center);
      mapRef.setZoom(DEFAULT_ZOOM);
    }
    setSelectedLocation(null)
    fetchNewsData();
  };

  return (
    <button 
      onClick={handleResetZoom}
      className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
      style={buttonStyle}
      title="Reset to world view"
    >
      <RotateCw size={16} className="mr-1" />
      <span className="text-sm">Reset</span>
    </button>
  );
};

const MobileResetButton = ({ mapRef, fetchNewsData, setSelectedLocation }) => {
  const handleReset = () => {
    if (mapRef) {
      mapRef.panTo(center);
      mapRef.setZoom(DEFAULT_ZOOM);
    }
    setSelectedLocation(null)
    fetchNewsData();
  };

  return (
    <button 
      onClick={handleReset}
      className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
      title="Reset to world view"
      style={{
        width: '48px',
        height: '48px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      <RotateCw size={20} />
    </button>
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

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(categoryIcons).filter(cat => cat !== 'Default')
  );

  const router = useRouter()

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [showCreatorModal, setShowCreatorModal] = useState(true);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const markersRef = useRef([]);
  const clusterRef = useRef(null);

  const timeoutRef = useRef(null);


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

  // Add this utility function to calculate distance between coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = EARTH_RADIUS_KM * c; // Distance in km
  
  return distance;
};

// Add this function to restrict map boundaries
const restrictMapBounds = useCallback(() => {
  if (!mapRef || !userLocation) return;
  
  const currentCenter = mapRef.getCenter();
  const currentLat = currentCenter.lat();
  const currentLng = currentCenter.lng();
  
  const distance = calculateDistance(
    userLocation.lat, 
    userLocation.lng, 
    currentLat, 
    currentLng
  );
  
  // If user tries to move beyond 10km, move them back
  if (distance > MAX_RADIUS_KM) {
    // Calculate direction from user location to current position
    const angle = Math.atan2(
      currentLat - userLocation.lat,
      currentLng - userLocation.lng
    );
    
    // Set new position at the edge of the allowed circle
    const newLat = userLocation.lat + (Math.sin(angle) * MAX_RADIUS_KM / 111); // 1 degree lat ≈ 111km
    const newLng = userLocation.lng + (Math.cos(angle) * MAX_RADIUS_KM / 
      (111 * Math.cos(userLocation.lat * Math.PI / 180))); // Adjust for longitude at that latitude
    
    mapRef.panTo({ lat: newLat, lng: newLng });
  }
}, [mapRef, userLocation]);

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
              scaledSize: new google.maps.Size(baseSize.width, baseSize.height),
              anchor: new google.maps.Point(baseSize.width/2, baseSize.height - 4),
            },
            zIndex: 10000, // Higher than regular markers
          });
        },
      };
    };

    const handleClusterClick = (event, cluster, map) => {
      if (!mapRef) return;
      
      // In newer versions, we need to access the cluster differently
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

  // Fetch news data based on map bounds
    const fetchNewsData = useCallback(async (bounds) => {
    // Don't attempt to fetch data if we don't have user location
    if (!userLocation) {
        console.log("No user location available, skipping fetch");
        return;
    }

    try {
        setIsLoading(true);
        
        // Create bounds parameters if available
        let url = '/api/hyperlocal/map';
        
        if (bounds) {
        const { north, south, east, west } = bounds;
        url += `?north=${north}&south=${south}&east=${east}&west=${west}&userLat=${userLocation.lat}&userLng=${userLocation.lng}&radius=${MAX_RADIUS_KM}`;
        } else {
        // Always include user location
        url += `?userLat=${userLocation.lat}&userLng=${userLocation.lng}&radius=${MAX_RADIUS_KM}`;
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
    }, [userLocation]); // We do need userLocation in the dependency array

  // Updated to handle modal states
  const getCurrentPosition = () => {
    console.log("Getting User Location")
    setIsGettingLocation(true); 
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        console.log("latitude, longitude", latitude, longitude)
        console.log("Setting User Location")
        // If map is available, pan and zoom to user location
        if (mapRef) {
          mapRef.panTo({ lat: latitude, lng: longitude });
          mapRef.setZoom(USER_LOCATION_ZOOM);
        }
        console.log("Initiate Fetch news")
        fetchNewsData();

        // Hide modal and reset loading state
        setShowLocationPrompt(false);
        setIsLoading(false);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setLocationError("Failed to get your location. Please try again or use the default view.");
        setLocationLoading(false);
      }
    );
  };

  // Get user's location
  const getUserLocation = useCallback(() => {
    console.log("Initiate User Location fuction")

      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              console.log("Granted User Location fuction")
              // Permission already granted, get location
              getCurrentPosition();
            } else if (permissionStatus.state === "prompt") {
              // Show our custom modal instead of the browser prompt
              setIsLoading(false);
              setShowLocationPrompt(true);
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

    // Initial data fetch and location request
    useEffect(() => {
      getUserLocation();
    }, []);

    // Only fetch data when user location is available and not when prompt is showing
    useEffect(() => {
      if (userLocation && !showLocationPrompt) {
        fetchNewsData();
      }
    }, [userLocation]);
  

  // Handle map bounds change
    const handleBoundsChanged = (map) => {
    // Only process if we have user location
    if (!userLocation) return;

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

  const truncate = (text, length = 100) => {
    if (!text) return "";
      return text.length > length ? text.slice(0, length) + "..." : text;
  };


  // Handle marker click
  const handleMarkerClick = (locationKey, index = 0) => {
    const [lat, lng] = locationKey.split(',').map(parseFloat);
    setSelectedLocation({ key: locationKey, lat, lng });
    setCurrentNewsIndex(index);
    resetImageIndex(); // Reset image index when switching locations
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

  // Helper function to parse images for classifieds
  const parseImages = (imageString) => {
    if (!imageString) return [];
    try {
      // Try parsing as JSON array first
      return JSON.parse(imageString);
    } catch {
      // Fallback to comma-separated string
      return imageString.split(',').map(url => url.trim()).filter(url => url);
    }
  };

  // Helper function to get current image for classifieds
  const getCurrentImage = (imageString, index = 0) => {
    const images = parseImages(imageString);
    return images[index] || images[0] || "/placeholders/news-placeholder.jpg";
  };

  // Helper function to get total image count
  const getImageCount = (imageString) => {
    return parseImages(imageString).length;
  };

  // Reset image index when location changes
  const resetImageIndex = () => {
    setCurrentImageIndex(0);
  };

  // Navigate through images for classifieds
  const handleNextImage = () => {
    if (currentNews && currentNews.type === 'classified') {
      const totalImages = getImageCount(currentNews.image_url);
      setCurrentImageIndex(prev => (prev + 1) % totalImages);
    }
  };

  const handlePrevImage = () => {
    if (currentNews && currentNews.type === 'classified') {
      const totalImages = getImageCount(currentNews.image_url);
      setCurrentImageIndex(prev => (prev - 1 + totalImages) % totalImages);
    }
  };

  // Open article in new tab
  const openArticle = (id) => {
    window.open(`/nearby/article/${id}`, '_blank');
    // router.push(`/nearby/article/${id}`);
  };

  // Open handleClassifieds in new tab
  const handleClassifieds = (id) => {
    window.open(`/nearby/classifieds/${id}`, '_blank');
  };

      // Handle allow button click in modal
  const handleAllowLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    getCurrentPosition();
  };

  // In your existing map page component:
const handleNavigateToCreator = () => {
  // Navigate to your creator page
  router.push('/nearby/home');
};

  // Add this component inside your NewsMap function 
  const LocationPrompt = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(null);
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    
    // Start countdown when redirecting
    useEffect(() => {
      if (showRedirectMessage) {
        let timeLeft = 5;
        setCountdown(timeLeft);
        
        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            router.push('/newsonmap');
          }
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }, [showRedirectMessage, router]);

    const handleCancel = () => {
      // User clicked "Cancel" - show redirect message
      setShowRedirectMessage(true);
    };

    // If we're showing the redirect message
    if (showRedirectMessage) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <MapPin className="h-12 w-12 text-red-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Redirecting</h3>
              <p className="text-gray-700 mb-4 text-center">
                This feature requires location access to work properly. You&apos;re being redirected to News Maps page.
              </p>
              <div className="p-3 bg-red-50 border border-red-100 rounded text-red-700 text-center font-medium">
                Redirecting in {countdown} seconds...
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default location prompt
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
              This feature requires your location. You can only see news within 10km of where you are.
            </p>
            <p className="text-gray-600 text-sm italic mb-2">
              Not allowing location access will redirect you to the News Maps page.
            </p>
            {locationError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
                {locationError}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAllowLocation}
              disabled={locationLoading}
              className="w-full px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {locationLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Getting Location...
                </span>
              ) : (
                'Allow Location Access'
              )}
            </button>
            <button
              onClick={handleCancel}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
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

  // Handle marker clustering
  useEffect(() => {
    if (!mapRef || !isLoaded || Object.keys(groupedNews).length === 0) return;

    // Clear existing cluster
    if (clusterRef.current) {
      clusterRef.current.clearMarkers();
      clusterRef.current.setMap(null);
    }

    // Clear existing markers from ref
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // Create new markers
    const newMarkers = Object.keys(groupedNews).map((locationKey) => {
      const [lat, lng] = locationKey.split(',').map(parseFloat);
      const newsAtLocation = groupedNews[locationKey];
      const mainNews = newsAtLocation[0];
      
      if (mainNews.category && !selectedCategories.includes(mainNews.category)) {
        return null;
      }

      // Handle filtering for different item types
      if (mainNews.type === 'obituary' && !selectedCategories.includes('Obituary')) {
        return null;
      }
      if (mainNews.type === 'classified' && !selectedCategories.includes('Ads')) {
        return null;
      }
      if (mainNews.type === 'news' && mainNews.category && !selectedCategories.includes(mainNews.category)) {
        return null;
      }
      
      const hasHighPriorityNews = newsAtLocation.some(news => news.is_high_priority);
      
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: null,
        icon: createCategoryMarkerIcon(
          mainNews.category, 
          newsAtLocation.length, 
          mainNews.type // Pass the item type (news/classified/obituary)
        ),
        zIndex: hasHighPriorityNews ? 9999 : 1,
      });
      // Add click listener to marker
      marker.addListener('click', () => {
        handleMarkerClick(locationKey);
      });

      return marker;
    }).filter(Boolean);

    markersRef.current = newMarkers;

    // Create cluster
    if (newMarkers.length > 0) {
      const cluster = new MarkerClusterer({
        map: mapRef,
        markers: newMarkers,
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

    // Cleanup function
    return () => {
      if (clusterRef.current) {
        clusterRef.current.clearMarkers();
        clusterRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current = [];
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

  // // Add this before the return statement
  // useEffect(() => {
  //   const style = document.createElement('style');
  //   style.textContent = `
  //     /* Move Google Maps controls up from bottom and hide pan control */
  //     .gm-style .gm-bundled-control {
  //       margin-bottom: 60px !important;
  //     }
  //   `;
  //   document.head.appendChild(style);
    
  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium">Loading Map...</div>
      </div>
    );
  }
  console.log("groupedNews", groupedNews)
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
      {showCreatorModal && userLocation && !showLocationPrompt && (
        <CreatorPopupModal onNavigateToCreator={handleNavigateToCreator} />
      )}

      {/* Show location prompt if needed */}
      {/* {showLocationPrompt && <LocationPrompt />} */}
      {showLocationPrompt && !isLoading && <LocationPrompt />}

      {/* Button Container - replaces both FilterPanel and CreatorButton calls */}
      <div className="absolute top-3 right-4 z-10 flex flex-col items-end gap-2">
        {/* Buttons Row */}
        <div className="flex gap-2 items-center">
          {/* Creator Button - Desktop only, hidden on mobile when filter expanded */}
          {!isMobile && (
            <button 
              onClick={() => router.push('/nearby/home')}
              className="bg-red-800 hover:bg-red-900 text-white shadow-md rounded-lg p-2 transition-colors duration-200 flex items-center justify-center"
              style={buttonStyle}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
              <span>Be a Creator</span>
            </button>
          )}

          {/* Filter Toggle Button - Expands on desktop when clicked */}
          <button 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center ${
              isFilterExpanded && !isMobile ? 'w-64' : ''
            }`}
            style={buttonStyle}
          >
            <span>{isFilterExpanded ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {!isMobile && <ResetZoomButton mapRef={mapRef} buttonStyle={buttonStyle} fetchNewsData={fetchNewsData} setSelectedLocation={setSelectedLocation}/>}

        </div>

        {/* Mobile Creator Button - Below filter button, hidden when filter expanded */}
        {isMobile && !isFilterExpanded && (
          <button 
            onClick={() => router.push('/nearby/home')}
            className="bg-red-800 hover:bg-red-900 text-white shadow-md rounded-lg p-2 transition-colors duration-200 flex items-center justify-center w-full"
            style={buttonStyle}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            <span>Be a Creator</span>
          </button>
        )}

        {/* Filter Panel */}
        {isFilterExpanded && (
          <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-lg p-4 max-h-[70vh] overflow-y-auto w-64 max-w-[calc(100vw-2rem)]">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-lg font-semibold">News Filters</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedCategories(Object.keys(categoryIcons).filter(cat => cat !== 'Default'))}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  All
                </button>
                <button 
                  onClick={() => setSelectedCategories([])}
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
                    onClick={() => {
                      setSelectedCategories(prev => {
                        if (prev.includes(category)) {
                          return prev.filter(cat => cat !== category);
                        } else {
                          return [...prev, category];
                        }
                      });
                    }}
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

      {/* Mobile Reset Button - positioned where pan control used to be */}
      {isMobile && (
        <div className="absolute right-1.5 z-10" style={{ bottom: '165px' }}>
          <MobileResetButton 
            mapRef={mapRef} 
            fetchNewsData={fetchNewsData}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || center}
        zoom={userLocation ? USER_LOCATION_ZOOM : DEFAULT_ZOOM}
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
            gestureHandling: isGettingLocation ? "none" : "greedy", // CHANGE THIS LINE
            // Add restriction with buffer if user location exists
            restriction: userLocation ? {
              latLngBounds: {
                north: userLocation.lat + ((MAX_RADIUS_KM * BUFFER_FACTOR) / 111),
                south: userLocation.lat - ((MAX_RADIUS_KM * BUFFER_FACTOR) / 111),
                east: userLocation.lng + ((MAX_RADIUS_KM * BUFFER_FACTOR) / (111 * Math.cos(userLocation.lat * Math.PI / 180))),
                west: userLocation.lng - ((MAX_RADIUS_KM * BUFFER_FACTOR) / (111 * Math.cos(userLocation.lat * Math.PI / 180)))
              },
              strictBounds: false, // Allow some elasticity
            } : undefined,
              disableDefaultUI: true,
              zoomControl: !isGettingLocation, // Disable zoom control during location fetch
        }}
        onLoad={(map) => {
          setMapRef(map);                // existing logic
          applyGoogleMapsControlStyle(); // ✅ inject custom styling for controls
        }}
        onIdle={(map) => {
            handleBoundsChanged(map);
            // Keep bounds checks but with the buffered area
            if (userLocation) restrictMapBounds();
        }}
        onDragEnd={() => {
            // Apply restriction with buffer zone
            if (userLocation) restrictMapBounds();
        }}
      >
 
        {/* Add radius circle when user location exists */}
        {userLocation && (
            <Circle
                center={userLocation}
                radius={MAX_RADIUS_KM * 1000} // Convert km to meters
                options={{
                    fillColor: "#3B82F6", // Light blue fill
                    fillOpacity: 0.15,    // Very subtle fill
                    strokeColor: "#3B82F6", // Light blue stroke
                    strokeOpacity: 0.6,   // Moderate stroke opacity
                    strokeWeight: 2,      // Thin border
                }}
            />
        )}
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

              {/* Render different content based on type */}
              {currentNews.type === 'obituary' ? (
                // Obituary Card
                <div>
                  {/* Person Image */}
                  <div className="relative h-32 w-full overflow-hidden rounded-lg mb-3">
                    <img 
                      src={currentNews.image_url || "/placeholders/person-placeholder.jpg"} 
                      alt={currentNews.person_name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholders/person-placeholder.jpg";
                      }}
                    />
                  </div>
                  
                  {/* Obituary Details */}
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">{currentNews.person_name}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {currentNews.age && <p>Age: {currentNews.age} years</p>}
                      <p>Date of Death: {new Date(currentNews.date_of_death).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 italic">
                        Posted: {new Date(currentNews.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center text-sm text-gray-700 italic">
                      &quot;May their soul rest in peace&quot;
                    </div>
                  </div>
                </div>
              ) : currentNews.type === 'classified' ? (
                // Classified Ad Card
                <div>
                  {/* Images with navigation */}
                  <div className="relative h-40 w-full overflow-hidden rounded-lg mb-3">
                    <img 
                      src={getCurrentImage(currentNews.image_url, currentImageIndex)} 
                      alt={currentNews.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholders/news-placeholder.jpg";
                      }}
                    />
                    
                    {/* Image navigation arrows (only show if multiple images) */}
                    {getImageCount(currentNews.image_url) > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Image counter */}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {currentImageIndex + 1}/{getImageCount(currentNews.image_url)}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Classified Details */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{currentNews.title}</h3>
                  
                  <div className="mb-3 space-y-1">
                    {currentNews.price && (
                      <p className="text-lg font-bold text-green-600">₹{currentNews.price}</p>
                    )}
                    <p className="text-sm text-gray-600 capitalize">
                      <span className="font-medium">{currentNews.ad_type}</span>
                      {currentNews.item_type && ` • ${currentNews.item_type}`}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      {new Date(currentNews.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleClassifieds(currentNews.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              ) : (
                // News Card (existing)
                <div>
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
                  
                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      {truncate(currentNews.content, 120)}
                    </p>
                    <p className="text-xs text-gray-500 italic font-light text-right mt-1">
                      {new Date(currentNews.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openArticle(currentNews.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    Read Full Article
                  </button>
                </div>
              )}
              
              {/* Navigation Controls for Multiple News (only for news/classifieds, not obituaries) */}
              {hasMultipleNews && currentNews.type !== 'obituary' && (
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
              
              {/* Add CSS to hide the default close button */}
              <style jsx>{`
                .gm-ui-hover-effect {
                  display: none !important;
                }
                
                .gm-style .gm-style-iw-c {
                  padding-top: 12px !important;
                }
              `}</style>
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