"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Trash2, Calendar, Eye, Search, X, FileText } from 'lucide-react';
import NotesModal from '../_components/NotesModal';
import { motion } from 'framer-motion';
import { GrFormView } from 'react-icons/gr';
import { FaStar } from 'react-icons/fa';

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
  const [notesModal, setNotesModal] = useState({ isOpen: false, savedItem: null });
  const [currentPerspectives, setCurrentPerspectives] = useState({});
  const [isPaused, setIsPaused] = useState({});

    // Viewpoint colors
  const viewpointColors = {
    0: { bg: "bg-[#1E90FF]", text: "text-[#1E90FF]" }, // Dodger Blue
    1: { bg: "bg-[#00bf62]", text: "text-[#00bf62]" }, // green
    2: { bg: "bg-[#6A5ACD]", text: "text-[#6A5ACD]" }, // Slate Blue
    3: { bg: "bg-[#20B2AA]", text: "text-[#20B2AA]" }, // Light Sea Green
    4: { bg: "bg-[#DAA520]", text: "text-[#DAA520]" }, // Goldenrod
    5: { bg: "bg-[#00CED1]", text: "text-[#00CED1]" }, // Dark Turquoise
  };

  // Get color variants for viewpoint based on index
  const getViewpointColor = (index, type = 'bg') => {
    const colorSet = viewpointColors[index % Object.keys(viewpointColors).length];
    return type === 'bg' ? colorSet.bg : colorSet.text;
  };

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

  // Initialize current perspectives when savedNews changes
  useEffect(() => {
    const initialPerspectives = {};
    const initialPaused = {};
    savedNews.forEach(savedItem => {
      if (savedItem.allPerspectives && savedItem.allPerspectives.length > 0) {
        const currentIndex = savedItem.allPerspectives.findIndex(
          perspective => perspective.id === savedItem.news.id
        );
        initialPerspectives[savedItem.id] = currentIndex >= 0 ? currentIndex : 0;
        initialPaused[savedItem.id] = false;
      }
    });
    setCurrentPerspectives(initialPerspectives);
    setIsPaused(initialPaused);
  }, [savedNews]);

  // Auto-rotate perspectives
  useEffect(() => {
    const intervals = {};
    
    savedNews.forEach(savedItem => {
      if (savedItem.allPerspectives && savedItem.allPerspectives.length > 1 && !isPaused[savedItem.id]) {
        intervals[savedItem.id] = setInterval(() => {
          setCurrentPerspectives(prev => ({
            ...prev,
            [savedItem.id]: (prev[savedItem.id] + 1) % savedItem.allPerspectives.length
          }));
        }, 3000); // Change every 3 seconds
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [savedNews, isPaused]);

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

  const handleUpdateNote = (savedItemId, newNote) => {
    setSavedNews(prev => prev.map(item => 
      item.id === savedItemId 
        ? { ...item, note: newNote }
        : item
    ));
    setFilteredNews(prev => prev.map(item => 
      item.id === savedItemId 
        ? { ...item, note: newNote }
        : item
    ));
  };

  // Handle perspective change
  const handlePerspectiveChange = (savedItemId, perspectiveIndex) => {
    setCurrentPerspectives(prev => ({
      ...prev,
      [savedItemId]: perspectiveIndex
    }));
  };

      // Handle dot click for perspective change
    const handleDotClick = (savedItemId, perspectiveIndex) => {
      setCurrentPerspectives(prev => ({
        ...prev,
        [savedItemId]: perspectiveIndex
      }));
    };

    // Handle pause/resume
    const handleMouseEnter = (savedItemId) => {
      setIsPaused(prev => ({ ...prev, [savedItemId]: true }));
    };

    const handleMouseLeave = (savedItemId) => {
      setIsPaused(prev => ({ ...prev, [savedItemId]: false }));
    };

    // Get current perspective for a saved item
    const getCurrentPerspective = (savedItem) => {
      const currentIndex = currentPerspectives[savedItem.id] || 0;
      return savedItem.allPerspectives?.[currentIndex] || savedItem.news;
    };

    // Get current perspective index
    const getCurrentPerspectiveIndex = (savedItem) => {
      return currentPerspectives[savedItem.id] || 0;
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
              {/* The article will still be available in the main news feed. */}
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

      {/* Notes Modal */}
      <NotesModal
        isOpen={notesModal.isOpen}
        onClose={() => setNotesModal({ isOpen: false, savedItem: null })}
        savedItem={notesModal.savedItem}
        onUpdateNote={handleUpdateNote}
      />

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
                className="bg-[#f5f5f5] shadow-md cursor-pointer overflow-hidden rounded-lg hover:shadow-lg transition-shadow flex flex-col p-1"
                onMouseEnter={() => handleMouseEnter(savedItem.id)}
                onMouseLeave={() => handleMouseLeave(savedItem.id)}
                onTouchStart={() => handleMouseEnter(savedItem.id)}
                onTouchEnd={() => handleMouseLeave(savedItem.id)}
              >
                {/* Perspectives Header */}
                {savedItem.allPerspectives && savedItem.allPerspectives.length > 1 && (
                  <p className="text-[10px] md:text-xs text-black text-nowrap font-medium bg-opacity-80 py-2 rounded-md">
                    <span className="flex gap-[3px] items-center overflow-x-auto w-full">
                      <span className="font-bold">Perspectives of</span>:{" "}
                      {savedItem.allPerspectives.map(p => p.viewpoint).join(', ')}
                    </span>
                  </p>
                )}

                {/* Image/Video Section */}
                <div className="relative w-full h-48">
                  {(() => {
                    const currentPerspective = getCurrentPerspective(savedItem);
                    const currentIndex = getCurrentPerspectiveIndex(savedItem);
                    
                    return currentPerspective.media_type === 'video' ? (
                      <video 
                        src={`https://wowfy.in/testusr/images/${currentPerspective.image_url}`}
                        poster={`https://wowfy.in/testusr/images/${currentPerspective.image_url.replace('.mp4', '.jpg')}`}
                        className="w-full h-full object-cover max-md:rounded-md cursor-pointer"
                        controls
                        controlsList="nodownload noplaybackrate nofullscreen"
                        disablePictureInPicture
                        autoPlay
                        muted
                        loop
                        onClick={() => handleNewsClick(currentPerspective.id)}
                      >           
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={`https://wowfy.in/testusr/images/${currentPerspective.image_url}`}
                        alt={currentPerspective.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover max-md:rounded-md cursor-pointer"
                        onClick={() => handleNewsClick(currentPerspective.id)}
                      />
                    );
                  })()}
                  
                  {/* Viewpoint label above image */}
                  <span className={cn(
                    "absolute top-2 left-2 text-white text-xs flex items-center font-medium px-2 py-1 rounded-md",
                    getViewpointColor(getCurrentPerspectiveIndex(savedItem), 'bg') + " bg-opacity-90"
                  )}>
                    <GrFormView size={18} />
                    {getCurrentPerspective(savedItem).viewpoint} Perspective
                  </span>

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
                <div className="flex flex-col flex-grow p-2">
                  {/* Title with animation */}
                  <motion.div
                    key={`${savedItem.id}-${getCurrentPerspectiveIndex(savedItem)}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className="scrollable-container"
                  >
                    <span className={cn(
                      "text-xs flex items-center font-semibold mb-1",
                      getViewpointColor(getCurrentPerspectiveIndex(savedItem), 'text')
                    )}>
                      <GrFormView size={18} className={getViewpointColor(getCurrentPerspectiveIndex(savedItem), 'text')} />
                      {getCurrentPerspective(savedItem).viewpoint} Perspective
                    </span>
                    
                    <h3
                      onClick={() => handleNewsClick(getCurrentPerspective(savedItem).id)}
                      className="text-lg font-medium text-gray-800 mb-2 cursor-pointer line-clamp-3 hover:text-red-800 transition-colors"
                    >
                      {getCurrentPerspective(savedItem).title}
                    </h3>
                  </motion.div>

                  {/* Dots Navigation - Only show if there are multiple perspectives */}
                  {savedItem.allPerspectives && savedItem.allPerspectives.length > 1 && (
                    <div className="flex justify-center my-2 space-x-2">
                      {savedItem.allPerspectives.map((_, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-2 h-2 rounded-full transition",
                            getCurrentPerspectiveIndex(savedItem) === index
                              ? "bg-red-800"
                              : "bg-gray-400 hover:bg-gray-600"
                          )}
                          onClick={() => handleDotClick(savedItem.id, index)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Summary */}
                  {getCurrentPerspective(savedItem).summary && (
                    <p 
                      className="text-gray-600 text-sm mb-3 line-clamp-3 cursor-pointer"
                      onClick={() => handleNewsClick(getCurrentPerspective(savedItem).id)}
                    >
                      {getCurrentPerspective(savedItem).summary}
                    </p>
                  )}
                  
                  {/* Date information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Saved {formatDate(savedItem.saved_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(getCurrentPerspective(savedItem).show_date)}</span>
                    </div>
                  </div>

                  {/* Notes section */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotesModal({ isOpen: true, savedItem: savedItem });
                      }}
                      className="flex items-center gap-2 text-sm text-red-700 hover:text-red-800 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{savedItem.note ? 'View/Edit Notes' : 'Add Notes'}</span>
                      {savedItem.note && (
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      )}
                    </button>
                  </div>
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