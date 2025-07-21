"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Crown,
  Sparkles,
  User,
  Bot,
  Loader2,
  CheckCircle,
  Award,
  BarChart3,
  TrendingUp,
  Target,
  Brain,
  Trophy,
  Lightbulb,
  ThumbsUp,
  AlertCircle,
  Clock,
  RefreshCw,
  Shuffle
} from 'lucide-react';

const AIDebateModal = ({ isOpen, onClose, newsId, newsTitle }) => {
  // State management
  const [currentStep, setCurrentStep] = useState('topic'); // topic, positions, debate, report
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [aiPosition, setAIPosition] = useState('');
  const [debateRoom, setDebateRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [generatedPositions, setGeneratedPositions] = useState([]);
  const [selectedPositionPair, setSelectedPositionPair] = useState(0);
  
  // Character count and validation
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 500;
  
  // Refs
  const messagesEndRef = useRef(null);
  const sendingMessageRef = useRef(false);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle message input
  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setNewMessage(value);
      setCharacterCount(value.length);
    }
  };

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('topic');
      setTopic('');
      setUserPosition('');
      setAIPosition('');
      setDebateRoom(null);
      setMessages([]);
      setNewMessage('');
      setCharacterCount(0);
      setReport(null);
      setError('');
      setGeneratedPositions([]);
      setSelectedPositionPair(0);
    }
  }, [isOpen]);

  // Enhanced position generation with multiple options
  const generatePositions = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call OpenAI to generate sophisticated debate positions
      const response = await fetch('/api/ai-debate/generate-positions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim()
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedPositions(data.positions);
        setSelectedPositionPair(0);
        setUserPosition(data.positions[0].position1);
        setAIPosition(data.positions[0].position2);
        setCurrentStep('positions');
      } else {
        // Fallback to client-side generation if API fails
        const fallbackPositions = generateFallbackPositions(topic);
        setGeneratedPositions(fallbackPositions);
        setSelectedPositionPair(0);
        setUserPosition(fallbackPositions[0].position1);
        setAIPosition(fallbackPositions[0].position2);
        setCurrentStep('positions');
      }
    } catch (error) {
      console.error('Error generating positions:', error);
      // Fallback generation
      const fallbackPositions = generateFallbackPositions(topic);
      setGeneratedPositions(fallbackPositions);
      setSelectedPositionPair(0);
      setUserPosition(fallbackPositions[0].position1);
      setAIPosition(fallbackPositions[0].position2);
      setCurrentStep('positions');
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback position generation
  const generateFallbackPositions = (topicText) => {
    const topicLower = topicText.toLowerCase();
    
    // Technology/AI topics
    if (topicLower.includes('technology') || topicLower.includes('ai') || topicLower.includes('digital') || topicLower.includes('automation')) {
      return [
        {
          position1: 'Technology advancement significantly benefits society and should be accelerated',
          position2: 'Rapid technological advancement poses serious risks and should be carefully regulated',
          type: 'Pro vs Cautious'
        },
        {
          position1: 'AI and automation will create more jobs than they eliminate',
          position2: 'AI and automation will lead to widespread unemployment and inequality',
          type: 'Optimistic vs Pessimistic'
        },
        {
          position1: 'Technology companies should have freedom to innovate without heavy regulation',
          position2: 'Technology companies need strict oversight to protect public interests',
          type: 'Free Market vs Regulation'
        }
      ];
    }
    
    // Environment/Climate topics
    if (topicLower.includes('environment') || topicLower.includes('climate') || topicLower.includes('green') || topicLower.includes('carbon')) {
      return [
        {
          position1: 'Environmental protection should be the top global priority, even at economic cost',
          position2: 'Economic stability must be maintained while pursuing environmental goals gradually',
          type: 'Environmental Priority vs Economic Balance'
        },
        {
          position1: 'Individual actions and lifestyle changes are key to solving climate change',
          position2: 'Systemic changes and government policies are more important than individual actions',
          type: 'Individual vs Systemic'
        },
        {
          position1: 'Renewable energy transition should happen as quickly as possible',
          position2: 'Energy transition needs to be gradual to avoid economic disruption',
          type: 'Rapid vs Gradual Transition'
        }
      ];
    }
    
    // Education topics
    if (topicLower.includes('education') || topicLower.includes('school') || topicLower.includes('learning') || topicLower.includes('university')) {
      return [
        {
          position1: 'Traditional classroom education provides the best learning outcomes',
          position2: 'Online and personalized learning approaches are more effective than traditional methods',
          type: 'Traditional vs Modern'
        },
        {
          position1: 'Higher education should be free and accessible to all qualified students',
          position2: 'Market-based education systems drive quality and innovation more effectively',
          type: 'Free Access vs Market-Based'
        },
        {
          position1: 'Standardized testing is essential for measuring educational progress',
          position2: 'Alternative assessment methods better capture student learning and potential',
          type: 'Standardized vs Alternative Assessment'
        }
      ];
    }
    
    // Social Media topics
    if (topicLower.includes('social media') || topicLower.includes('internet') || topicLower.includes('platform') || topicLower.includes('online')) {
      return [
        {
          position1: 'Social media platforms have a net positive impact on society and communication',
          position2: 'Social media platforms cause more harm than good to society and mental health',
          type: 'Positive vs Negative Impact'
        },
        {
          position1: 'Content moderation should prioritize free speech over safety concerns',
          position2: 'Platform safety should take precedence over unrestricted free speech',
          type: 'Free Speech vs Safety'
        },
        {
          position1: 'Social media algorithms improve user experience and content discovery',
          position2: 'Algorithmic content curation creates echo chambers and polarization',
          type: 'Algorithmic Benefits vs Risks'
        }
      ];
    }
    
    // Default generic positions
    return [
      {
        position1: `The benefits and positive aspects of ${topicText} outweigh any potential drawbacks`,
        position2: `The risks and negative consequences of ${topicText} are more significant than any benefits`,
        type: 'Benefits vs Risks'
      },
      {
        position1: `${topicText} should be actively promoted and supported by society`,
        position2: `${topicText} should be approached with caution and careful regulation`,
        type: 'Support vs Caution'
      },
      {
        position1: `Current approaches to ${topicText} are effective and should be maintained`,
        position2: `Fundamental changes are needed in how we handle ${topicText}`,
        type: 'Status Quo vs Reform'
      }
    ];
  };

  // Handle position pair selection
  const selectPositionPair = (index) => {
    setSelectedPositionPair(index);
    setUserPosition(generatedPositions[index].position1);
    setAIPosition(generatedPositions[index].position2);
  };

  // Swap positions
  const swapPositions = () => {
    const temp = userPosition;
    setUserPosition(aiPosition);
    setAIPosition(temp);
  };

  // Create debate
  const createDebate = async () => {
    if (!topic.trim() || !userPosition.trim() || !aiPosition.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai-debate/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          userPosition: userPosition.trim(),
          aiPosition: aiPosition.trim(),
          newsId: newsId || null
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setDebateRoom(data.debate);
        setMessages([data.debate.openingMessage]);
        setCurrentStep('debate');
      } else {
        setError(data.error || 'Failed to create debate');
      }
    } catch (error) {
      console.error('Error creating debate:', error);
      setError('Failed to create debate');
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !debateRoom || sendingMessageRef.current) return;

    sendingMessageRef.current = true;
    const messageContent = newMessage.trim();
    
    // Clear input immediately
    setNewMessage('');
    setCharacterCount(0);
    setError('');

    try {
      const response = await fetch(`/api/ai-debate/${debateRoom.id}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Add both user message and AI response
        setMessages(prev => [...prev, data.userMessage, data.aiResponse]);
        
        // Update debate room with new conversation count
        setDebateRoom(prev => ({
          ...prev,
          conversation_count: data.conversationTurn
        }));

        // Check if debate is completed
        if (data.debateCompleted) {
          setReport(data.report);
          setCurrentStep('report');
        }
      } else {
        setError(data.error || 'Failed to send message');
        // Restore message on error
        setNewMessage(messageContent);
        setCharacterCount(messageContent.length);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      setNewMessage(messageContent);
      setCharacterCount(messageContent.length);
    } finally {
      sendingMessageRef.current = false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden"
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  AI Debate Arena
                  <Crown className="w-5 h-5 text-yellow-300" />
                </h3>
                <p className="text-purple-100 text-sm">Elite Feature - One-on-One AI Debate</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Topic Selection */}
            {currentStep === 'topic' && (
              <motion.div
                key="topic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 min-h-full flex flex-col"
              >
                <div className="text-center mb-6">
                  <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Debate Topic</h4>
                  <p className="text-gray-600">What would you like to debate about?</p>
                </div>

                {newsTitle && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-blue-800 text-sm font-medium">Suggested topic from current news:</p>
                    <p className="text-blue-900 font-semibold">{newsTitle}</p>
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Debate Topic
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter a topic you'd like to debate about..."
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={generatePositions}
                    disabled={!topic.trim() || isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Positions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Debate Positions
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Position Selection */}
            {currentStep === 'positions' && (
              <motion.div
                key="positions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 min-h-full flex flex-col"
              >
                <div className="text-center mb-6">
                  <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Position</h4>
                  <p className="text-gray-600">Pick which side you want to argue for</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h5 className="font-semibold text-gray-900 mb-2">Topic:</h5>
                  <p className="text-gray-700">{topic}</p>
                </div>

                {/* Position Options */}
                {generatedPositions.length > 1 && (
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Choose a debate framework:</h5>
                    <div className="space-y-3">
                      {generatedPositions.map((positionPair, index) => (
                        <motion.button
                          key={index}
                          onClick={() => selectPositionPair(index)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            selectedPositionPair === index
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-purple-700">{positionPair.type}</span>
                            {selectedPositionPair === index && (
                              <CheckCircle className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <span className="font-medium text-blue-800">Position A:</span>
                              <p className="text-blue-700 mt-1">{positionPair.position1}</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <span className="font-medium text-orange-800">Position B:</span>
                              <p className="text-orange-700 mt-1">{positionPair.position2}</p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Positions Display */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <motion.div className="p-6 rounded-xl border-2 border-purple-500 bg-purple-50">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="font-bold text-gray-900">Your Position</p>
                        <p className="text-sm text-gray-600">You will argue for this side</p>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium">{userPosition}</p>
                  </motion.div>

                  <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <Bot className="w-8 h-8 text-indigo-600" />
                      <div>
                        <p className="font-bold text-gray-900">AI Position</p>
                        <p className="text-sm text-gray-600">AI will argue for this side</p>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium">{aiPosition}</p>
                  </div>
                </div>

                {/* Swap positions button */}
                <div className="text-center mb-6">
                  <button
                    onClick={swapPositions}
                    className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Shuffle className="w-4 h-4" />
                    Swap Positions
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-blue-800 font-medium text-sm">Debate Rules</p>
                      <p className="text-blue-700 text-sm mt-1">
                        • You'll have 7 message turns to present your arguments<br/>
                        • Maximum 500 characters per message<br/>
                        • AI will start the debate with an opening statement<br/>
                        • You'll receive a detailed analysis report at the end
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => setCurrentStep('topic')}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={createDebate}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Starting Debate...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Start Debate
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Debate Interface */}
            {currentStep === 'debate' && (
              <motion.div
                key="debate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                {/* Debate Header */}
                <div className="border-b border-gray-200 p-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 truncate">{debateRoom?.topic}</h4>
                    <div className="text-sm text-gray-600 flex-shrink-0">
                      Turn {debateRoom?.conversation_count || 0}/7
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">You:</span>
                        <span className="text-gray-600 ml-1">{debateRoom?.user_position}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bot className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">AI:</span>
                        <span className="text-gray-600 ml-1">{debateRoom?.ai_position}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                            <span className="font-medium text-sm">
                              {message.sender === 'user' ? 'You' : 'AI Debater'}
                            </span>
                            <span className="text-xs opacity-75">
                              Turn {message.conversation_turn}
                            </span>
                          </div>
                          <p className="leading-relaxed">{message.content}</p>
                          <div className="text-xs opacity-75 mt-2">
                            {message.character_count} characters
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input - Fixed */}
                {debateRoom?.status === 'active' && debateRoom?.conversation_count < 7 && (
                  <div className="border-t border-gray-200 p-4 flex-shrink-0">
                    {error && (
                      <div className="text-red-600 text-sm flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea
                          value={newMessage}
                          onChange={handleMessageChange}
                          placeholder="Present your argument..."
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none pr-16"
                          rows="3"
                          maxLength={maxCharacters}
                        />
                        <div className={`absolute bottom-3 right-3 text-xs font-medium ${
                          characterCount > maxCharacters * 0.9 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {characterCount}/{maxCharacters}
                        </div>
                      </div>
                      
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sendingMessageRef.current}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Argument
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Report */}
            {currentStep === 'report' && report && (
              <motion.div
                key="report"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Debate Complete!</h4>
                  <p className="text-gray-600">Here's your performance analysis</p>
                </div>

                {/* Winner Announcement */}
                {report.winner && (
                  <div className={`rounded-xl p-6 mb-6 text-center ${
                    report.winner === 'user' 
                      ? 'bg-green-50 border border-green-200' 
                      : report.winner === 'ai'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <Award className={`w-12 h-12 mx-auto mb-3 ${
                      report.winner === 'user' ? 'text-green-600' :
                      report.winner === 'ai' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <h5 className={`text-lg font-bold ${
                      report.winner === 'user' ? 'text-green-900' :
                      report.winner === 'ai' ? 'text-red-900' : 'text-blue-900'
                    }`}>
                      {report.winner === 'user' ? 'Congratulations! You Won!' :
                       report.winner === 'ai' ? 'AI Won This Round' : 'It\'s a Tie!'}
                    </h5>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Overall Analysis */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h5 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Overall Analysis
                    </h5>
                    <p className="text-blue-800 leading-relaxed">{report.overall_analysis}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h5 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5" />
                        Strengths
                      </h5>
                      <p className="text-green-800 leading-relaxed">{report.strengths}</p>
                    </div>

                    {/* Improvements */}
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <h5 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Areas for Improvement
                      </h5>
                      <p className="text-orange-800 leading-relaxed">{report.improvements}</p>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h5 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Key Insights
                    </h5>
                    <p className="text-purple-800 leading-relaxed">{report.insights}</p>
                  </div>

                  {/* Scores */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h5 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance Scores
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Argument Quality', score: report.argument_quality_score, icon: Brain },
                        { label: 'Persuasiveness', score: report.persuasiveness_score, icon: Target },
                        { label: 'Factual Accuracy', score: report.factual_accuracy_score, icon: CheckCircle },
                        { label: 'Logic', score: report.logical_consistency_score, icon: Lightbulb }
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <item.icon className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-slate-900 mb-1">
                            {item.score}/10
                          </div>
                          <div className="text-sm text-slate-600">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold"
                >
                  Close Debate
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AIDebateModal;