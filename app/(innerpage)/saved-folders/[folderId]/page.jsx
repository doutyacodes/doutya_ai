"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Trash2, Calendar, Eye, Search, X } from 'lucide-react';

const SavedFolderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const folderId = params.folderId;
  const [folder, setFolder] = useState(null);
  const [savedNews, setSavedNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // Utility function for class names
  const cn = (...classes) => classes.filter(Boolean).join(' ');

  // Fetch folder details and saved news
  const fetchFolderData = async () => {
    if (!folderId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/user/folders/${folderId}/news`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setFolder(data.folder);
        setSavedNews(data.savedNews);
        setFilteredNews(data.savedNews);
      } else if (response.status === 404) {
        setError('Folder not found');
      } else {
        setError(data.message || 'Failed to fetch folder data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFolderData();
  }, [folderId]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = savedNews.filter(item =>
        item.news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.news.summary && item.news.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(savedNews);
    }
  }, [searchQuery, savedNews]);

  // Handle remove news from folder
  const handleRemoveNews = async (savedNewsId) => {
    try {
      setRemovingId(savedNewsId);
      const response = await fetch(`/api/user/folders/${folderId}/news/${savedNewsId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSavedNews(prev => prev.filter(item => item.id !== savedNewsId));
        setRemoveConfirm(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to remove news from folder');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setRemovingId(null);
    }
  };

  // Handle news card click
  const handleNewsClick = (newsId) => {
    router.push(`/news/${newsId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 text-lg">{error}</p>
            <button
              onClick={() => router.push('/saved-folders')}
              className="mt-4 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900"
            >
              Back to Folders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/saved-folders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Folders
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{folder?.name}</h1>
              <p className="text-gray-600 mt-1">
                {savedNews.length} saved article{savedNews.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Remove Article</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove &ldquo;{removeConfirm.news.title}&ldquo; from this folder? 
              The article will still be available in the main news feed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRemoveConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={removingId === removeConfirm.id}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveNews(removeConfirm.id)}
                disabled={removingId === removeConfirm.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {removingId === removeConfirm.id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No articles found' : 'No saved articles'}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start saving articles to this folder to see them here'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((savedItem) => (
              <div
                key={savedItem.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Image/Video Section */}
                <div className="relative aspect-video overflow-hidden">
                  {savedItem.news.media_type === 'video' ? (
                    <video 
                      src={`https://wowfy.in/testusr/images/${savedItem.news.image_url}`}
                      poster={`https://wowfy.in/testusr/images/${savedItem.news.image_url.replace('.mp4', '.jpg')}`}
                      className={cn("w-full h-full object-cover cursor-pointer")}
                      controls
                      controlsList="nodownload noplaybackrate nofullscreen"
                      disablePictureInPicture
                      autoPlay
                      muted
                      loop
                      onClick={() => handleNewsClick(savedItem.news.id)}
                    >           
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={`https://wowfy.in/testusr/images/${savedItem.news.image_url}`}
                      alt={savedItem.news.title}
                      width={400}
                      height={300}
                      className={cn("w-full h-full object-cover cursor-pointer")}
                      onClick={() => handleNewsClick(savedItem.news.id)}
                    />
                  )}
                  
                  {/* Remove Button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRemoveConfirm(savedItem);
                      }}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
                      title="Remove from folder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-red-800 transition-colors"
                    onClick={() => handleNewsClick(savedItem.news.id)}
                  >
                    {savedItem.news.title}
                  </h3>
                  
                  {savedItem.news.summary && (
                    <p 
                      className="text-gray-600 text-sm mb-3 line-clamp-3 cursor-pointer"
                      onClick={() => handleNewsClick(savedItem.news.id)}
                    >
                      {savedItem.news.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Saved {formatDate(savedItem.saved_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(savedItem.news.show_date)}</span>
                    </div>
                  </div>
                  
                  {savedItem.news.viewpoint && (
                    <div className="mt-2">
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {savedItem.news.viewpoint}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFolderDetailsPage;