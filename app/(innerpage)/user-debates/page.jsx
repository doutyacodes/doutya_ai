// app/user-debates/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Plus,
  Clock,
  CheckCircle,
  PlayCircle,
  Award,
  Loader2,
  Crown,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// New Debate Modal Component
const NewDebateModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    user_position_title: "",
    ai_position_title: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.user_position_title.trim() || !formData.ai_position_title.trim()) {
      toast.error("All fields are required");
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ title: "", user_position_title: "", ai_position_title: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden rounded-t-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-16 -translate-y-16">
            <div className="w-full h-full bg-white/10 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create Custom Debate</h2>
                <p className="text-blue-100">Design your own debate topic and positions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Debate Topic
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Should artificial intelligence replace human jobs?"
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
              maxLength={255}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">Choose a topic you&apos;re passionate about debating</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Position Title
              </label>
              <input
                type="text"
                value={formData.user_position_title}
                onChange={(e) => setFormData({...formData, user_position_title: e.target.value})}
                placeholder="e.g., AI should replace human jobs"
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                maxLength={255}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">The position you&apos;ll argue for</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                AI Position Title
              </label>
              <input
                type="text"
                value={formData.ai_position_title}
                onChange={(e) => setFormData({...formData, ai_position_title: e.target.value})}
                placeholder="e.g., AI should not replace human jobs"
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                maxLength={255}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">The position AI will defend against you</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">How Custom Debates Work</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• You&apos;ll have 5 conversation turns to present your arguments</li>
                  <li>• AI will counter each of your points with intelligent responses</li>
                  <li>• Get a detailed performance report at the end</li>
                  <li>• Practice critical thinking and argumentation skills</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Debate
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const UserDebatesPage = () => {
  const router = useRouter();
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState(null);
  const [showNewDebateModal, setShowNewDebateModal] = useState(false);
  const [creatingDebate, setCreatingDebate] = useState(false);

  useEffect(() => {
    fetchUserPlan();
    fetchDebates();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/users/plan", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUserPlan(data.data);
      }
    } catch (error) {
      console.error("Error fetching user plan:", error);
    }
  };

  const fetchDebates = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user-debates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDebates(data.data);
      } else {
        toast.error("Failed to load debates");
      }
    } catch (error) {
      console.error("Error fetching debates:", error);
      toast.error("Failed to load debates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDebate = async (formData) => {
    setCreatingDebate(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user-debates", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Debate created successfully!");
        setShowNewDebateModal(false);
        router.push(`/user-debates/${data.data.debate.id}`);
      } else {
        throw new Error(data.error || "Failed to create debate");
      }
    } catch (error) {
      console.error("Error creating debate:", error);
      toast.error(error.message || "Failed to create debate");
    } finally {
      setCreatingDebate(false);
    }
  };

  const handleDebateClick = (debate) => {
    router.push(`/user-debates/${debate.id}`);
  };

  const handleNewDebateClick = () => {
    if (userPlan?.plan !== 'elite') {
      toast.error("Custom Debates are only available for Elite members");
      return;
    }
    setShowNewDebateModal(true);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionButton = (debate) => {
    if (debate.status === 'completed') {
      return (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-xl">
          <Award className="w-4 h-4" />
          <span className="font-medium text-sm">View Report</span>
        </div>
      );
    } else if (debate.can_continue) {
      return (
        <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-xl">
          <PlayCircle className="w-4 h-4" />
          <span className="font-medium text-sm">Continue</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-xl">
          <Clock className="w-4 h-4" />
          <span className="font-medium text-sm">In Progress</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-3xl shadow-2xl p-12 border border-gray-100"
        >
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Your Debates</h3>
          <p className="text-gray-600 text-lg">Preparing your custom debate experience...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
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
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              My Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Debates</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Create, manage, and engage in personalized AI debates on topics that matter to you
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-blue-100 mb-8"
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="font-medium">{debates.length} Total Debates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{debates.filter(d => d.status === 'completed').length} Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                <span className="font-medium">{debates.filter(d => d.status === 'active').length} Active</span>
              </div>
            </motion.div>

            {/* New Debate Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewDebateClick}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto ${
                userPlan?.plan === 'elite'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white'
                  : 'bg-white/20 backdrop-blur-sm text-white/80 border border-white/30'
              }`}
            >
              {userPlan?.plan === 'elite' ? (
                <>
                  <Plus className="w-6 h-6" />
                  Create New Debate
                </>
              ) : (
                <>
                  <Crown className="w-6 h-6" />
                  Upgrade to Elite for Custom Debates
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Debates Grid */}
        {debates.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {debates.map((debate, index) => (
              <motion.div
                key={debate.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleDebateClick(debate)}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer group"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {debate.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(debate.status)}`}>
                          {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(debate.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">
                        {debate.conversation_count}/{debate.max_conversations}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${debate.progress_percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Positions */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-green-800">Your Position</span>
                      </div>
                      <p className="text-green-700 text-sm font-medium">{debate.user_position_title}</p>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-red-800">AI Position</span>
                      </div>
                      <p className="text-red-700 text-sm font-medium">{debate.ai_position_title}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    {getActionButton(debate)}
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <span className="text-sm font-semibold">
                        {debate.status === 'completed' ? 'View' : 'Continue'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Custom Debates Yet</h3>
              <p className="text-gray-600 text-lg mb-8">
                Create your first custom debate to start engaging with AI on topics you&apos;re passionate about!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewDebateClick}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto ${
                  userPlan?.plan === 'elite'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                }`}
                disabled={userPlan?.plan !== 'elite'}
              >
                {userPlan?.plan === 'elite' ? (
                  <>
                    <Plus className="w-6 h-6" />
                    Create Your First Debate
                  </>
                ) : (
                  <>
                    <Crown className="w-6 h-6" />
                    Elite Required
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* New Debate Modal */}
      <AnimatePresence>
        {showNewDebateModal && (
          <NewDebateModal
            isOpen={showNewDebateModal}
            onClose={() => setShowNewDebateModal(false)}
            onSubmit={handleCreateDebate}
            loading={creatingDebate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDebatesPage;