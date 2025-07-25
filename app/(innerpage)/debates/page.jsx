// app/debates/page.jsx - Fixed with red/white theme and removed blocking overlay
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
  Users,
  Search,
  Filter,
  Award,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

const DebatesPage = () => {
  const router = useRouter();
  const [newsGroups, setNewsGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredNewsGroups = newsGroups.filter(group =>
    group.sample_news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.sample_news.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && newsGroups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-3xl shadow-2xl p-12 border border-gray-100"
        >
          <Loader2 className="w-16 h-16 animate-spin text-red-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Debates</h3>
          <p className="text-gray-600 text-lg">Preparing your AI-powered debate experience...</p>
          <div className="flex items-center justify-center gap-6 mt-6 text-gray-500">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">AI Debates</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span className="text-sm">Multiple Choice</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">AI vs AI</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 pb-20">
      {/* Modern Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-red-900 to-red-800"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
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
              className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20"
            >
              <MessageCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300">Debates</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-red-100 mb-8 leading-relaxed max-w-4xl mx-auto">
              Engage with cutting-edge AI in structured debates, explore multiple perspectives, and sharpen your critical thinking skills
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 text-red-100 mb-12"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                <TrendingUp className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold text-2xl">{pagination.total_count}</div>
                  <div className="text-sm opacity-80">Active Topics</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                <Brain className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold text-2xl">3</div>
                  <div className="text-sm opacity-80">Debate Styles</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                <Award className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold text-2xl">AI</div>
                  <div className="text-sm opacity-80">Powered</div>
                </div>
              </div>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <MessageCircle className="w-8 h-8 text-red-300 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Live AI Debates</h3>
                <p className="text-red-200 text-sm">Real-time structured debates with intelligent AI opponents</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <Target className="w-8 h-8 text-green-300 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Multiple Choice Response</h3>
                <p className="text-red-200 text-sm">Navigate decision trees to explore different perspectives</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <Users className="w-8 h-8 text-purple-300 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">AI vs AI Matches</h3>
                <p className="text-red-200 text-sm">Watch expert-level AI debates on current topics</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search debate topics, news, or viewpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-gray-50 text-gray-900"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors text-gray-700 font-medium">
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
                  {filteredNewsGroups.length} results
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* News Groups Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-lg animate-pulse overflow-hidden"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredNewsGroups.map((group, index) => (
                <motion.div
                  key={group.group_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/debates/${group.group_id}`)}
                >
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 h-full flex flex-col relative">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={group.sample_news.image_url ? `https://wowfy.in/testusr/images/${group.sample_news.image_url}` : '/placeholder-news.jpg'}
                        alt={group.sample_news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {group.has_debate && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Debate Ready</span>
                          </motion.span>
                        )}
                        {group.show_on_top && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                          >
                            <TrendingUp className="w-3 h-3" />
                            <span>Trending</span>
                          </motion.span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(group.sample_news.show_date)}</span>
                        </span>
                      </div>

                      {/* Quick Action Button */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <div className="bg-white/90 backdrop-blur-sm text-red-600 p-2 rounded-full shadow-lg">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight flex-shrink-0">
                        {group.sample_news.title}
                      </h3>
                      
                      {group.sample_news.summary && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                          {group.sample_news.summary}
                        </p>
                      )}

                      {/* Bottom Info */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {group.total_news_count && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{group.total_news_count} views</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            <span>3 styles</span>
                          </span>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <span className="text-sm font-semibold">Debate</span>
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Simple Info Badge - Non-blocking */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        3 Styles Available
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredNewsGroups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No debates found</h3>
              <p className="text-gray-600 text-lg mb-8">
                {searchTerm 
                  ? `No debates match "${searchTerm}". Try a different search term.`
                  : "Check back later for new debate topics!"
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Enhanced Pagination */}
        {pagination.total_pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between">
                <div className="hidden md:block text-gray-600">
                  Showing page {pagination.current_page} of {pagination.total_pages} 
                  <span className="text-gray-400 ml-2">({pagination.total_count} total results)</span>
                </div>
                
                <div className="flex items-center gap-2 mx-auto md:mx-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.has_prev}
                    className="p-3 rounded-2xl bg-gray-100 border border-gray-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>

                  {/* Mobile pagination */}
                  <div className="flex md:hidden items-center gap-1">
                    {pagination.current_page > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        className="px-4 py-2 rounded-xl font-medium transition-all bg-gray-100 border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700"
                      >
                        {pagination.current_page - 1}
                      </motion.button>
                    )}
                    
                    <button className="px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
                      {pagination.current_page}
                    </button>

                    {pagination.current_page < pagination.total_pages && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        className="px-4 py-2 rounded-xl font-medium transition-all bg-gray-100 border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700"
                      >
                        {pagination.current_page + 1}
                      </motion.button>
                    )}
                  </div>

                  {/* Desktop pagination */}
                  <div className="hidden md:flex items-center gap-1">
                    {[...Array(pagination.total_pages)].map((_, index) => {
                      const page = index + 1;
                      const isActive = page === pagination.current_page;
                      
                      return (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                              : 'bg-gray-100 border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700'
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
                    className="p-3 rounded-2xl bg-gray-100 border border-gray-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DebatesPage;