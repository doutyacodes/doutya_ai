// app/debates/[groupId]/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  MessageCircle, 
  ArrowLeft,
  Calendar,
  Eye,
  Sparkles,
  Clock,
  Loader2,
  CheckCircle,
  Users,
  Brain,
  HelpCircle,
  Play,
  Crown,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

const NewsGroupDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId;
  
  const [newsGroup, setNewsGroup] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [debateTypes, setDebateTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPlan, setUserPlan] = useState(null);

  useEffect(() => {
    if (groupId) {
      fetchNewsGroupDetails();
    }
  }, [groupId]);

  const fetchNewsGroupDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(`/api/debates/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewsGroup(data.data.newsGroup);
        setNewsArticles(data.data.newsArticles);
        setDebateTypes(data.data.availableDebateTypes);
        setUserPlan(data.data.userPlan);
      } else {
        setError(data.error || 'News group not found');
      }
    } catch (err) {
      console.error('Error fetching news group details:', err);
      setError('Failed to load news group details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDebateTypeIcon = (type) => {
    switch (type) {
      case 'user_vs_ai':
        return MessageCircle;
      case 'ai_vs_ai':
        return Users;
      case 'mcq':
        return HelpCircle;
      default:
        return Brain;
    }
  };

  const getDebateTypeColor = (type) => {
    switch (type) {
      case 'user_vs_ai':
        return 'purple';
      case 'ai_vs_ai':
        return 'blue';
      case 'mcq':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getDebateTypeDescription = (type) => {
    switch (type) {
      case 'user_vs_ai':
        return 'Engage in a structured debate with AI taking an opposing view';
      case 'ai_vs_ai':
        return 'Watch two AIs debate each other on the topic';
      case 'mcq':
        return 'Navigate through an interactive debate decision tree';
      default:
        return 'Interactive debate experience';
    }
  };

  const handleStartDebate = (debateType) => {
    if (userPlan !== 'elite') {
      toast.error('AI Debate feature is only available for Elite members');
      return;
    }

    // Navigate to chat page with debate type
    router.push(`/debates/${groupId}/chat?type=${debateType}`);
  };

  const handleViewNews = (newsId) => {
    router.push(`/news/${newsId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading news group...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.push('/debates')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Debates
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 pb-16">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={() => router.push('/debates')}
              className="flex items-center gap-2 text-white hover:text-red-200 transition-colors mb-6"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Debates</span>
            </motion.button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                News Group Debates
              </h1>
              <p className="text-lg md:text-xl text-red-100 mb-6 max-w-3xl mx-auto">
                Explore different perspectives and engage in AI-powered debates
              </p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 text-red-100"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{newsArticles.length} Articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span>{debateTypes.length} Debate Types</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Debate Types Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Debate Experience</h2>
            <p className="text-gray-600 text-lg">Select how you&apos;d like to engage with AI</p>
            {userPlan !== 'elite' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm">
                <Crown className="w-4 h-4" />
                Upgrade to Elite for AI Debate access
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {debateTypes.map((type, index) => {
              const Icon = getDebateTypeIcon(type.id);
              const color = getDebateTypeColor(type.id);
              const isAvailable = userPlan === 'elite' && type.available;
              
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={isAvailable ? { y: -5 } : {}}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${
                    isAvailable 
                      ? `hover:border-${color}-300 hover:shadow-xl cursor-pointer`
                      : 'border-gray-200 opacity-60'
                  }`}
                  onClick={() => isAvailable && handleStartDebate(type.id)}
                >
                  <div className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${color}-100 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${color}-600`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {getDebateTypeDescription(type.id)}
                    </p>
                    
                    {isAvailable ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full px-6 py-3 bg-${color}-600 text-white rounded-lg font-medium hover:bg-${color}-700 transition-colors flex items-center justify-center gap-2`}
                      >
                        <Play className="w-4 h-4" />
                        Start Debate
                      </motion.button>
                    ) : (
                      <button
                        disabled
                        className="w-full px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {userPlan !== 'elite' ? (
                          <>
                            <Crown className="w-4 h-4" />
                            Elite Required
                          </>
                        ) : (
                          'Not Available'
                        )}
                      </button>
                    )}
                  </div>
                  
                  {!isAvailable && userPlan !== 'elite' && (
                    <div className="absolute top-4 right-4">
                      <Crown className="w-6 h-6 text-yellow-500" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* News Articles Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Related News Articles</h2>
            <p className="text-gray-600 text-lg">Explore different perspectives on this topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => handleViewNews(article.id)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image_url ? `https://wowfy.in/testusr/images/${article.image_url}` : '/placeholder-news.jpg'}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Viewpoint Badge */}
                    {article.viewpoint && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {article.viewpoint}
                        </span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(article.show_date)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    {article.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    )}

                    {/* Bottom Info */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.created_at)}
                      </span>
                      
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {newsArticles.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles available</h3>
              <p className="text-gray-600">Articles will appear here when they become available</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsGroupDetailsPage;