// app/debates/[groupId]/chat/page.jsx
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
  HelpCircle,
  ChevronRight,
  Crown,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const DebateChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const groupId = params.groupId;
  const debateType = searchParams.get('type') || 'user_vs_ai';
  
  const [step, setStep] = useState('setup'); // setup, chat, report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Setup state
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [aiPosition, setAiPosition] = useState('');
  
  // Chat state
  const [debateRoom, setDebateRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isDebateCompleted, setIsDebateCompleted] = useState(false);
  const [report, setReport] = useState(null);
  const [debateInfo, setDebateInfo] = useState(null); // Add debate info state
  
  // AI vs AI state
  const [aiConversations, setAiConversations] = useState([]);
  const [visibleConversations, setVisibleConversations] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  
  // MCQ state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [mcqHistory, setMcqHistory] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    // Set default topic and fetch debate info
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
        
        // Set default positions if available
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
          color: 'purple',
          description: 'Engage in a structured debate with AI taking an opposing view'
        };
      case 'ai_vs_ai':
        return {
          title: 'Watch AI vs AI',
          icon: Users,
          color: 'blue',
          description: 'Watch two AIs debate each other on the topic'
        };
      case 'mcq':
        return {
          title: 'MCQ Challenge',
          icon: HelpCircle,
          color: 'green',
          description: 'Navigate through an interactive debate decision tree'
        };
      default:
        return {
          title: 'AI Debate',
          icon: Brain,
          color: 'gray',
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
      const response = await fetch("/api/ai-debate/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          debateType,
          userPosition: userPosition.trim() || null,
          aiPosition: aiPosition.trim() || null,
          groupId: groupId, // Use groupId instead of newsId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDebateRoom(data.debate);
        
        if (debateType === "user_vs_ai") {
          setMessages(data.messages || []);
          setStep("chat");
        } else if (debateType === "ai_vs_ai") {
          setAiConversations(data.conversations || []);
          setVisibleConversations([]);
          setCurrentRound(0); // Start at 0, will increment to 1 when first round is shown
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
      setUserMessage(messageText); // Restore message
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

  const renderSetup = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${typeInfo.color}-100 flex items-center justify-center`}>
              <TypeIcon className={`w-8 h-8 text-${typeInfo.color}-600`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{typeInfo.title}</h2>
            <p className="text-gray-600">{typeInfo.description}</p>
          </div>

          {debateType === "user_vs_ai" && (
            <div className="space-y-6">
              {/* Show debate positions if available */}
              {debateInfo && (debateInfo.forPosition || debateInfo.againstPosition) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-3">Available Debate Positions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {debateInfo.forPosition && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="font-medium text-green-900 text-sm">FOR: {debateInfo.forPosition.title}</p>
                        <p className="text-green-600 text-xs">Persona: {debateInfo.forPosition.persona}</p>
                      </div>
                    )}
                    {debateInfo.againstPosition && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <p className="font-medium text-red-900 text-sm">AGAINST: {debateInfo.againstPosition.title}</p>
                        <p className="text-red-600 text-xs">Persona: {debateInfo.againstPosition.persona}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Debate Topic
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter the debate topic..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Position
                  {debateInfo?.againstPosition && (
                    <span className="text-xs text-gray-500 ml-2">
                      (You can oppose: {debateInfo.againstPosition.title})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={userPosition}
                  onChange={(e) => setUserPosition(e.target.value)}
                  placeholder="e.g., I support this because..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Position
                  {debateInfo?.forPosition && (
                    <span className="text-xs text-gray-500 ml-2">
                      (AI will argue for: {debateInfo.forPosition.title})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={aiPosition}
                  onChange={(e) => setAiPosition(e.target.value)}
                  placeholder="e.g., I oppose this because..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  maxLength={200}
                />
              </div>
            </div>
          )}

          {debateType === "ai_vs_ai" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-medium text-blue-900 mb-2">AI vs AI Debate</h4>
              <p className="text-sm text-blue-700 mb-4">
                Watch a pre-generated debate between two AI personas on this news topic. 
                You'll observe different perspectives and argumentation techniques.
              </p>
              
              {debateInfo && (debateInfo.forPosition || debateInfo.againstPosition) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {debateInfo.forPosition && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="font-medium text-green-900 text-sm">AI 1 (FOR)</p>
                      <p className="text-green-800 text-xs">{debateInfo.forPosition.title}</p>
                      <p className="text-green-600 text-xs">Persona: {debateInfo.forPosition.persona}</p>
                    </div>
                  )}
                  {debateInfo.againstPosition && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="font-medium text-red-900 text-sm">AI 2 (AGAINST)</p>
                      <p className="text-red-800 text-xs">{debateInfo.againstPosition.title}</p>
                      <p className="text-red-600 text-xs">Persona: {debateInfo.againstPosition.persona}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {debateType === "mcq" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-medium text-green-900 mb-2">MCQ Challenge Mode</h4>
              <p className="text-sm text-green-700 mb-4">
                Navigate through an interactive debate about this news topic. 
                You'll make choices that shape the conversation and explore different viewpoints.
              </p>
              
              {debateInfo && (debateInfo.forPosition || debateInfo.againstPosition) && (
                <div className="bg-white border border-green-300 rounded p-3 mt-4">
                  <p className="font-medium text-green-900 text-sm mb-2">Debate Positions You'll Explore:</p>
                  <div className="space-y-1">
                    {debateInfo.forPosition && (
                      <p className="text-green-800 text-xs">• FOR: {debateInfo.forPosition.title}</p>
                    )}
                    {debateInfo.againstPosition && (
                      <p className="text-green-800 text-xs">• AGAINST: {debateInfo.againstPosition.title}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push(`/debates/${groupId}`)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={createDebate}
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-${typeInfo.color}-600 text-white rounded-lg font-medium hover:bg-${typeInfo.color}-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Start Debate
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{debateRoom?.topic}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {debateType === "ai_vs_ai" 
                  ? `Round ${currentRound} of ${Math.max(...(aiConversations.length > 0 ? aiConversations.map(c => c.conversation_round) : [1]))}`
                  : debateType === "mcq"
                  ? `Round ${currentLevel} of 5`
                  : `Message ${messages.length} of ${debateRoom?.max_conversations * 2 || 14}`
                }
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-700`}>
              {typeInfo.title}
            </div>
          </div>
        </div>

        {/* Messages/Content Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {debateType === "mcq" ? renderMCQContent() : renderMessageContent()}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t bg-gray-50">
          {renderInputArea()}
        </div>
      </div>
    </div>
  );

  const renderMessageContent = () => {
    if (debateType === "ai_vs_ai") {
      return (
        <div className="space-y-4">
          {/* Topic Display for AI vs AI */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-1">Debate Topic:</h4>
            <p className="text-blue-700 text-sm">{debateRoom?.topic}</p>
          </div>

          {/* Conversations */}
          {visibleConversations.map((message, index) => (
            <div
              key={message.id || `${message.conversation_round}-${index}`}
              className={`flex ${message.sender === "ai_1" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender === "ai_1"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-green-100 text-green-900"
                }`}
              >
                <div className="font-semibold text-xs mb-1">
                  {message.sender === "ai_1" ? "AI 1" : "AI 2"}
                  {message.ai_persona && ` (${message.ai_persona})`}
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}

          {visibleConversations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click "Show Next Round" to begin watching the AI debate</p>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          {/* Topic Display for User vs AI */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-1">Debate Topic:</h4>
            <p className="text-purple-700 text-sm">{debateRoom?.topic}</p>
          </div>

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const renderMCQContent = () => {
    if (!currentQuestion) {
      return (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading question...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Topic Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-1">Debate Topic:</h4>
          <p className="text-gray-700 text-sm">{debateRoom?.topic}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">Round {currentLevel} of 5</span>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < currentLevel ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* AI Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">{currentQuestion.ai_persona}</span>
          </div>
          <p className="text-green-800 leading-relaxed">{currentQuestion.ai_message}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <p className="font-medium text-gray-700 mb-4">Choose your response:</p>
          {currentQuestion.options?.map((option, index) => (
            <button
              key={option.id}
              onClick={() => submitMcqAnswer(option)}
              disabled={loading}
              className={`w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                option.option_position === 'for' ? 'hover:border-green-400 hover:bg-green-50' :
                option.option_position === 'against' ? 'hover:border-red-400 hover:bg-red-50' :
                'hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="font-semibold text-gray-600 mt-1">
                  {String.fromCharCode(65 + index)}.
                </span>
                <div className="flex-1">
                  <span className="text-gray-900 leading-relaxed">{option.option_text}</span>
                  {option.option_position && (
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        option.option_position === 'for' ? 'bg-green-100 text-green-700' :
                        option.option_position === 'against' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {option.option_position.toUpperCase()} Position
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderInputArea = () => {
    if (debateType === "mcq") {
      return loading ? (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
          <p className="text-gray-600 mt-2">Processing your choice...</p>
        </div>
      ) : null;
    }

    if (debateType === "ai_vs_ai") {
      const maxRounds = Math.max(...(aiConversations.length > 0 ? aiConversations.map(c => c.conversation_round) : [1]));
      return currentRound < maxRounds ? (
        <button
          onClick={showNextAIConversation}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Show Next Round ({currentRound + 1} of {maxRounds})
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">All rounds completed! ({maxRounds} rounds total)</p>
          <button
            onClick={() => setStep("report")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            View Report
          </button>
        </div>
      );
    }

    return !isDebateCompleted ? (
      <div className="flex gap-3">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your response..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          maxLength={500}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={!userMessage.trim() || loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    ) : null;
  };

  const renderReport = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Debate Report</h2>
            <p className="text-gray-600">Here's your performance analysis</p>
          </div>

          {report && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-3">Overall Analysis</h4>
                <p className="text-purple-800 leading-relaxed">{report.overall_analysis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-900 mb-3">Strengths</h4>
                  <p className="text-green-800 leading-relaxed">{report.strengths}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Improvements</h4>
                  <p className="text-blue-800 leading-relaxed">{report.improvements}</p>
                </div>
              </div>

              {report.insights && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-900 mb-3">Insights</h4>
                  <p className="text-yellow-800 leading-relaxed">{report.insights}</p>
                </div>
              )}

              {report.winner && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h4 className="font-semibold text-indigo-900 mb-3">Result</h4>
                  <p className="text-indigo-800">
                    Winner: {
                      report.winner === "user" ? "You" : 
                      report.winner === "tie" ? "Tie" : 
                      report.winner === "ai_1" ? "AI Position 1" :
                      report.winner === "ai_2" ? "AI Position 2" :
                      "AI"
                    }
                  </p>
                </div>
              )}

              {debateType === "mcq" && report.choice_count && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">MCQ Summary</h4>
                  <p className="text-gray-800">
                    You made {report.choice_count} decisions navigating through the debate tree.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push(`/debates/${groupId}/chat?type=${debateType}`)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              New Debate
            </button>
            <button
              onClick={() => router.push(`/debates/${groupId}`)}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Back to Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/debates/${groupId}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Group</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <TypeIcon className={`w-6 h-6 text-${typeInfo.color}-600`} />
                <h1 className="text-xl font-semibold text-gray-900">{typeInfo.title}</h1>
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Group {groupId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          
          {step === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderChat()}
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
    </div>
  );
};

export default DebateChatPage;