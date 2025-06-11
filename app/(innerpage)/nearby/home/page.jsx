'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, Plus, AlertCircle, MapPin, Users, X, Filter, Calendar, DollarSign, Phone, Heart } from 'lucide-react';
import useAuthRedirect from '../_component/useAuthRedirect';

export default function AdminContentPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [counts, setCounts] = useState({ total: 0, news: 0, classifieds: 0, obituaries: 0 });
  const router = useRouter();

  useAuthRedirect()

  useEffect(() => {
    fetchContent();
    // Check if user has seen the intro before
    const hasSeenIntro = typeof window !== 'undefined' ? localStorage.getItem('hasSeenCreatorIntro') : null;
    if (hasSeenIntro) {
      setShowIntroModal(false);
    }
  }, [activeFilter]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
      const res = await fetch(`/api/hyperlocal?type=${activeFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await res.json();
      setContent(data.content);
      setCounts(data.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIntroClose = () => {
    setShowIntroModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenCreatorIntro', 'true');
    }
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
      const res = await fetch(`/api/hyperlocal/${contentToDelete.id}?type=${contentToDelete.content_type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete content');
      }
      
      // Remove the deleted content from the state
      setContent(content.filter(item => item.id !== contentToDelete.id));
      setShowDeleteModal(false);
      setContentToDelete(null);
    } catch (err) {
      console.error('Error deleting content:', err);
      setError(err.message);
    }
  };

  const confirmDelete = (contentItem) => {
    setContentToDelete(contentItem);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const truncate = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  const getImageUrl = (imageUrl, contentType) => {
    if (!imageUrl) return '/placeholder-image.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Handle different image sources based on content type
    if (contentType === 'classifieds' && imageUrl.includes(',')) {
      // For classifieds with multiple images, take the first one
      const firstImage = imageUrl.split(',')[0].trim();
      return firstImage.startsWith('http') ? firstImage : `https://wowfy.in/testusr/images/${firstImage}`;
    }
    
    return `https://wowfy.in/testusr/images/${imageUrl}`;
  };

  const renderNewsCard = (item) => (
    <div key={`${item.content_type}-${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={getImageUrl(item.image_url, item.content_type)}
          alt={item.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          NEWS
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h2>
        <p className="text-gray-600 text-sm">
          {truncate(item.content, 120)}
        </p>
      </div>
      <div className="border-t border-gray-100 p-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => router.push(`/nearby/edit/${item.id}?type=news`)}
            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
            aria-label="Edit news"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => confirmDelete(item)}
            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
            aria-label="Delete news"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClassifiedCard = (item) => (
    <div key={`${item.content_type}-${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={getImageUrl(item.images, item.content_type)}
          alt={item.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {item.ad_type?.toUpperCase() || 'CLASSIFIED'}
        </div>
        {item.price && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
            <DollarSign size={12} className="mr-1" />
            {item.price}
          </div>
        )}
      </div>
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h2>
        <p className="text-gray-600 text-sm mb-2">
          {truncate(item.description, 100)}
        </p>
        {item.type && (
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-2">
            {item.type}
          </span>
        )}
        {item.contact_info && (
          <div className="flex items-center text-gray-500 text-xs">
            <Phone size={12} className="mr-1" />
            <span>{truncate(item.contact_info, 30)}</span>
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 p-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => router.push(`/nearby/edit/${item.id}?type=classified`)}
            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
            aria-label="Edit classified"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => confirmDelete(item)}
            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
            aria-label="Delete classified"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderObituaryCard = (item) => (
    <div key={`${item.content_type}-${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border-l-4 border-purple-500">
      <div className="relative h-48 w-full">
        <img
          src={getImageUrl(item.image_url, item.content_type)}
          alt={item.person_name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
          <Heart size={12} className="mr-1" />
          OBITUARY
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.person_name}</h2>
        <div className="space-y-1 text-sm text-gray-600">
          {item.age && (
            <p>Age: {item.age} years</p>
          )}
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span>Passed away: {formatDate(item.date_of_death)}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Posted: {formatDate(item.created_at)}</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => router.push(`/nearby/edit/${item.id}?type=obituary`)}
            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
            aria-label="Edit obituary"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => confirmDelete(item)}
            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
            aria-label="Delete obituary"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderCard = (item) => {
    switch (item.content_type) {
      case 'news':
        return renderNewsCard(item);
      case 'classifieds':
        return renderClassifiedCard(item);
      case 'obituaries':
        return renderObituaryCard(item);
      default:
        return renderNewsCard(item);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-red-800">
            <div className="w-4 h-4 border-2 border-red-800 border-t-transparent rounded-full animate-spin"></div>
            <p>Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-red-800">
          <p className="flex items-center"><AlertCircle className="mr-2" /> Error: {error}</p>
          <button 
            onClick={fetchContent}
            className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
            Content Management
          </h1>
          <a 
            href="/nearby/create" 
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition"
          >
            <Plus className="mr-2 h-5 w-5" /> Create Content
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="text-gray-600" size={20} />
            <span className="text-gray-700 font-medium">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: counts.total },
              { key: 'news', label: 'News', count: counts.news },
              { key: 'classifieds', label: 'Classifieds', count: counts.classifieds },
              { key: 'obituaries', label: 'Obituaries', count: counts.obituaries }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-red-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {content.length === 0 ? (
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">
              No {activeFilter === 'all' ? 'content' : activeFilter} found.
            </p>
            <a 
              href="/nearby/create" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition"
            >
              <Plus className="mr-2 h-5 w-5" /> Add {activeFilter === 'all' ? 'Content' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map(renderCard)}
          </div>
        )}
      </div>

      {/* Introduction Modal */}
      {showIntroModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-800 to-red-700 p-6 rounded-t-2xl relative">
              <button 
                onClick={handleIntroClose}
                className="absolute top-4 right-4 text-white hover:text-red-200 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Creator Hub!</h2>
                <p className="text-red-100">Share local content with your community</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* About Local Content */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <MapPin className="text-red-800 mr-3" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Discover Local Content</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Share news, classifieds, and obituaries within a 10km radius of your location. 
                  All content appears as interactive markers on a map, helping you stay connected 
                  with what&apos;s happening in your immediate community.
                </p>
              </div>

              {/* Content Types */}
              <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-800">
                <div className="flex items-center mb-3">
                  <Plus className="text-red-800 mr-3" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Content Types</h3>
                </div>
                
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-800 mb-1">News</div>
                      <div className="text-gray-600">Share local news and events</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-800 mb-1">Classifieds</div>
                      <div className="text-gray-600">Buy, sell, or rent items</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="font-semibold text-purple-800 mb-1">Obituaries</div>
                      <div className="text-gray-600">Honor community members</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center pt-4">
                <button 
                  onClick={handleIntroClose}
                  className="bg-red-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Creating Content
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  You can always view this information again from the help section
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{contentToDelete?.title || contentToDelete?.person_name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}