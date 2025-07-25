// app/debates/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Eye,
  Sparkles,
  TrendingUp,
  Clock,
  Loader2,
  CheckCircle,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const DebatesPage = () => {
  const router = useRouter();
  const [newsGroups, setNewsGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 12,
    has_next: false,
    has_prev: false,
  });

  useEffect(() => {
    fetchNewsGroups(1);
  }, []);

  const fetchNewsGroups = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/debates?page=${page}&limit=12`);
      const data = await response.json();

      if (data.success) {
        setNewsGroups(data.data);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load news groups');
      }
    } catch (error) {
      console.error('Error fetching news groups:', error);
      toast.error('Failed to load news groups');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchNewsGroups(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && newsGroups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-spin text-red-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">Loading news groups...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 pb-16">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full mb-4 sm:mb-5 md:mb-6"
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </motion.div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 px-2">
              Select News Group
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-red-100 mb-6 sm:mb-7 md:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-4 leading-relaxed">
              Choose a news topic to start your AI debate experience
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 text-red-100 px-4"
            >
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{pagination.total_count} News Groups</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>AI Debate Ready</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* News Groups Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
            >
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg animate-pulse"
                >
                  <div className="w-full h-40 sm:h-44 md:h-48 bg-gray-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                    <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-12 sm:w-14 md:w-16"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
            >
              {newsGroups.map((group, index) => (
                <motion.div
                  key={group.group_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/debates/${group.group_id}`)}
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden flex-shrink-0">
                      <motion.img
                        src={group.sample_news.image_url ? `https://wowfy.in/testusr/images/${group.sample_news.image_url}` : '/placeholder-news.jpg'}
                        alt={group.sample_news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 flex gap-1 sm:gap-2">
                        {group.has_debate && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                          >
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">Has Debate</span>
                            <span className="sm:hidden">Debate</span>
                          </motion.span>
                        )}
                        {group.show_on_top && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                          >
                            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">Trending</span>
                          </motion.span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4">
                        <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">{formatDate(group.sample_news.show_date)}</span>
                          <span className="sm:hidden">{new Date(group.sample_news.show_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg mb-2 sm:mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight flex-shrink-0">
                        {group.sample_news.title}
                      </h3>
                      
                      {group.sample_news.summary && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed flex-1">
                          {group.sample_news.summary}
                        </p>
                      )}

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                          {group.total_news_count && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span className="hidden sm:inline">{group.total_news_count} viewpoint{group.total_news_count !== 1 ? 's' : ''}</span>
                              <span className="sm:hidden">{group.total_news_count}</span>
                            </span>
                          )}
                          <span className="hidden sm:inline">{formatDate(group.sample_news.show_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && newsGroups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16 px-4"
          >
            <MessageCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No news groups available</h3>
            <p className="text-sm sm:text-base text-gray-600">Check back later for new topics!</p>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-10 md:mt-12 px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={!pagination.has_prev}
              className="p-2 sm:p-2.5 md:p-3 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </motion.button>

            {/* Mobile pagination - show only current and adjacent pages */}
            <div className="flex sm:hidden">
              {pagination.current_page > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  className="px-3 py-2 rounded-lg font-medium transition-all bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 text-sm"
                >
                  {pagination.current_page - 1}
                </motion.button>
              )}
              
              <motion.button
                className="px-3 py-2 rounded-lg font-medium transition-all bg-red-600 text-white shadow-lg text-sm mx-1"
              >
                {pagination.current_page}
              </motion.button>

              {pagination.current_page < pagination.total_pages && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  className="px-3 py-2 rounded-lg font-medium transition-all bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 text-sm"
                >
                  {pagination.current_page + 1}
                </motion.button>
              )}
            </div>

            {/* Desktop pagination - show all pages */}
            <div className="hidden sm:flex">
              {[...Array(pagination.total_pages)].map((_, index) => {
                const page = index + 1;
                const isActive = page === pagination.current_page;
                
                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base touch-manipulation ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={!pagination.has_next}
              className="p-2 sm:p-2.5 md:p-3 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DebatesPage;