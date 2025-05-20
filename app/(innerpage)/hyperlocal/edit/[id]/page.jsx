'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, AlertCircle, MapPin, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import useAuthRedirect from '../../_component/useAuthRedirect';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params?.id;
  
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    content: '',
    latitude: '',
    longitude: '',
    category_id: '',
    delete_after_hours: 24,
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  
  // Location related states
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useAuthRedirect();

  // Fetch news details and categories on load
  useEffect(() => {
    if (newsId) {
      fetchNewsDetails();
      fetchCategories();
      requestLocationAccess(); // Get user's current location for validation
    }
  }, [newsId]);

  const fetchNewsDetails = async () => {
    try {
      const res = await fetch(`/api/hyperlocal/${newsId}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch news details');
      }
      
      const data = await res.json();
      const newsItem = data.news;
      
      if (!newsItem) {
        throw new Error('News item not found');
      }
      
      // Set the form data with the fetched news details
      setFormData({
        title: newsItem.title || '',
        image_url: newsItem.image_url || '',
        content: newsItem.content || '',
        latitude: newsItem.latitude ? newsItem.latitude.toString() : '',
        longitude: newsItem.longitude ? newsItem.longitude.toString() : '',
        category_id: newsItem.category_id ? newsItem.category_id.toString() : '',
        delete_after_hours: newsItem.delete_after_hours || 24,
      });
      
      // Store the original image URL for later comparison
      setOriginalImageUrl(newsItem.image_url || '');
      
      // Set file preview if there's an image
      if (newsItem.image_url) {
        setFilePreview(newsItem.image_url);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/hyperlocal/categories');
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to request location access
  const requestLocationAccess = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        if (error.code === 1) {
          errorMessage = "You denied the request for geolocation";
        } else if (error.code === 2) {
          errorMessage = "Location information is unavailable";
        } else if (error.code === 3) {
          errorMessage = "The request to get your location timed out";
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
        // Show location prompt if permission was denied
        if (error.code === 1) {
          setShowLocationPrompt(true);
        }
      },
      { enableHighAccuracy: true }
    );
  };

  // Function to calculate distance between two points in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle textarea auto-resize
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    
    // First update the state
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-resize logic
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageChanged(true);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const uploadImageToCPanel = async (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    try {
      setUploading(true);
      const response = await fetch('https://wowfy.in/testusr/upload.php', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data.filePath; // This should be the filename returned from PHP
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setFilePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImageChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError(null);
    
    // Validate that user has allowed location access
    if (!userLocation) {
      setError("Location permission is required to update news");
      setFormSubmitting(false);
      setShowLocationPrompt(true);
      return;
    }
    
    // Check if news location is within 10km of user's location
    if (formData.latitude && formData.longitude) {
      const newsLat = parseFloat(formData.latitude);
      const newsLng = parseFloat(formData.longitude);
      const userLat = userLocation.latitude;
      const userLng = userLocation.longitude;
      
      const distance = calculateDistance(userLat, userLng, newsLat, newsLng);
      
      if (distance > 10) {
        setError("News location must be within 10km of your current location");
        setFormSubmitting(false);
        return;
      }
    }
    
    try {
      let imageUrl = formData.image_url;

      // If it's a file upload, upload to cPanel first
      if (file) {
        const uploadedFileName = await uploadImageToCPanel(file);
        imageUrl = `https://wowfy.in/testusr/images/${uploadedFileName}`;
      }
         
      const dataToSubmit = {
        ...formData,
        image_url: imageUrl,
        latitude: formData.latitude ? parseFloat(formData.latitude) : userLocation.latitude,
        longitude: formData.longitude ? parseFloat(formData.longitude) : userLocation.longitude,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        original_image_url: imageChanged ? originalImageUrl : null, // Only send if image was changed
      };
      
      const res = await fetch(`/api/hyperlocal/${newsId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
          'User-Latitude': userLocation.latitude.toString(),
          'User-Longitude': userLocation.longitude.toString(),
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update news');
      }
      
      // Redirect to the news listing page on success
      router.push('/hyperlocal');
      
    } catch (err) {
      setError(err.message);
      setFormSubmitting(false);
    }
  };

  // Location permission popup
  const LocationPrompt = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">Location Permission Required</h3>
          <button 
            onClick={() => router.push('/hyperlocal')}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <MapPin className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-gray-700 mb-2">
            To edit hyperlocal news, we need your current location. You can only edit news within 10km of your location.
          </p>
          {locationError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
              {locationError}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={requestLocationAccess}
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
            onClick={() => router.push('/hyperlocal')}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Show loading state while fetching news details
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-red-800 animate-spin" />
          <p className="mt-4 text-lg text-gray-700">Loading news details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      {showLocationPrompt && <LocationPrompt />}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/hyperlocal" 
            className="flex items-center text-red-800 hover:text-red-700 transition mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to News List
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Edit Hyperlocal News</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter news title"
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="file-upload" className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg shadow-lg tracking-wide border border-dashed border-gray-400 cursor-pointer hover:bg-gray-50">
                    {filePreview ? (
                      <div className="relative w-full h-48">
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="h-full mx-auto object-contain"
                        />
                        {filePreview && (
                          <button 
                            type="button" 
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-red-800" />
                        <span className="mt-2 text-base">Select an image file</span>
                      </>
                    )}
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                  </p>
                )}
              </div>
              
              {/* Article Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleTextareaChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 min-h-[120px]"
                  placeholder="Enter the full article content here..."
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <MapPin className="h-4 w-4 inline text-red-800 ml-1" />
                </label>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-3">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> News location must be within 10km of your current location.
                    {userLocation && (
                      <span className="block mt-1">
                        Your current location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="latitude" className="block text-xs text-gray-500 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      placeholder="E.g., 28.6139"
                    />
                  </div>
                  <div>
                    <label htmlFor="longitude" className="block text-xs text-gray-500 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      placeholder="E.g., 77.2090"
                    />
                  </div>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delete After Hours */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delete After Hours <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="delete-24"
                      name="delete_after_hours"
                      type="radio"
                      value="24"
                      checked={formData.delete_after_hours === 24}
                      onChange={(e) => setFormData({...formData, delete_after_hours: parseInt(e.target.value)})}
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="delete-24" className="ml-2 block text-sm text-gray-700">
                      24 hours
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="delete-36"
                      name="delete_after_hours"
                      type="radio"
                      value="36"
                      checked={formData.delete_after_hours === 36}
                      onChange={(e) => setFormData({...formData, delete_after_hours: parseInt(e.target.value)})}
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="delete-36" className="ml-2 block text-sm text-gray-700">
                      36 hours
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="delete-48"
                      name="delete_after_hours"
                      type="radio"
                      value="48"
                      checked={formData.delete_after_hours === 48}
                      onChange={(e) => setFormData({...formData, delete_after_hours: parseInt(e.target.value)})}
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="delete-48" className="ml-2 block text-sm text-gray-700">
                      48 hours
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={formSubmitting || uploading || !userLocation}
                  className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {(formSubmitting || uploading) ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      {uploading ? 'Uploading...' : 'Updating...'}
                    </span>
                  ) : (
                    'Update News'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}