// app/debates/[groupId]/page.jsx - Fixed with red/white theme and no blocking overlays
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
  TrendingUp,
  Zap,
  Target,
  BookOpen,
  Award,
  ArrowRight
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

  const getDebateTypeInfo = (type) => {
    switch (type) {
      case 'user_vs_ai':
        return {
          icon: MessageCircle,
          color: 'red',
          gradient: 'from-red-500 to-red-600',
          bgGradient: 'from-red-50 to-red-100',
          title: 'Debate with AI',
          subtitle: 'Challenge yourself against AI',
          description: 'Engage in a structured, real-time debate where you present your arguments and the AI counters with opposing viewpoints.',
          features: ['Real-time responses', 'Structured arguments', 'Performance analysis'],
          difficulty: 'Interactive',
          duration: '10-15 min'
        };
      case 'ai_vs_ai':
        return {
          icon: Users,
          color: 'purple',
          gradient: 'from-purple-500 to-violet-600',
          bgGradient: 'from-purple-50 to-violet-50',
          title: 'Watch AI vs AI',
          subtitle: 'Learn from expert debates',
          description: 'Observe a high-level debate between two AI personas, each presenting different perspectives with expert-level arguments.',
          features: ['Expert-level arguments', 'Multiple viewpoints', 'Learning experience'],
          difficulty: 'Educational',
          duration: '5-8 min'
        };
      case 'mcq':
        return {
          icon: Target,
          color: 'green',
          gradient: 'from-green-500 to-emerald-600',
          bgGradient: 'from-green-50 to-emerald-50',
          title: 'Multiple Choice Response',
          subtitle: 'Navigate through perspectives',
          description: 'Navigate through an interactive decision tree where your choices shape the debate direction and explore different viewpoints.',
          features: ['Decision-based flow', 'Multiple outcomes', 'Strategic thinking'],
          difficulty: 'Strategic',
          duration: '8-12 min'
        };
      default:
        return {
          icon: Brain,
          color: 'gray',
          gradient: 'from-gray-500 to-slate-600',
          bgGradient: 'from-gray-50 to-slate-50',
          title: 'AI Debate',
          subtitle: 'Interactive experience',
          description: 'Interactive debate experience',
          features: ['Interactive', 'Educational', 'Engaging'],
          difficulty: 'Moderate',
          duration: '10 min'
        };
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
          className="text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading debate content...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your debate experience</p>
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
          className="text-center bg-white rounded-2xl shadow-xl p-8 border border-red-100"
        >
          <div className="bg-red-100 text-red-600 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-2">Unable to Load</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.push('/debates')}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Back to Debates
          </button>
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
          >
            {/* Back Button */}
            <motion.button
              onClick={() => router.push('/debates')}
              className="flex items-center gap-3 text-white/80 hover:text-white transition-colors mb-8 group"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-medium">Back to Debates</span>
            </motion.button>

            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20"
              >
                <MessageCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300">Debate Style</span>
              </h1>
              <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
                Explore different perspectives and engage with AI-powered debates
              </p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6 text-red-100"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{newsArticles.length} Articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">{debateTypes.length} Debate Styles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">AI-Powered Analysis</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Debate Topic Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Debate Topic</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto"></div>
              </div>

              {/* Topic Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Topic Info */}
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Current Affairs Debate
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Engage with today&apos;s most pressing issues through structured debates. 
                    Each debate style offers a unique way to explore different perspectives and develop critical thinking skills.
                  </p>
                  
                  {/* Debate Positions Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-800">Supporting Position</span>
                      </div>
                      <p className="text-green-700 text-sm">Arguments in favor of the topic</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-semibold text-red-800">Opposing Position</span>
                      </div>
                      <p className="text-red-700 text-sm">Arguments against the topic</p>
                    </div>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-red-600 mx-auto mb-2" />
                        <p className="text-red-800 font-semibold">Interactive</p>
                        <p className="text-red-600 text-sm">Debates</p>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      New!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Debate Types Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Select Your Experience</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose how you&apos;d like to engage with AI-powered debates. Each style offers unique benefits and learning opportunities.
            </p>
            {userPlan !== 'elite' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-6 py-3 rounded-2xl border border-orange-200 shadow-sm"
              >
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Upgrade to Elite to unlock AI Debates</span>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {debateTypes.map((type, index) => {
              const typeInfo = getDebateTypeInfo(type.id);
              const Icon = typeInfo.icon;
              const isAvailable = userPlan === 'elite' && type.available;
              
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={isAvailable ? { y: -8, scale: 1.02 } : {}}
                  className={`relative group ${isAvailable ? 'cursor-pointer' : ''}`}
                  onClick={() => isAvailable && handleStartDebate(type.id)}
                >
                  <div className={`h-full bg-white rounded-3xl shadow-xl border-2 transition-all duration-500 overflow-hidden ${
                    isAvailable 
                      ? `hover:border-${typeInfo.color}-300 hover:shadow-2xl`
                      : 'border-gray-200 opacity-75'
                  }`}>
                    {/* Card Header */}
                    <div className={`bg-gradient-to-r ${typeInfo.bgGradient} p-6 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                        <div className={`w-full h-full bg-gradient-to-br ${typeInfo.gradient} opacity-10 rounded-full`}></div>
                      </div>
                      
                      <div className="relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-br ${typeInfo.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{typeInfo.title}</h3>
                        <p className={`text-${typeInfo.color}-700 font-medium mb-4`}>{typeInfo.subtitle}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`bg-${typeInfo.color}-100 text-${typeInfo.color}-800 px-3 py-1 rounded-full font-medium`}>
                            {typeInfo.difficulty}
                          </span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {typeInfo.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1">
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {typeInfo.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        {typeInfo.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className={`w-5 h-5 text-${typeInfo.color}-500 flex-shrink-0`} />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 pt-0">
                      {isAvailable ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-4 bg-gradient-to-r ${typeInfo.gradient} text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group`}
                        >
                          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Start Debate
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-4 bg-gray-200 text-gray-500 rounded-2xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {userPlan !== 'elite' ? (
                            <>
                              <Crown className="w-5 h-5" />
                              Elite Required
                            </>
                          ) : (
                            'Not Available'
                          )}
                        </button>
                      )}
                    </div>

                    {/* Elite Badge */}
                    {!isAvailable && userPlan !== 'elite' && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-2 rounded-full shadow-lg">
                          <Crown className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* News Articles Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore different perspectives and background information on this debate topic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => handleViewNews(article.id)}
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 h-full flex flex-col">
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
                        <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          {article.viewpoint}
                        </span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {formatDate(article.show_date)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    {article.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                        {article.summary}
                      </p>
                    )}

                    {/* Bottom Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.created_at)}
                      </span>
                      
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Read</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {newsArticles.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-lg p-12 max-w-lg mx-auto">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles available</h3>
                <p className="text-gray-600">Articles will appear here when they become available for this debate topic</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsGroupDetailsPage;