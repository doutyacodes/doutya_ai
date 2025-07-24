import React, { useState, useEffect } from "react";
import { X, MessageCircle, Loader2, Crown, ArrowRight, ChevronRight, CheckCircle, Brain, Users, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const AIDebateModal = ({ isOpen, onClose, newsId, newsTitle }) => {
  const [step, setStep] = useState("select"); // select, setup, debate, mcq, report
  const [debateType, setDebateType] = useState("user_vs_ai");
  const [topic, setTopic] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [aiPosition, setAiPosition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Debate state
  const [debateRoom, setDebateRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [conversationIndex, setConversationIndex] = useState(0);
  const [isDebateCompleted, setIsDebateCompleted] = useState(false);
  const [report, setReport] = useState(null);
  
  // AI vs AI state
  const [aiConversations, setAiConversations] = useState([]);
  const [visibleConversations, setVisibleConversations] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  
  // MCQ state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [mcqHistory, setMcqHistory] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);

  const debateTypes = [
    {
      id: "user_vs_ai",
      title: "Debate with AI",
      description: "Engage in a structured debate with AI taking an opposing view",
      icon: MessageCircle,
      color: "purple",
      available: true,
    },
    {
      id: "ai_vs_ai",
      title: "Watch AI vs AI",
      description: "Watch two AIs debate each other on the topic",
      icon: Users,
      color: "blue",
      available: !!newsId, // Only available when newsId is provided
    },
    {
      id: "mcq",
      title: "MCQ Challenge",
      description: "Navigate through an interactive debate decision tree",
      icon: HelpCircle,
      color: "green",
      available: !!newsId, // Only available when newsId is provided
    }
  ];

  // Initialize topic from news if provided
  useEffect(() => {
    if (newsTitle && isOpen) {
      setTopic(`Discussion about: ${newsTitle}`);
    }
  }, [newsTitle, isOpen]);

  const handleReset = () => {
    setStep("select");
    setDebateType("user_vs_ai");
    setTopic(newsTitle ? `Discussion about: ${newsTitle}` : "");
    setUserPosition("");
    setAiPosition("");
    setError("");
    setDebateRoom(null);
    setMessages([]);
    setUserMessage("");
    setConversationIndex(0);
    setIsDebateCompleted(false);
    setReport(null);
    setAiConversations([]);
    setVisibleConversations([]);
    setCurrentRound(0);
    setCurrentQuestion(null);
    setMcqHistory([]);
    setCurrentLevel(1);
  };

  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  };

  const createDebate = async () => {
    if (debateType === "user_vs_ai") {
      if (!topic.trim() || !userPosition.trim() || !aiPosition.trim()) {
        setError("Please enter topic and both positions");
        return;
      }
    }

    setIsLoading(true);
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
          newsId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDebateRoom(data.debate);
        
        if (debateType === "user_vs_ai") {
          setMessages(data.messages || []);
          setStep("debate");
        } else if (debateType === "ai_vs_ai") {
          setAiConversations(data.conversations || []);
          setVisibleConversations([]);
          setCurrentRound(0);
          setStep("debate");
        } else if (debateType === "mcq") {
          setCurrentQuestion(data.currentQuestion);
          setCurrentLevel(1);
          setMcqHistory([]);
          setStep("mcq");
        }
      } else {
        throw new Error(data.error || "Failed to create debate");
      }
    } catch (err) {
      console.error("Error creating debate:", err);
      setError(err.message || "Failed to create debate. Please try again.");
      toast.error("Failed to create debate");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const showNextAIConversation = async () => {
    if (currentRound >= aiConversations.length) return;

    setIsLoading(true);

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
        
        // Add the conversations for this round to visible list
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
      setIsLoading(false);
    }
  };

  const submitMcqAnswer = async (selectedOption) => {
    setIsLoading(true);

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
        // Add current question and answer to history
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
      setIsLoading(false);
    }
  };

  const renderSelectType = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Debate Type</h3>
        <p className="text-gray-600">Select how you&apos;d like to engage with AI</p>
      </div>

      <div className="space-y-4">
        {debateTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => type.available && setDebateType(type.id)}
            disabled={!type.available}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              !type.available 
                ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                : debateType === type.id
                ? `border-${type.color}-500 bg-${type.color}-50`
                : "border-gray-200 hover:border-gray-300"
            }`}
            whileHover={type.available ? { scale: 1.02 } : {}}
            whileTap={type.available ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-${type.color}-100 flex items-center justify-center ${!type.available ? 'opacity-50' : ''}`}>
                <type.icon className={`w-6 h-6 text-${type.color}-600`} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-gray-900">{type.title}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
                {!type.available && (
                  <p className="text-xs text-red-500 mt-1">Requires news article context</p>
                )}
              </div>
              {type.available && debateType === type.id && (
                <CheckCircle className={`w-6 h-6 text-${type.color}-600 ml-auto`} />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep("setup")}
          disabled={!debateTypes.find(t => t.id === debateType)?.available}
          className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Setup Your {debateTypes.find(t => t.id === debateType)?.title}
        </h3>
        <p className="text-gray-600">Configure the debate parameters</p>
      </div>

      <div className="space-y-4">
        {debateType === "user_vs_ai" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the debate topic..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                rows={3}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Position
              </label>
              <input
                type="text"
                value={userPosition}
                onChange={(e) => setUserPosition(e.target.value)}
                placeholder="e.g., I support this because..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Position
              </label>
              <input
                type="text"
                value={aiPosition}
                onChange={(e) => setAiPosition(e.target.value)}
                placeholder="e.g., I oppose this because..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                maxLength={200}
              />
            </div>
          </>
        )}

        {debateType === "ai_vs_ai" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">AI vs AI Debate</h4>
            <p className="text-sm text-blue-700">
              Watch a pre-generated debate between two AI personas on {`"${newsTitle}"`}. 
              You&apos;ll observe different perspectives and argumentation techniques.
            </p>
          </div>
        )}

        {debateType === "mcq" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">MCQ Challenge Mode</h4>
            <p className="text-sm text-green-700">
              Navigate through an interactive debate about {`"${newsTitle}"`}. 
              You&apos;ll make choices that shape the conversation and explore different viewpoints.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setStep("select")}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={createDebate}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Start Debate
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderDebate = () => (
    <div className="flex flex-col h-96">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">{debateRoom?.topic}</h3>
        <p className="text-sm text-gray-600">
          {debateType === "ai_vs_ai" 
            ? `Round ${currentRound} of ${Math.max(...(visibleConversations.length > 0 ? visibleConversations.map(c => c.conversation_round) : [0]))}`
            : `Message ${messages.length} of ${debateRoom?.max_conversations * 2 || 14}`
          }
        </p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {debateType === "ai_vs_ai" ? (
          // AI vs AI: Show each message individually
          visibleConversations.map((message, index) => (
            <div
              key={message.id || `${message.conversation_round}-${index}`}
              className={`flex ${
                message.sender === "ai_1" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "ai_1"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-green-100 text-green-900"
                }`}
              >
                <div className="font-semibold text-xs mb-1">
                  { (message.sender === "ai_1" ? "AI 1" : "AI 2")}
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          // User vs AI: Show all messages
          messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input/Actions */}
      <div className="p-4 border-t">
        {debateType === "ai_vs_ai" ? (
          currentRound < Math.max(...(aiConversations.length > 0 ? aiConversations.map(c => c.conversation_round) : [0])) ? (
            <button
              onClick={showNextAIConversation}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Show Next Round
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-3">Debate completed!</p>
              <button
                onClick={() => setStep("report")}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                View Report
              </button>
            </div>
          )
        ) : (
          !isDebateCompleted && (
            <div className="flex gap-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your response..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={500}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!userMessage.trim() || isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
              </button>
            </div>
          )
        )}
      </div>
    </div>
);

  const renderMcq = () => (
    <div className="p-6">
      {currentQuestion ? (
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Level {currentLevel} of 5
              </span>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{currentQuestion.ai_persona}</span>
              </div>
              <p className="text-blue-800">{currentQuestion.ai_message}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Choose your response:
              </p>
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => submitMcqAnswer(option)}
                  disabled={isLoading}
                  className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-600">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-gray-900">{option.option_text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600" />
              <p className="text-gray-600 mt-2">Processing your choice...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading debate...</p>
        </div>
      )}
    </div>
  );

  const renderReport = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Debate Report
        </h3>
        <p className="text-gray-600">Here&apos;s your performance analysis</p>
      </div>

      {report && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Overall Analysis</h4>
            <p className="text-purple-800 text-sm">{report.overall_analysis}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
              <p className="text-green-800 text-sm">{report.strengths}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Improvements</h4>
              <p className="text-blue-800 text-sm">{report.improvements}</p>
            </div>
          </div>

          {report.winner && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Result</h4>
              <p className="text-yellow-800 text-sm">
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

          {/* MCQ specific metrics */}
          {debateType === "mcq" && report.choice_count && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">MCQ Summary</h4>
              <p className="text-indigo-800 text-sm">
                You made {report.choice_count} decisions navigating through the debate tree.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          New Debate
        </button>
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Debate</h3>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-500">Elite Feature</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto">
            {step === "select" && renderSelectType()}
            {step === "setup" && renderSetup()}
            {step === "debate" && renderDebate()}
            {step === "mcq" && renderMcq()}
            {step === "report" && renderReport()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AIDebateModal;