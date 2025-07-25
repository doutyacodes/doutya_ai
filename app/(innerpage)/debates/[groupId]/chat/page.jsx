// Full-screen responsive chat interface with red/white theme
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { 
  MessageCircle, 
  ArrowLeft,
  Loader2,
  Send,
  Brain,
  Users,
  Target,
  ChevronRight,
  Crown,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Sword,
  RotateCcw,
  TrendingUp,
  Award,
  Sparkles,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

const DebateChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const groupId = params.groupId;
  const debateType = searchParams.get('type') || 'user_vs_ai';
  
  const [step, setStep] = useState('setup'); // setup, position-select, chat, report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Setup state
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [aiPosition, setAiPosition] = useState('');
  const [selectedUserStance, setSelectedUserStance] = useState(''); // 'for' or 'against' for MCQ
  
  // Chat state
  const [debateRoom, setDebateRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isDebateCompleted, setIsDebateCompleted] = useState(false);
  const [report, setReport] = useState(null);
  const [debateInfo, setDebateInfo] = useState(null);
  
  // AI vs AI state
  const [aiConversations, setAiConversations] = useState([]);
  const [visibleConversations, setVisibleConversations] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  
  // MCQ state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [mcqHistory, setMcqHistory] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    if (groupId) {
      setTopic(`Discussion about news from Group ${groupId}`);
      fetchDebateInfo();
    }
  }, [groupId]);

  const fetchDebateInfo = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/debates/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDebateInfo(data.data.debateInfo);
        
        if (data.data.debateInfo) {
          if (data.data.debateInfo.forPosition) {
            setAiPosition(data.data.debateInfo.forPosition.title);
          }
          if (data.data.debateInfo.againstPosition) {
            setUserPosition(`I support a position different from: ${data.data.debateInfo.againstPosition.title}`);
          }
          if (data.data.debateInfo.topic) {
            setTopic(data.data.debateInfo.topic.topic_title);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching debate info:', err);
    }
  };

  const getDebateTypeInfo = () => {
    switch (debateType) {
      case 'user_vs_ai':
        return {
          title: 'Debate with AI',
          icon: MessageCircle,
          color: 'red',
          gradient: 'from-red-500 to-red-600',
          description: 'Engage in a structured debate with AI taking an opposing view'
        };
      case 'ai_vs_ai':
        return {
          title: 'Watch AI vs AI',
          icon: Users,
          color: 'purple',
          gradient: 'from-purple-500 to-violet-600',
          description: 'Watch two AIs debate each other on the topic'
        };
      case 'mcq':
        return {
          title: 'Multiple Choice Response',
          icon: Target,
          color: 'green',
          gradient: 'from-green-500 to-emerald-600',
          description: 'Navigate through an interactive debate decision tree'
        };
      default:
        return {
          title: 'AI Debate',
          icon: Brain,
          color: 'gray',
          gradient: 'from-gray-500 to-slate-600',
          description: 'Interactive debate experience'
        };
    }
  };

  const createDebate = async () => {
    if (debateType === "user_vs_ai") {
      if (!topic.trim() || !userPosition.trim() || !aiPosition.trim()) {
        setError("Please enter topic and both positions");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("user_token");
      const payload = {
        topic: topic.trim(),
        debateType,
        userPosition: userPosition.trim() || null,
        aiPosition: aiPosition.trim() || null,
        groupId: groupId,
      };

      // Add preferred tree type for MCQ
      if (debateType === "mcq" && selectedUserStance) {
        payload.preferredTreeType = selectedUserStance === 'for' ? 'ai_against' : 'ai_for';
      }

      const response = await fetch("/api/ai-debate/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setDebateRoom(data.debate);
        
        if (debateType === "user_vs_ai") {
          setMessages(data.messages || []);
          setStep("chat");
        } else if (debateType === "ai_vs_ai") {
          setAiConversations(data.conversations || []);
          // Show first round immediately for AI vs AI
          const firstRoundConversations = data.conversations?.filter(conv => conv.conversation_round === 1) || [];
          setVisibleConversations(firstRoundConversations);
          setCurrentRound(1);
          setStep("chat");
        } else if (debateType === "mcq") {
          setCurrentQuestion(data.currentQuestion);
          setCurrentLevel(1);
          setMcqHistory([]);
          setStep("chat");
        }
      } else {
        throw new Error(data.error || "Failed to create debate");
      }
    } catch (err) {
      console.error("Error creating debate:", err);
      setError(err.message || "Failed to create debate. Please try again.");
      toast.error("Failed to create debate");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || loading) return;

    setLoading(true);
    const messageText = userMessage.trim();
    setUserMessage("");

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/ai-debate/${debateRoom.id}/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: messageText }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, data.userMessage, data.aiResponse]);
        
        if (data.debateCompleted) {
          setIsDebateCompleted(true);
          setReport(data.report);
          setStep("report");
        }
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
      setUserMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  const showNextAIConversation = async () => {
    const maxRounds = Math.max(...(aiConversations.length > 0 ? aiConversations.map(c => c.conversation_round) : [0]));
    if (currentRound >= maxRounds) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/ai-debate/${debateRoom.id}/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "show_next" }),
      });

      const data = await response.json();

      if (response.ok) {
        const newRound = currentRound + 1;
        setCurrentRound(newRound);
        
        const roundConversations = aiConversations.filter(conv => conv.conversation_round === newRound);
        setVisibleConversations(prev => [...prev, ...roundConversations]);

        if (data.debateCompleted) {
          setIsDebateCompleted(true);
          setReport(data.report);
          setStep("report");
        }
      } else {
        throw new Error(data.error || "Failed to show next conversation");
      }
    } catch (err) {
      console.error("Error showing next conversation:", err);
      toast.error("Failed to load next conversation");
    } finally {
      setLoading(false);
    }
  };

  const submitMcqAnswer = async (selectedOption) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/ai-debate/${debateRoom.id}/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedOptionId: selectedOption.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setMcqHistory(prev => [...prev, {
          question: currentQuestion,
          selectedOption: selectedOption,
          level: currentLevel,
        }]);

        if (data.isCompleted) {
          setIsDebateCompleted(true);
          setReport(data.report);
          setStep("report");
        } else {
          setCurrentQuestion(data.nextQuestion);
          setCurrentLevel(data.currentLevel);
        }
      } else {
        throw new Error(data.error || "Failed to submit answer");
      }
    } catch (err) {
      console.error("Error submitting MCQ answer:", err);
      toast.error("Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const typeInfo = getDebateTypeInfo();
  const TypeIcon = typeInfo.icon;

  // Full-screen Chat Interface
  const renderFullScreenChat = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col">
      {/* Header - Fixed */}
      <div className={`bg-gradient-to-r ${typeInfo.gradient} text-white shadow-lg border-b-4 border-red-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/debates/${groupId}`)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-white/30 hidden sm:block" />
              <div className="flex items-center gap-3">
                <TypeIcon className="w-6 h-6" />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">{typeInfo.title}</h1>
                  <p className="text-sm opacity-90 truncate max-w-xs sm:max-w-md">
                    {debateRoom?.topic || topic}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {debateType === "ai_vs_ai" 
                    ? `Round ${currentRound} of ${Math.max(...(aiConversations.length > 0 ? aiConversations.map(c => c.conversation_round) : [1]))}`
                    : debateType === "mcq"
                    ? `Round ${currentLevel} of 5`
                    : `Message ${messages.length}`
                  }
                </span>
                <span className="sm:hidden">
                  {debateType === "ai_vs_ai" 
                    ? `${currentRound}/${Math.max(...(aiConversations.length > 0 ? aiConversations.map(c => c.conversation_round) : [1]))}`
                    : debateType === "mcq"
                    ? `${currentLevel}/5`
                    : messages.length
                  }
                </span>
              </div>
              <div className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content - Flexible */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
            {debateType === "mcq" ? renderMCQContent() : renderMessageContent()}
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {renderInputArea()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMCQContent = () => {
    if (!currentQuestion) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading question...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <span className="text-sm font-semibold text-gray-600">Progress</span>
            <span className="text-sm text-gray-500">Round {currentLevel} of 5</span>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  i < currentLevel ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* User's Stance Reminder */}
        {selectedUserStance && (
          <div className={`rounded-2xl p-4 sm:p-6 border-2 ${
            selectedUserStance === 'for' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {selectedUserStance === 'for' ? (
                <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <Sword className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-semibold ${
                  selectedUserStance === 'for' ? 'text-green-800' : 'text-red-800'
                }`}>
                  Your Stance: {selectedUserStance === 'for' ? 'Supporting' : 'Opposing'}
                </p>
                <p className={`text-sm ${
                  selectedUserStance === 'for' ? 'text-green-600' : 'text-red-600'
                }`}>
                  You're arguing {selectedUserStance === 'for' ? 'in favor of' : 'against'} the main position
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* AI Message */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{currentQuestion.ai_persona}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium self-start">
                  AI Moderator
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{currentQuestion.ai_message}</p>
            </div>
          </div>
        </div>

        {/* Response Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Choose your response:
          </h3>
          
          <div className="grid gap-3 sm:gap-4">
            {currentQuestion.options?.map((option, index) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => submitMcqAnswer(option)}
                disabled={loading}
                className={`w-full p-4 sm:p-6 text-left rounded-2xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:shadow-lg ${
                  selectedUserStance === 'for' 
                    ? 'border-green-200 hover:border-green-400 hover:bg-green-50' 
                    : 'border-red-200 hover:border-red-400 hover:bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 text-sm ${
                    selectedUserStance === 'for' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 leading-relaxed text-sm sm:text-base">{option.option_text}</p>
                    <div className="mt-2 sm:mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedUserStance === 'for' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUserStance === 'for' ? 'SUPPORTING' : 'OPPOSING'} Position
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = () => {
    if (debateType === "ai_vs_ai") {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Topic Display */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Debate Topic:</h4>
            <p className="text-gray-700 text-sm sm:text-base">{debateRoom?.topic}</p>
          </div>

          {/* AI vs AI Instructions */}
          {visibleConversations.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 max-w-md mx-auto">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Debate Ready</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">Watch two AI personas debate different perspectives on this topic</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Play className="w-4 h-4" />
                  <span>Click "Show Next Round" to begin</span>
                </div>
              </div>
            </div>
          )}

          {/* Conversations */}
          <div className="space-y-4 sm:space-y-6">
            {visibleConversations.map((message, index) => (
              <motion.div
                key={message.id || `${message.conversation_round}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex ${message.sender === "ai_1" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-xs sm:max-w-lg lg:max-w-xl p-4 sm:p-6 rounded-2xl shadow-lg ${
                  message.sender === "ai_1"
                    ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                    : "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                }`}>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      message.sender === "ai_1" ? "bg-white/20" : "bg-white/20"
                    }`}>
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm opacity-90">
                        {message.sender === "ai_1" ? "AI 1" : "AI 2"}
                      </div>
                      {message.ai_persona && (
                        <div className="text-xs opacity-75">{message.ai_persona}</div>
                      )}
                    </div>
                  </div>
                  <p className="leading-relaxed text-sm sm:text-base">{message.content}</p>
                  <div className="mt-2 text-xs opacity-75">
                    Round {message.conversation_round}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Topic Display */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Debate Topic:</h4>
            <p className="text-gray-700 text-sm sm:text-base">{debateRoom?.topic}</p>
          </div>

          {/* Messages */}
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs sm:max-w-lg lg:max-w-xl p-4 sm:p-6 rounded-2xl shadow-lg ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" ? "bg-white/20" : "bg-red-100"
                    }`}>
                      {message.sender === "user" ? (
                        <span className="text-white font-bold text-xs sm:text-sm">You</span>
                      ) : (
                        <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                      )}
                    </div>
                    <span className={`font-semibold text-xs sm:text-sm ${
                      message.sender === "user" ? "text-white/90" : "text-gray-700"
                    }`}>
                      {message.sender === "user" ? "You" : "AI Opponent"}
                    </span>
                  </div>
                  <p className="leading-relaxed text-sm sm:text-base">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state for User vs AI */}
          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 max-w-md mx-auto">
                <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ready to Debate</h3>
                <p className="text-gray-600 text-sm sm:text-base">Start the conversation by typing your opening argument</p>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  const renderInputArea = () => {
    if (debateType === "mcq") {
      return loading ? (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
          <p className="text-gray-600 mt-2 font-medium text-sm sm:text-base">Processing your choice...</p>
        </div>
      ) : null;
    }

    if (debateType === "ai_vs_ai") {
      const maxRounds = Math.max(...(aiConversations.length > 0 ? aiConversations.map(c => c.conversation_round) : [1]));
      return currentRound < maxRounds ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={showNextAIConversation}
          disabled={loading}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">Loading...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Show Next Round ({currentRound + 1} of {maxRounds})</span>
              <span className="sm:hidden">Next Round ({currentRound + 1}/{maxRounds})</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4 font-medium text-sm sm:text-base">
            All rounds completed! ({maxRounds} rounds total)
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep("report")}
            className="px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            View Report
          </motion.button>
        </div>
      );
    }

    return !isDebateCompleted ? (
      <div className="flex gap-3 sm:gap-4">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your response..."
          className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm sm:text-base"
          maxLength={500}
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          disabled={!userMessage.trim() || loading}
          className="px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold text-sm sm:text-base"
        >
          {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </div>
    ) : null;
  };

  const renderSetup = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${typeInfo.gradient} p-6 sm:p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 transform translate-x-8 sm:translate-x-16 -translate-y-8 sm:-translate-y-16">
              <div className="w-full h-full bg-white/10 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <button
                onClick={() => router.push(`/debates/${groupId}`)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 sm:mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Debate Types</span>
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 sm:mb-6"
                >
                  <TypeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{typeInfo.title}</h1>
                <p className="text-base sm:text-lg opacity-90">{typeInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Setup Content */}
          <div className="p-6 sm:p-8">
            {debateType === "user_vs_ai" && (
              <div className="space-y-4 sm:space-y-6">
                {debateInfo && (debateInfo.forPosition || debateInfo.againstPosition) && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 rounded-2xl border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-4 text-sm sm:text-base">Available Debate Positions</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {debateInfo.forPosition && (
                        <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200">
                          <p className="font-semibold text-green-900 text-xs sm:text-sm">FOR: {debateInfo.forPosition.title}</p>
                          <p className="text-green-600 text-xs mt-1">Persona: {debateInfo.forPosition.persona}</p>
                        </div>
                      )}
                      {debateInfo.againstPosition && (
                        <div className="bg-red-50 p-3 sm:p-4 rounded-xl border border-red-200">
                          <p className="font-semibold text-red-900 text-xs sm:text-sm">AGAINST: {debateInfo.againstPosition.title}</p>
                          <p className="text-red-600 text-xs mt-1">Persona: {debateInfo.againstPosition.persona}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Debate Topic</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter the debate topic..."
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none bg-gray-50 text-sm sm:text-base"
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Position</label>
                  <input
                    type="text"
                    value={userPosition}
                    onChange={(e) => setUserPosition(e.target.value)}
                    placeholder="e.g., I support this because..."
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-gray-50 text-sm sm:text-base"
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">AI Position</label>
                  <input
                    type="text"
                    value={aiPosition}
                    onChange={(e) => setAiPosition(e.target.value)}
                    placeholder="e.g., I oppose this because..."
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-gray-50 text-sm sm:text-base"
                    maxLength={200}
                  />
                </div>
              </div>
            )}

            {debateType === "ai_vs_ai" && (
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 sm:p-6 rounded-2xl border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3 text-sm sm:text-base">AI vs AI Debate</h4>
                <p className="text-purple-700 text-xs sm:text-sm mb-4">
                  Watch a pre-generated debate between two AI personas on this news topic. 
                  You&apos;ll observe different perspectives and argumentation techniques.
                </p>
                
                {debateInfo && (debateInfo.forPosition || debateInfo.againstPosition) && (
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {debateInfo.forPosition && (
                      <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200">
                        <p className="font-semibold text-green-900 text-xs sm:text-sm">AI 1 (FOR)</p>
                        <p className="text-green-800 text-xs">{debateInfo.forPosition.title}</p>
                        <p className="text-green-600 text-xs">Persona: {debateInfo.forPosition.persona}</p>
                      </div>
                    )}
                    {debateInfo.againstPosition && (
                      <div className="bg-red-50 p-3 sm:p-4 rounded-xl border border-red-200">
                        <p className="font-semibold text-red-900 text-xs sm:text-sm">AI 2 (AGAINST)</p>
                        <p className="text-red-800 text-xs">{debateInfo.againstPosition.title}</p>
                        <p className="text-red-600 text-xs">Persona: {debateInfo.againstPosition.persona}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={() => router.push(`/debates/${groupId}`)}
                className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => debateType === 'mcq' ? setStep('position-select') : createDebate()}
                disabled={loading}
                className={`flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r ${typeInfo.gradient} text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    {debateType === 'mcq' ? 'Choose Position' : 'Start Debate'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Position Selection Component (unchanged but responsive)
  const renderPositionSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${typeInfo.gradient} p-6 sm:p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 transform translate-x-8 sm:translate-x-16 -translate-y-8 sm:-translate-y-16">
              <div className="w-full h-full bg-white/10 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <button
                onClick={() => router.push(`/debates/${groupId}`)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 sm:mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Debate Types</span>
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 sm:mb-6"
                >
                  <TypeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{typeInfo.title}</h1>
                <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
                  Choose your stance to shape the debate experience
                </p>
              </div>
            </div>
          </div>

          {/* Position Selection */}
          <div className="p-6 sm:p-8 md:p-12">
            {/* Topic Display */}
            {debateInfo && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 border border-red-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Debate Topic</h3>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">{debateInfo.topic?.topic_title}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-800 text-sm sm:text-base">Supporting Position</span>
                    </div>
                    <p className="text-green-700 text-xs sm:text-sm font-medium">{debateInfo.forPosition?.position_title}</p>
                    <p className="text-green-600 text-xs mt-1">AI Persona: {debateInfo.forPosition?.persona}</p>
                  </div>
                  
                  <div className="bg-red-50 p-3 sm:p-4 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-semibold text-red-800 text-sm sm:text-base">Opposing Position</span>
                    </div>
                    <p className="text-red-700 text-xs sm:text-sm font-medium">{debateInfo.againstPosition?.position_title}</p>
                    <p className="text-red-600 text-xs mt-1">AI Persona: {debateInfo.againstPosition?.persona}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Which position would you like to argue?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Your choice will determine which AI perspective you&apos;ll debate against
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Support Position */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedUserStance('for')}
                className={`p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedUserStance === 'for'
                    ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl flex items-center justify-center ${
                    selectedUserStance === 'for' ? 'bg-green-500' : 'bg-green-100'
                  }`}>
                    <Shield className={`w-6 h-6 sm:w-8 sm:h-8 ${
                      selectedUserStance === 'for' ? 'text-white' : 'text-green-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">I Support</h3>
                  <p className="text-green-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                    {debateInfo?.forPosition?.position_title || 'Supporting Position'}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    You&apos;ll argue in favor of this position. The AI will challenge you with opposing arguments.
                  </p>
                  
                  {selectedUserStance === 'for' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-green-700"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-sm sm:text-base">Selected</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Against Position */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedUserStance('against')}
                className={`p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedUserStance === 'against'
                    ? 'border-red-500 bg-red-50 shadow-lg shadow-red-200'
                    : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl flex items-center justify-center ${
                    selectedUserStance === 'against' ? 'bg-red-500' : 'bg-red-100'
                  }`}>
                    <Sword className={`w-6 h-6 sm:w-8 sm:h-8 ${
                      selectedUserStance === 'against' ? 'text-white' : 'text-red-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">I Oppose</h3>
                  <p className="text-red-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                    {debateInfo?.againstPosition?.position_title || 'Opposing Position'}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    You&apos;ll argue against this position. The AI will defend it with supporting arguments.
                  </p>
                  
                  {selectedUserStance === 'against' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-red-700"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-sm sm:text-base">Selected</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Continue Button */}
            <div className="text-center mt-8 sm:mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => createDebate()}
                disabled={!selectedUserStance || loading}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                  selectedUserStance && !loading
                    ? `bg-gradient-to-r ${typeInfo.gradient} text-white shadow-lg hover:shadow-xl`
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Starting Debate...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>Start Multiple Choice Response</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </motion.button>
              
              {selectedUserStance && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4"
                >
                  You&apos;ve chosen to argue {selectedUserStance === 'for' ? 'in support of' : 'against'} the main position
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Report component (unchanged but responsive)
  const renderReport = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 transform translate-x-8 sm:translate-x-16 -translate-y-8 sm:-translate-y-16">
              <div className="w-full h-full bg-white/10 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 sm:mb-6"
              >
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Debate Complete!</h1>
              <p className="text-base sm:text-lg opacity-90">Here&apos;s your performance analysis</p>
            </div>
          </div>

          {/* Report Content */}
          {report && (
            <div className="p-6 sm:p-8 space-y-4 sm:space-y-6 pb-16">
              {/* Overall Analysis */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 rounded-2xl border border-red-200">
                <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Overall Analysis
                </h3>
                <p className="text-red-800 leading-relaxed text-sm sm:text-base">{report.overall_analysis}</p>
              </div>

              {/* Strengths and Improvements Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl border border-green-200">
                  <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Strengths
                  </h4>
                  <p className="text-green-800 leading-relaxed text-sm sm:text-base">{report.strengths}</p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 sm:p-6 rounded-2xl border border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    Areas for Improvement
                  </h4>
                  <p className="text-orange-800 leading-relaxed text-sm sm:text-base">{report.improvements}</p>
                </div>
              </div>

              {/* Insights */}
              {report.insights && (
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 sm:p-6 rounded-2xl border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                    Key Insights
                  </h4>
                  <p className="text-purple-800 leading-relaxed text-sm sm:text-base">{report.insights}</p>
                </div>
              )}

              {/* Results */}
              {report.winner && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 sm:p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    Debate Result
                  </h4>
                  <p className="text-gray-800 text-base sm:text-lg font-semibold">
                    Winner: {
                      report.winner === "user" ? "🎉 You!" : 
                      report.winner === "tie" ? "🤝 Tie Game" : 
                      report.winner === "ai_1" ? "🤖 AI Position 1" :
                      report.winner === "ai_2" ? "🤖 AI Position 2" :
                      "🤖 AI"
                    }
                  </p>
                </div>
              )}

              {/* MCQ Summary */}
              {debateType === "mcq" && report.choice_count && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-cyan-200">
                  <h4 className="font-bold text-cyan-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                    Multiple Choice Summary
                  </h4>
                  <p className="text-cyan-800 text-sm sm:text-base">
                    You navigated through {report.choice_count} decision points, 
                    exploring {selectedUserStance === 'for' ? 'supporting' : 'opposing'} arguments throughout the debate tree.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/debates/${groupId}/chat?type=${debateType}`)}
                  className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  Try Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/debates/${groupId}`)}
                  className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  Back to Debates
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {step === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderSetup()}
          </motion.div>
        )}
        
        {step === 'position-select' && (
          <motion.div
            key="position-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderPositionSelection()}
          </motion.div>
        )}
        
        {step === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderFullScreenChat()}
          </motion.div>
        )}
        
        {step === 'report' && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderReport()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DebateChatPage;