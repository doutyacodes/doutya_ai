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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading news groups...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 pb-16">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6"
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Select News Group
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Choose a news topic to start your AI debate experience
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 text-red-100"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>{pagination.total_count} News Groups</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>AI Debate Ready</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* News Groups Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {newsGroups.map((group, index) => (
                <motion.div
                  key={group.group_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/debates/${group.group_id}`)}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={group.sample_news.image_url ? `https://wowfy.in/testusr/images/${group.sample_news.image_url}` : '/placeholder-news.jpg'}
                        alt={group.sample_news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {group.has_debate && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Has Debate
                          </motion.span>
                        )}
                        {group.show_on_top && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                          >
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </motion.span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(group.sample_news.show_date)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                        {group.sample_news.title}
                      </h3>
                      
                      {group.sample_news.summary && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {group.sample_news.summary}
                        </p>
                      )}

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {group.total_news_count && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {group.total_news_count} viewpoint{group.total_news_count !== 1 ? 's' : ''}
                            </span>
                          )}
                          <span>{formatDate(group.sample_news.show_date)}</span>
                        </div>

                        {/* {group.sample_news.viewpoint && (
                          <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            {group.sample_news.viewpoint}
                          </span>
                        )} */}
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
            className="text-center py-16"
          >
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No news groups available</h3>
            <p className="text-gray-600">Check back later for new topics!</p>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={!pagination.has_prev}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>

            {[...Array(pagination.total_pages)].map((_, index) => {
              const page = index + 1;
              const isActive = page === pagination.current_page;
              
              return (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700'
                  }`}
                >
                  {page}
                </motion.button>
              );
            })}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={!pagination.has_next}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default DebatesPage;