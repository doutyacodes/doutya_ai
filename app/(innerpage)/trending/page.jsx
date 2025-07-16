"use client"

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Eye, Calendar, Users, Bookmark, ChevronDown, Filter, Star } from 'lucide-react';
import SaveNewsModal from '@/app/_components/SaveNewsModal';
import { motion } from 'framer-motion';
import { GrFormView } from 'react-icons/gr';

const TrendingPage = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [examType, setExamType] = useState('');
  const [sortBy, setSortBy] = useState('most_saved');
  const [timeFilter, setTimeFilter] = useState('today');
  const [showSaveNewsModal, setShowSaveNewsModal] = useState(false);
  const [currentIndices, setCurrentIndices] = useState({});
  const [isPausedStates, setIsPausedStates] = useState({});

  const getViewpointColor = (index, type) => {
    const colors = {
      0: { bg: 'bg-red-600', text: 'text-red-600' },
      1: { bg: 'bg-blue-600', text: 'text-blue-600' },
      2: { bg: 'bg-green-600', text: 'text-green-600' },
      3: { bg: 'bg-purple-600', text: 'text-purple-600' },
      4: { bg: 'bg-orange-600', text: 'text-orange-600' },
    };
    return colors[index % 5]?.[type] || colors[0][type];
  };

  const filteredNews = trendingNews.filter(item =>
    item.news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.news.summary && item.news.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDotClick = (newsId, index) => {
    setCurrentIndices(prev => ({
      ...prev,
      [newsId]: index
    }));
  };

  const setIsPaused = (newsId, paused) => {
    setIsPausedStates(prev => ({
      ...prev,
      [newsId]: paused
    }));
  };

  useEffect(() => {
    fetchTrendingNews();
  }, [sortBy, timeFilter]);

  useEffect(() => {
  const intervals = {};
  
  filteredNews.forEach(item => {
    if (item.all_perspectives && item.all_perspectives.length > 1) {
      const newsId = item.news.id;
      const isPaused = isPausedStates[newsId];
      
      if (!isPaused) {
        intervals[newsId] = setInterval(() => {
          setCurrentIndices(prev => {
            const currentIndex = prev[newsId] || 0;
            const nextIndex = (currentIndex + 1) % item.all_perspectives.length;
            return {
              ...prev,
              [newsId]: nextIndex
            };
          });
        }, 3000);
      }
    }
  });

  return () => {
    Object.values(intervals).forEach(interval => clearInterval(interval));
  };
}, [filteredNews, isPausedStates]);

  const fetchTrendingNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sort: sortBy,
        time_filter: timeFilter,
      });
      
      const response = await fetch(`/api/trending?${params}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setTrendingNews(data.trending_news || []);
        setExamType(data.exam_type || '');
      } else {
        console.error('Error fetching trending news:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsClick = (newsId) => {
    // Navigate to news detail page
    window.location.href = `/news/${newsId}`;
  };

  const handleSaveNews = () => {
      setShowSaveNewsModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            {/* Title and Exam Type */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-red-800" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Trending News Articles</h1>
                  <p className="text-sm text-gray-600">
                    Most saved articles by {examType} aspirants
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Top 100 Articles</span>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col justify-end sm:flex-row gap-4">
              {/* Search */}
              {/* <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search trending articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div> */}

              {/* Filters */}
              <div className="flex gap-2">
                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="most_saved">Most Saved</option>
                    <option value="recent_trend">Recent Trend</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Time Filter */}
                <div className="relative">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="all_time">All Time</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No trending articles found' : 'No trending articles yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Start saving articles to see trending content here'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => {
              const allPerspectives = item.all_perspectives || [item.news];
              const currentIndex = currentIndices[item.news.id] || 0;
              const currentNews = allPerspectives[currentIndex];
              
              return (
                <React.Fragment key={item.news.id}>
                  <div
                    key={item.news.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                    onClick={() => handleNewsClick(currentNews.id)}
                    onMouseEnter={() => setIsPaused(item.news.id, true)}
                    onMouseLeave={() => setIsPaused(item.news.id, false)}
                    onTouchStart={() => setIsPaused(item.news.id, true)}
                    onTouchEnd={() => setIsPaused(item.news.id, false)}
                  >
                    {/* Trending Rank Badge */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-red-800 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          #{index + 1}
                        </div>
                      </div>

                      {/* Save Count Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Bookmark className="w-3 h-3" />
                          {item.save_count}
                        </div>
                      </div>

                      {/* Media Section */}
                      <div className="aspect-video overflow-hidden">
                        {currentNews.media_type === 'video' ? (
                          <video 
                            src={`https://wowfy.in/testusr/images/${currentNews.image_url}`}
                            poster={`https://wowfy.in/testusr/images/${currentNews.image_url.replace('.mp4', '.jpg')}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            muted
                            loop
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => e.target.pause()}
                          >           
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={`https://wowfy.in/testusr/images/${currentNews.image_url}`}
                            alt={currentNews.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        )}
                      </div>

                      {/* Viewpoint label on image */}
                      <span className={`absolute top-16 left-3 text-white text-xs flex items-center font-medium px-2 py-1 rounded-md ${getViewpointColor(currentIndex, 'bg')} bg-opacity-90 z-10`}>
                        <GrFormView size={16} />
                        {currentNews.viewpoint} Perspective
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      {/* Perspective indicator */}
                      <motion.div
                        key={`${item.news.id}-${currentIndex}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ 
                          duration: 0.3,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                      >
                        <span className={`text-xs flex items-center font-semibold mb-2 ${getViewpointColor(currentIndex, 'text')}`}>
                          <GrFormView size={16} className={getViewpointColor(currentIndex, 'text')} />
                          {currentNews.viewpoint} Perspective
                        </span>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-800 transition-colors">
                          {currentNews.title}
                        </h3>
                      </motion.div>

                      {/* Perspective dots (only show if multiple perspectives) */}
                      {allPerspectives.length > 1 && (
                        <div className="flex justify-center my-2 space-x-2">
                          {allPerspectives.map((_, perspectiveIndex) => (
                            <button
                              key={perspectiveIndex}
                              className={`w-2 h-2 rounded-full transition ${
                                currentIndex === perspectiveIndex
                                  ? "bg-red-800"
                                  : "bg-gray-400 hover:bg-gray-600"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDotClick(item.news.id, perspectiveIndex);
                              }}
                            />
                          ))}
                        </div>
                      )}
                      
                      {currentNews.summary && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {currentNews.summary}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(currentNews.show_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{item.save_count} saves</span>
                          </div>
                          {/* Save News Icon */}
                          <div 
                            className="text-gray-500 cursor-pointer hover:text-yellow-500 transition-colors p-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSaveNews();
                            }}
                          >
                            <Star
                              size={14}
                              className="hover:fill-yellow-500"
                              title="Save News"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {currentNews.viewpoint && item.recent_saves > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {allPerspectives.length} perspectives
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            +{item.recent_saves} this week
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save News Modal */}
                  <SaveNewsModal
                    isOpen={showSaveNewsModal}
                    onClose={() => setShowSaveNewsModal(false)}
                    newsId={currentNews.id}
                    newsTitle={currentNews.title}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length === 100 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Showing top 100 trending articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;