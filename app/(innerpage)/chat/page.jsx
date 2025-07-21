"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Plus, 
  Clock, 
  Send, 
  ArrowLeft, 
  Search,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  X,
  Crown,
  Star,
  Shield,
  Loader2,
  FileText,
  BarChart3,
  Award
} from 'lucide-react';

// AI personalities
const AI_PERSONALITIES = [
  { 
    id: 1, 
    name: 'Scholar', 
    color: 'from-indigo-500 to-purple-600', 
    bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    description: 'Evidence-based analytical thinking', 
    emoji: '🎓',
    traits: ['Factual', 'Research-driven', 'Methodical']
  },
  { 
    id: 2, 
    name: 'Advocate', 
    color: 'from-emerald-500 to-teal-600', 
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    description: 'Passionate social justice perspective', 
    emoji: '⚖️',
    traits: ['Persuasive', 'Ethical', 'Progressive']
  },
  { 
    id: 3, 
    name: 'Skeptic', 
    color: 'from-orange-500 to-red-500', 
    bg: 'bg-gradient-to-br from-orange-500 to-red-500',
    description: 'Critical analysis and questioning', 
    emoji: '🤔',
    traits: ['Questioning', 'Logical', 'Cautious']
  },
  { 
    id: 4, 
    name: 'Visionary', 
    color: 'from-blue-500 to-cyan-500', 
    bg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    description: 'Future-focused innovative thinking', 
    emoji: '🚀',
    traits: ['Creative', 'Forward-thinking', 'Optimistic']
  }
];

// Pro member topic options
const PRO_TOPIC_OPTIONS = [
  "Should artificial intelligence replace human decision-making in healthcare?",
  "Is remote work the future of employment?",
  "Should social media platforms be regulated like traditional media?",
  "Is cryptocurrency the future of money?",
  "Should we invest in space exploration or focus on Earth's problems?",
  "Is universal basic income necessary for society?",
  "Should genetic engineering be used to enhance human capabilities?",
  "Is privacy possible in the digital age?",
  "Should we ban autonomous weapons?",
  "Is nuclear energy the solution to climate change?"
];

const AIChatSystem = () => {
  // State management
  const [currentView, setCurrentView] = useState('list');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [userPlan, setUserPlan] = useState('starter'); // starter, pro, elite
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [selectedAIs, setSelectedAIs] = useState([]);
  const [selectedProTopic, setSelectedProTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiTypingStates, setAiTypingStates] = useState({});
  const [chatReport, setChatReport] = useState(null);
  
  // New loading states to prevent race conditions
  const [isInitializing, setIsInitializing] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const sendingMessageRef = useRef(false);

  // Improved API functions with better error handling
  const fetchUserPlan = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setUserPlan('starter');
        return;
      }

      const response = await fetch('/api/user/plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // console.log("data",data. current_plan)
      setUserPlan(data.current_plan || 'starter');
    } catch (error) {
      console.error('Error fetching user plan:', error);
      setUserPlan('starter');
    }
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setChats([]);
        return;
      }

      const response = await fetch('/api/ai-chat/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  };

  const fetchChatMessages = async (chatId) => {
    if (messagesLoading || !chatId) return;
    
    setMessagesLoading(true);
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setMessages([]);
        return;
      }

      const response = await fetch(`/api/ai-chat/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Initialize component with proper loading state
  useEffect(() => {
    const initializeComponent = async () => {
      setIsInitializing(true);
      try {
        await Promise.all([fetchUserPlan(), fetchChats()]);
      } catch (error) {
        console.error('Error initializing component:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeComponent();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Scroll to bottom when chat changes
  useEffect(() => {
    if (selectedChat && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedChat]);

  // Improved message handling with race condition prevention
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessageRef.current) return;

    sendingMessageRef.current = true;
    
    const messageContent = newMessage.trim();
    setNewMessage('');

    const userMessage = {
      id: Date.now(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    const typingAIs = {};
    selectedChat.ai_personalities.forEach(aiId => {
      typingAIs[aiId] = true;
    });
    setAiTypingStates(typingAIs);

    try {
      const response = await fetch(`/api/ai-chat/${selectedChat.id}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setAiTypingStates({});
      setMessages(prev => [...prev, ...data.aiResponses]);

      if (data.chatCompleted) {
        setSelectedChat(prev => ({ ...prev, status: 'completed' }));
        if (data.report) {
          setChatReport(data.report);
          setShowReportModal(true);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setAiTypingStates({});
      alert('Failed to send message. Please try again.');
      setNewMessage(messageContent);
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      sendingMessageRef.current = false;
    }
  };

  const handleCreateChat = async () => {
    if (userPlan === 'starter') {
      alert('AI Chat feature is only available for Pro and Elite members');
      return;
    }

    const topic = userPlan === 'pro' ? selectedProTopic : newTopic;
    if (!topic.trim() || selectedAIs.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-chat/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          aiPersonalities: selectedAIs,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setChats([data.chat, ...chats]);
        setSelectedChat(data.chat);
        setCurrentView('chat');
        setMessages([]);
        setShowCreateModal(false);
        setNewTopic('');
        setSelectedProTopic('');
        setSelectedAIs([]);
      } else {
        alert(data.error || 'Failed to create chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Failed to create chat');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return new Date(date).toLocaleDateString();
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'pro': return <Star className="w-4 h-4" />;
      case 'elite': return <Crown className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'pro': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'elite': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600">Initializing AI Chat...</p>
        </div>
      </div>
    );
  }

  const filteredChats = chats.filter(chat =>
    chat.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat List View Component
  const ChatListView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-2xl bg-white/80 border-b border-slate-200/60">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-slate-900">AI Debates</h1>
                <div className="flex items-center gap-2">
                  <p className="text-slate-600 text-sm">Engage with AI minds on any topic</p>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getPlanColor(userPlan)}`}>
                    {getPlanIcon(userPlan)}
                    <span className="capitalize">{userPlan}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium text-sm sm:text-base disabled:opacity-50"
              disabled={userPlan === 'starter'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Debate</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>

          {/* Mobile Title and Plan */}
          <div className="sm:hidden mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-900">AI Debates</h1>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getPlanColor(userPlan)}`}>
                {getPlanIcon(userPlan)}
                <span className="capitalize">{userPlan}</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Engage with AI minds</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search debates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="px-4 sm:px-6 py-6">
        <AnimatePresence>
          {filteredChats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">No debates yet</h3>
              <p className="text-slate-600 mb-6 max-w-sm mx-auto text-sm leading-relaxed">
                {userPlan === 'starter' 
                  ? 'Upgrade to Pro or Elite to start AI debates'
                  : 'Start your first AI debate to explore different perspectives'
                }
              </p>
              {userPlan !== 'starter' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Create Your First Debate
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => {
                    setSelectedChat(chat);
                    setCurrentView('chat');
                    fetchChatMessages(chat.id);
                  }}
                  whileHover={{ y: -1 }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              chat.status === 'active' ? 'bg-emerald-500 animate-pulse' : 
                              chat.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-xs font-medium capitalize text-slate-600">
                              {chat.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {chat.conversation_count}/5 conversations
                          </span>
                          {chat.status === 'completed' && (
                            <div className="flex items-center gap-1 text-blue-600 text-xs">
                              <FileText className="w-3 h-3" />
                              Report Ready
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 line-clamp-2 text-base sm:text-lg group-hover:text-indigo-700 transition-colors mb-3 leading-snug">
                          {chat.topic}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex -space-x-2">
                        {chat.ai_personalities.slice(0, 3).map((aiId, idx) => {
                          const ai = AI_PERSONALITIES.find(p => p.id === aiId);
                          return (
                            <div
                              key={aiId}
                              className={`w-8 h-8 rounded-xl ${ai.bg} flex items-center justify-center text-white border-2 border-white shadow-sm`}
                              title={ai.name}
                              style={{ zIndex: chat.ai_personalities.length - idx }}
                            >
                              <span className="text-xs">{ai.emoji}</span>
                            </div>
                          );
                        })}
                        {chat.ai_personalities.length > 3 && (
                          <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 border-2 border-white shadow-sm text-xs font-medium">
                            +{chat.ai_personalities.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        {chat.ai_personalities.length} AI minds
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{chat.message_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(chat.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {chat.status === 'completed' ? 'View Report →' : 'Continue →'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // Chat View Component
  const ChatView = () => (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Chat Header */}
      <div className="sticky top-0 z-30 backdrop-blur-2xl bg-white/90 border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setCurrentView('list')}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex -space-x-2 mr-3">
              {selectedChat?.ai_personalities?.slice(0, 3).map((aiId, idx) => {
                const ai = AI_PERSONALITIES.find(p => p.id === aiId);
                return (
                  <div
                    key={aiId}
                    className={`w-10 h-10 rounded-xl ${ai.bg} flex items-center justify-center text-white border-2 border-white shadow-lg relative`}
                    title={ai.name}
                    style={{ zIndex: selectedChat.ai_personalities.length - idx }}
                  >
                    <span className="text-sm">{ai.emoji}</span>
                    {aiTypingStates[aiId] && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white">
                        <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-900 line-clamp-1 text-base sm:text-lg">{selectedChat?.topic}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className={`px-2 py-0.5 rounded-md font-medium ${
                  selectedChat?.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                  selectedChat?.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                }`}>
                  {selectedChat?.status}
                </span>
                <span>•</span>
                <span>{selectedChat?.conversation_count || 0}/5 conversations</span>
                {selectedChat?.status === 'completed' && (
                  <>
                    <span>•</span>
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Report
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[75%] ${message.sender === 'user' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                  : 'bg-white border border-slate-200'} 
                  rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-3 p-4 pb-3 border-b border-slate-100">
                      <div className={`w-8 h-8 rounded-xl ${AI_PERSONALITIES.find(p => p.id === message.ai_personality_id)?.bg} flex items-center justify-center text-white shadow-sm`}>
                        <span className="text-sm">{AI_PERSONALITIES.find(p => p.id === message.ai_personality_id)?.emoji}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 text-sm">
                          {AI_PERSONALITIES.find(p => p.id === message.ai_personality_id)?.name}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <p className={`leading-relaxed text-sm sm:text-base ${message.sender === 'user' ? 'text-white' : 'text-slate-900'}`}>
                      {message.content}
                    </p>
                  </div>
                  
                  <div className={`flex items-center justify-between px-4 pb-4 ${message.sender === 'user' ? 'text-indigo-100' : 'text-slate-500'}`}>
                    <span className="text-xs">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicators */}
          {Object.values(aiTypingStates).some(Boolean) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-slate-600 font-medium">AI minds thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      {selectedChat?.status === 'active' && (
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your perspective..."
                className="flex-1 p-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm bg-white transition-all text-sm"
                rows="1"
                style={{ minHeight: '56px', maxHeight: '120px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessageRef.current}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3.5 rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Create Chat Modal
  const CreateChatModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Start New Debate</h3>
                <div className="flex items-center gap-2">
                  <p className="text-slate-600 text-sm">Create engaging discussions with AI minds</p>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getPlanColor(userPlan)}`}>
                    {getPlanIcon(userPlan)}
                    <span className="capitalize">{userPlan}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Topic Selection */}
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-4">
                Choose Your Debate Topic
              </label>
              
              {userPlan === 'pro' ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Select from our curated topics:</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {PRO_TOPIC_OPTIONS.map((topic, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedProTopic(topic)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          selectedProTopic === topic
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <span className="text-sm font-medium text-slate-700">{topic}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="What would you like to debate about? (Elite members can discuss any topic)"
                    className="w-full p-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all text-sm"
                    rows="3"
                  />
                  <div className="text-xs text-slate-500">
                    ✨ Elite members can discuss any topic of their choice
                  </div>
                </div>
              )}
            </div>

            {/* AI Selection */}
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-4">
                Select AI Debate Partners (1-4 AIs)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AI_PERSONALITIES.map((ai) => (
                  <motion.button
                    key={ai.id}
                    onClick={() => {
                      if (selectedAIs.includes(ai.id)) {
                        setSelectedAIs(selectedAIs.filter(id => id !== ai.id));
                      } else if (selectedAIs.length < 4) {
                        setSelectedAIs([...selectedAIs, ai.id]);
                      }
                    }}
                    className={`p-4 sm:p-6 rounded-2xl border-2 transition-all group ${
                      selectedAIs.includes(ai.id)
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedAIs.includes(ai.id) && selectedAIs.length >= 4}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${ai.bg} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <span className="text-base sm:text-lg">{ai.emoji}</span>
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-bold text-slate-900 group-hover:text-indigo-800 transition-colors text-sm sm:text-base">
                            {ai.name}
                          </p>
                          {selectedAIs.includes(ai.id) && (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mb-3">{ai.description}</p>
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          {ai.traits.map(trait => (
                            <span 
                              key={trait} 
                              className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                                selectedAIs.includes(ai.id)
                                  ? 'bg-indigo-200 text-indigo-800'
                                  : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                              }`}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Info about 5 conversation limit */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium text-sm">Debate Format</p>
                  <p className="text-blue-700 text-sm mt-1">
                    You'll have 5 conversation turns to present your arguments. After that, 
                    our AI will analyze the debate and provide you with a comprehensive report.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-4 border-2 border-slate-300 rounded-2xl hover:bg-slate-50 transition-all font-medium text-slate-700"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleCreateChat}
                disabled={
                  isLoading || 
                  selectedAIs.length === 0 || 
                  (userPlan === 'pro' ? !selectedProTopic : !newTopic.trim())
                }
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  `Start Debate with ${selectedAIs.length} AI${selectedAIs.length > 1 ? 's' : ''}`
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Report Modal
  const ReportModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Debate Analysis Report</h3>
                <p className="text-slate-600 text-sm">AI-powered analysis of your arguments</p>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {chatReport && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-900">Overall Performance</h4>
                </div>
                <p className="text-blue-800 leading-relaxed">{chatReport.overall_analysis}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Strengths
                  </h4>
                  <p className="text-green-800 leading-relaxed">{chatReport.strengths}</p>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h4 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Areas for Improvement
                  </h4>
                  <p className="text-orange-800 leading-relaxed">{chatReport.improvements}</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h4 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Key Insights
                </h4>
                <p className="text-purple-800 leading-relaxed">{chatReport.insights}</p>
              </div>

              {/* Scoring section if available */}
              {(chatReport.argument_quality_score || chatReport.persuasiveness_score || chatReport.logical_consistency_score) && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Scores
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {chatReport.argument_quality_score && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          {chatReport.argument_quality_score}/10
                        </div>
                        <div className="text-sm text-slate-600">Argument Quality</div>
                      </div>
                    )}
                    {chatReport.persuasiveness_score && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          {chatReport.persuasiveness_score}/10
                        </div>
                        <div className="text-sm text-slate-600">Persuasiveness</div>
                      </div>
                    )}
                    {chatReport.logical_consistency_score && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          {chatReport.logical_consistency_score}/10
                        </div>
                        <div className="text-sm text-slate-600">Logical Consistency</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <AnimatePresence mode="wait">
        {currentView === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChatListView />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChatView />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && <CreateChatModal />}
        {showReportModal && <ReportModal />}
      </AnimatePresence>
    </div>
  );
};

export default AIChatSystem;