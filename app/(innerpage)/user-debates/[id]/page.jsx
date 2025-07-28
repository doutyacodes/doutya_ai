// app/user-debates/[id]/page.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  MessageCircle, 
  ArrowLeft,
  Send,
  Loader2,
  Brain,
  User,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Sparkles,
  RotateCcw,
  Trophy,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserDebateChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const messagesEndRef = useRef(null);
  
  const debateId = params.id;
  
  const [debate, setDebate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [report, setReport] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (debateId) {
      fetchDebate();
    }
  }, [debateId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchDebate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(`/api/user-debates/${debateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDebate(data.data.debate);
        setMessages(data.data.messages);
        setReport(data.data.report);
        setProgress(data.data.progress);
        
        if (data.data.progress.is_completed && data.data.report) {
          setShowReport(true);
        }
      } else {
        toast.error(data.error || "Debate not found");
        router.push("/user-debates");
      }
    } catch (error) {
      console.error("Error fetching debate:", error);
      toast.error("Failed to load debate");
      router.push("/user-debates");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || sending || showReport) return;

    setSending(true);
    const messageText = userMessage.trim();
    setUserMessage("");

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user-debates/${debateId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: messageText }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages(prev => [...prev, data.userMessage, data.aiResponse]);
        setProgress(data.progress);
        
        if (data.debateCompleted) {
          setReport(data.report);
          setShowReport(true);
          setDebate(prev => ({ ...prev, status: 'completed' }));
        }
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
      setUserMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Debate</h3>
          <p className="text-gray-600 text-lg">Preparing your custom debate...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/user-debates')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Debates</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{debate?.title}</h1>
                  <p className="text-sm text-gray-500">Custom Debate</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {progress && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{progress.current}/{progress.max} turns</span>
                </div>
              )}
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                debate?.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {debate?.status === 'completed' ? 'Completed' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Debate Info Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Topic */}
              <div className="md:col-span-1">
                <h3 className="font-semibold text-gray-900 mb-2">Topic</h3>
                <p className="text-gray-700 text-sm">{debate?.title}</p>
              </div>
              
              {/* Positions */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800 text-sm">Your Position</span>
                  </div>
                  <p className="text-green-700 text-sm font-medium">{debate?.user_position_title}</p>
                </div>
                
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-800 text-sm">AI Position</span>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{debate?.ai_position_title}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {progress && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Debate Progress</span>
                  <span className="text-sm text-gray-500">
                    {progress.current}/{progress.max} turns ({progress.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                  ></motion.div>
                </div>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-lg p-6 rounded-2xl shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}>
                    {/* Message Header */}
                    <div className="flex items-center gap-2 mb-3">
                      {message.sender === "user" ? (
                        <User className="w-5 h-5 text-blue-100" />
                      ) : (
                        <Brain className="w-5 h-5 text-blue-600" />
                      )}
                      <span className={`font-semibold text-sm ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-600"
                      }`}>
                        {message.sender === "user" ? "You" : "AI Debater"}
                      </span>
                      <span className={`text-xs ${
                        message.sender === "user" ? "text-blue-200" : "text-gray-400"
                      }`}>
                        Turn {message.conversation_turn}
                      </span>
                    </div>
                    
                    {/* Message Content */}
                    <p className="leading-relaxed">{message.content}</p>
                    
                    {/* Timestamp */}
                    <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                      <span className={`text-xs ${
                        message.sender === "user" ? "text-blue-200" : "text-gray-400"
                      }`}>
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-600 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            {!showReport && progress?.can_continue ? (
              <div className="flex gap-4 max-w-4xl mx-auto">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your argument..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                  rows={3}
                  maxLength={500}
                  disabled={sending}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!userMessage.trim() || sending}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold self-end"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </div>
            ) : (
              <div className="text-center max-w-4xl mx-auto">
                {showReport ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-2xl">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Trophy className="w-8 h-8 text-green-600" />
                      <h3 className="text-xl font-bold text-green-900">Debate Completed!</h3>
                    </div>
                    <p className="text-green-700 mb-4">
                      You&apos;ve completed all {progress?.max} conversation turns. Check out your performance report below!
                    </p>
                    <button
                      onClick={() => setShowReport(false)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                    >
                      View Report
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                    <p className="text-blue-700 font-medium">
                      Debate completed! All conversation turns have been used.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Report Section */}
        <AnimatePresence>
          {showReport && report && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="mt-8 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              {/* Report Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-16 -translate-y-16">
                  <div className="w-full h-full bg-white/10 rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
                  >
                    <Award className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Debate Performance Report</h2>
                  <p className="text-lg opacity-90">Detailed analysis of your custom debate</p>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-8 space-y-6">
                {/* Overall Analysis */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Overall Analysis
                  </h3>
                  <p className="text-blue-800 leading-relaxed">{report.overall_analysis}</p>
                </div>

                {/* Strengths and Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Strengths
                    </h4>
                    <p className="text-green-800 leading-relaxed">{report.strengths}</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-200">
                    <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Areas for Improvement
                    </h4>
                    <p className="text-orange-800 leading-relaxed">{report.improvements}</p>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Key Insights
                  </h4>
                  <p className="text-purple-800 leading-relaxed">{report.insights}</p>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Argument Quality', score: report.argument_quality_score, color: 'blue' },
                    { label: 'Persuasiveness', score: report.persuasiveness_score, color: 'green' },
                    { label: 'Factual Accuracy', score: report.factual_accuracy_score, color: 'purple' },
                    { label: 'Logical Consistency', score: report.logical_consistency_score, color: 'orange' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`bg-${item.color}-50 border border-${item.color}-200 p-4 rounded-2xl text-center`}
                    >
                      <div className={`text-3xl font-bold text-${item.color}-600 mb-2`}>
                        {item.score}/10
                      </div>
                      <div className={`text-${item.color}-800 text-sm font-medium`}>
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Winner */}
                {report.winner && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200 text-center">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Debate Result
                    </h4>
                    <p className="text-gray-800 text-lg font-semibold">
                      Winner: {
                        report.winner === "user" ? "🎉 You!" : 
                        report.winner === "tie" ? "🤝 Tie Game" : 
                        "🤖 AI"
                      }
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/user-debates')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Back to My Debates
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/user-debates')}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Create New Debate
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDebateChatPage;