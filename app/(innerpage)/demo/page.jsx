"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Eye,
  Plus,
  X,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  Clock,
  Heart,
  ChevronRight,
  Loader2,
  Info,
  Star,
  Target,
  TrendingUp,
  Users,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Toast from "@/components/Toast";


// Modal component moved outside and memoized to prevent re-creation
const CustomViewpointModal = React.memo(({ 
  showModal, 
  customViewpoint, 
  onViewpointChange, 
  onClose, 
  onGenerate, 
  isGenerating, 
  generatedCount 
}) => {
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (showModal && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] transition-all duration-300">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 w-full max-w-lg mx-auto shadow-2xl transform transition-all duration-300 border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Generate Demo Perspective
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Create a unique AI-generated viewpoint on the climate summit story. 
              Our advanced AI will analyze the topic from your specified perspective.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter your viewpoint:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={customViewpoint}
                onChange={onViewpointChange}
                placeholder="e.g., Small Business Owner, Student Leader, Tech Entrepreneur..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                maxLength={50}
                disabled={isGenerating}
                autoComplete="off"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {customViewpoint.length}/50 characters
                </p>
                {customViewpoint.trim() && (
                  <div className="text-xs text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    Ready to generate
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-medium mb-1">
                    Demo Limitation
                  </p>
                  <p className="text-xs text-red-700">
                    You can generate {2 - generatedCount} more perspective
                    {2 - generatedCount !== 1 ? "s" : ""}
                    {generatedCount > 0 && ` (${generatedCount}/2 used)`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <motion.button
              onClick={onGenerate}
              disabled={isGenerating || !customViewpoint.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Generate Perspective
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

const DemoPage = () => {
  const [currentPerspective, setCurrentPerspective] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showViewpointModal, setShowViewpointModal] = useState(false);
  const [customViewpoint, setCustomViewpoint] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [toast, setToast] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Toast helper - memoized to prevent re-creation
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  // Base perspectives - moved to state to prevent re-creation
  const basePerspectives = useMemo(() => [
    {
      viewpoint: "Environmental Activist",
      title: "Climate Summit Breakthrough: Historic Carbon Reduction Targets Set Global Standard",
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      description:
        "Environmental groups worldwide are celebrating what they're calling the most significant climate agreement in decades. The summit's comprehensive framework includes binding emission reduction targets of 45% by 2030, unprecedented funding for renewable energy infrastructure, and strict accountability mechanisms for participating nations.\n\nKey achievements include the establishment of a $500 billion Global Climate Fund, mandatory carbon pricing across G20 nations, and innovative carbon capture technology sharing agreements. Environmental scientists emphasize that these measures could limit global warming to 1.5°C if implemented effectively.\n\nDr. Sarah Chen, lead climate researcher at MIT, states: 'This agreement represents the political will we've been waiting for. The binding nature of these commitments, combined with robust verification systems, gives us genuine hope for meaningful climate action.'\n\nThe agreement also includes provisions for protecting biodiversity hotspots, transitioning away from fossil fuel subsidies, and supporting climate adaptation in vulnerable communities. Critics argue the timeline is still too conservative, but most environmental advocates view this as a crucial step forward in the global fight against climate change.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tag: "Environment",
      isTest: false,
    },
    {
      viewpoint: "Economic Policy Expert",
      title: "Climate Summit Agreement: Economic Implications and Market Transformation Opportunities",
      color: "from-red-400 to-red-500",
      textColor: "text-red-500",
      bgColor: "bg-red-50",
      description:
        "Economic analysts are examining the far-reaching implications of the climate summit agreement, with early assessments suggesting a fundamental shift in global economic priorities. The agreement's $500 billion commitment represents the largest coordinated economic intervention since the post-2008 financial recovery packages.\n\nMarket responses have been notably positive, with renewable energy stocks surging 15% globally and green technology firms experiencing unprecedented investment interest. The mandatory carbon pricing mechanism is expected to generate an estimated $2 trillion annually, creating new revenue streams for governments while incentivizing clean technology adoption.\n\nJP Morgan's chief economist, Michael Rodriguez, notes: 'This agreement essentially creates the world's largest new market overnight. The carbon pricing framework will drive innovation, create millions of jobs in emerging sectors, and potentially add 2-3% to global GDP growth over the next decade.'\n\nTraditional energy sectors face significant challenges, with coal and oil companies already announcing major restructuring plans. However, economists emphasize that the transition period includes substantial support for worker retraining and regional economic development, potentially making this the most managed economic transformation in modern history.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tag: "Economics",
      isTest: false,
    },
  ], []);

  const [allPerspectives, setAllPerspectives] = useState(basePerspectives);

  // Stable handlers using useCallback
  const handleModalClose = useCallback(() => {
    if (isGeneratingTest) return;
    setShowViewpointModal(false);
    setCustomViewpoint("");
  }, [isGeneratingTest]);

  const handleBackToHome = useCallback(() => {
    console.log("Navigate to home");
  }, []);

  const handleGetStarted = useCallback(() => {
    console.log("Navigate to news page");
  }, []);

  // Input change handler - stable reference
  const handleViewpointChange = useCallback((e) => {
    setCustomViewpoint(e.target.value);
  }, []);

  // Auto-advance perspectives with proper cleanup
  useEffect(() => {
    if (!isAutoPlaying || allPerspectives.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentPerspective((prev) => (prev + 1) % allPerspectives.length);
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, allPerspectives.length]);

  // Handle modal and body scroll - prevent re-runs
  useEffect(() => {
    if (showViewpointModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showViewpointModal]);

  // Escape key handler - only when modal is open
  useEffect(() => {
    if (!showViewpointModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isGeneratingTest) {
        handleModalClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showViewpointModal, isGeneratingTest, handleModalClose]);

  const handleGenerateClick = useCallback(() => {
    if (generatedCount >= 2) {
      showToast("Demo limit reached! You can generate maximum 2 test perspectives.", 'error');
      return;
    }
    setShowViewpointModal(true);
  }, [generatedCount, showToast]);

  const generateTestPerspective = useCallback(async () => {
    const trimmedViewpoint = customViewpoint.trim();
    if (!trimmedViewpoint) {
      showToast("Please enter a viewpoint", 'error');
      return;
    }

    if (isGeneratingTest) return;

    setIsGeneratingTest(true);

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      const colors = [
        "from-red-600 to-red-700",
        "from-red-500 to-red-600",
        "from-red-400 to-red-500",
        "from-red-700 to-red-800",
      ];

      const textColors = [
        "text-red-700",
        "text-red-600",
        "text-red-500",
        "text-red-800",
      ];

      const newTestPerspective = {
        viewpoint: trimmedViewpoint,
        title: `Climate Summit Analysis: A ${trimmedViewpoint} Perspective on Global Climate Action`,
        color: colors[generatedCount % colors.length],
        textColor: textColors[generatedCount % textColors.length],
        bgColor: "bg-red-50",
        description: `From the perspective of a ${trimmedViewpoint}, the recent climate summit represents a pivotal moment that demands careful analysis. The comprehensive agreement reached by world leaders presents both unprecedented opportunities and significant challenges that will reshape our approach to environmental action.\n\nThe binding emission reduction targets of 45% by 2030 create a framework that directly impacts our community and stakeholders. The $500 billion Global Climate Fund allocation demonstrates the scale of commitment required to address climate change effectively, while the mandatory carbon pricing mechanism across G20 nations will fundamentally alter economic calculations.\n\nAs a ${trimmedViewpoint}, we recognize that this agreement's success depends on practical implementation and sustained political will. The provisions for biodiversity protection, fossil fuel subsidy transitions, and climate adaptation support show a holistic approach to environmental challenges.\n\nMoving forward, our role involves advocating for transparent accountability mechanisms, ensuring equitable resource distribution, and maintaining focus on evidence-based policy implementation. The climate crisis demands collaboration across all sectors, and this agreement provides the foundation for meaningful progress toward a sustainable future.`,
        image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop",
        tag: "AI Generated",
        isTest: true,
      };

      setAllPerspectives((prev) => [...prev, newTestPerspective]);
      setCurrentPerspective(allPerspectives.length);

      const newCount = generatedCount + 1;
      setGeneratedCount(newCount);

      setShowViewpointModal(false);
      setCustomViewpoint("");

      showToast(`Test perspective generated! (${newCount}/2)`, 'success');
    } catch (error) {
      console.error("Error generating test perspective:", error);
      showToast("Failed to generate test perspective", 'error');
    } finally {
      setIsGeneratingTest(false);
    }
  }, [customViewpoint, isGeneratingTest, generatedCount, allPerspectives.length, showToast]);

  const removeTestPerspectives = useCallback(() => {
    setAllPerspectives(basePerspectives);
    setCurrentPerspective(0);
    setGeneratedCount(0);
    showToast("Test perspectives cleared!", 'info');
  }, [basePerspectives, showToast]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-red-100/30">
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-400/10 to-red-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [10, -10, 10],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-red-300/10 to-red-600/10 rounded-full blur-xl"
        />
      </div>

      {/* Custom Modal - using the memoized component */}
      <AnimatePresence>
        {showViewpointModal && (
          <CustomViewpointModal
            showModal={showViewpointModal}
            customViewpoint={customViewpoint}
            onViewpointChange={handleViewpointChange}
            onClose={handleModalClose}
            onGenerate={generateTestPerspective}
            isGenerating={isGeneratingTest}
            generatedCount={generatedCount}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleBackToHome}
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interactive Demo</h1>
                <p className="text-sm text-gray-500">Multi-Perspective Analysis</p>
              </div>
            </div>

            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-lg"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>

      {/* Demo Introduction */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 text-red-700 rounded-full text-sm font-semibold mb-8 shadow-sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            Live Interactive Demo
            <Sparkles className="w-4 h-4 ml-2" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Experience News Through
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Multiple Expert Lenses
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Discover Doutya&apos;s revolutionary multi-perspective analysis. See how the same 
            climate summit story transforms when viewed through different expert viewpoints.
          </p>

          {/* Enhanced Demo Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm mb-16">
            {[
              { icon: Shield, label: "Real AI Analysis", color: "text-green-600" },
              { icon: Brain, label: "Custom Perspectives", color: "text-red-600" },
              { icon: Zap, label: "Interactive Demo", color: "text-blue-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50"
              >
                <div className={`w-2 h-2 ${stat.color.replace('text-', 'bg-')} rounded-full`} />
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="font-medium text-gray-700">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Demo Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden"
        >
          {/* Enhanced Demo Header */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-8 border-b border-red-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Climate Summit Analysis
                </h3>
                <p className="text-gray-600 text-lg">
                  Interactive multi-perspective demonstration
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl transition-all duration-300 border border-white/50"
                >
                  {isAutoPlaying ? (
                    <Pause className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setCurrentPerspective(0)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl transition-all duration-300 border border-white/50"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Enhanced Progress Indicator */}
            <div className="space-y-3">
              <div className="w-full bg-white/50 rounded-full h-3 shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentPerspective + 1) / allPerspectives.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">
                  Perspective {currentPerspective + 1} of {allPerspectives.length}
                </span>
                <span className="text-red-600 font-semibold">
                  {Math.round(((currentPerspective + 1) / allPerspectives.length) * 100)}% Complete
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Enhanced Perspective Selector */}
            <div className="lg:col-span-1">
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Choose Perspective</h4>
              <div className="space-y-4">
                {allPerspectives.map((perspective, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentPerspective(index)}
                    className={`w-full p-5 rounded-2xl text-left transition-all duration-500 ${
                      currentPerspective === index
                        ? `bg-gradient-to-r ${perspective.color} text-white shadow-xl transform scale-105`
                        : "bg-gray-50/70 backdrop-blur-sm hover:bg-white hover:shadow-lg text-gray-700 border border-gray-200/50"
                    }`}
                    whileHover={currentPerspective === index ? {} : { scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold opacity-90 px-2 py-1 bg-white/20 rounded-full">
                        {perspective.tag}
                      </span>
                      {perspective.isTest && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-lg">{perspective.viewpoint}</div>
                  </motion.button>
                ))}

                {/* Enhanced Generate Custom Perspective */}
                <motion.button
                  onClick={handleGenerateClick}
                  disabled={generatedCount >= 2}
                  className={`w-full p-5 rounded-2xl text-left border-2 border-dashed transition-all duration-500 flex items-center justify-between ${
                    generatedCount >= 2
                      ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50/30"
                      : "border-red-300 hover:border-red-400 hover:bg-red-50 bg-white/60 backdrop-blur-sm"
                  }`}
                  whileHover={generatedCount < 2 ? { scale: 1.02, y: -2 } : {}}
                  whileTap={generatedCount < 2 ? { scale: 0.98 } : {}}
                >
                  <div className={`flex items-center ${generatedCount >= 2 ? "text-gray-400" : "text-red-600"}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      generatedCount >= 2 ? "bg-gray-200" : "bg-red-100"
                    }`}>
                      <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block text-lg">
                        {generatedCount >= 2 ? "Demo Limit Reached" : "Generate Custom View"}
                      </span>
                      <span className="text-sm opacity-75">
                        {generatedCount >= 2 ? "(2/2 used)" : `(${generatedCount}/2 used)`}
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Enhanced Clear Test Perspectives */}
                {allPerspectives.length > 2 && (
                  <motion.button
                    onClick={removeTestPerspectives}
                    className="w-full p-5 rounded-2xl text-left border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-between bg-white/60 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center text-red-600">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                        <X className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold block text-lg">Clear AI Perspectives</span>
                        <span className="text-sm opacity-75">Reset to original views</span>
                      </div>
                    </div>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Enhanced Article Display */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPerspective}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {/* Enhanced Article Image */}
                  <div className="relative aspect-[2/1] rounded-3xl overflow-hidden shadow-xl">
                    <img
                      src={allPerspectives[currentPerspective].image}
                      alt={allPerspectives[currentPerspective].viewpoint}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`absolute top-6 left-6 px-5 py-3 bg-gradient-to-r ${allPerspectives[currentPerspective].color} text-white rounded-2xl font-bold flex items-center shadow-lg backdrop-blur-sm`}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      {allPerspectives[currentPerspective].viewpoint} View
                      {allPerspectives[currentPerspective].isTest && (
                        <Sparkles className="w-4 h-4 ml-2" />
                      )}
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight"
                    >
                      {allPerspectives[currentPerspective].title}
                    </motion.h2>

                    {/* Enhanced Article Content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="max-h-72 overflow-y-auto pr-4 bg-gradient-to-b from-gray-50/50 to-white rounded-2xl p-6 border border-gray-100"
                    >
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {allPerspectives[currentPerspective].description}
                      </p>
                    </motion.div>

                    {/* Enhanced Article Meta */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center justify-between pt-6 border-t border-gray-200"
                    >
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl">
                          <Clock className="w-4 h-4 mr-2" />
                          {allPerspectives[currentPerspective].isTest ? "3 min read" : "5 min read"}
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl">
                          <Heart className="w-4 h-4 mr-2" />
                          {allPerspectives[currentPerspective].isTest ? "42" : "1.2k"}
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Trending
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="text-red-600 font-semibold hover:text-red-700 flex items-center text-sm bg-red-50 px-4 py-2 rounded-xl transition-all duration-300"
                      >
                        Read Full Article
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Enhanced Navigation Dots */}
          <div className="flex justify-center space-x-3 pb-8">
            {allPerspectives.map((perspective, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPerspective(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentPerspective === index
                    ? "bg-red-600 w-8 shadow-lg"
                    : "bg-gray-300 w-3 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Demo Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Eye,
              title: "Multiple Expert Viewpoints",
              description: "Every story analyzed through Environmental, Economic, Political, and Social expert frameworks for comprehensive understanding.",
              gradient: "from-red-500 to-red-600",
              delay: 0
            },
            {
              icon: Brain,
              title: "AI-Powered Custom Analysis",
              description: "Generate unique perspectives from any viewpoint using our advanced AI analysis engine trained on expert knowledge.",
              gradient: "from-red-400 to-red-500",
              delay: 0.1
            },
            {
              icon: Target,
              title: "Exam-Focused Insights",
              description: "Every analysis crafted specifically for competitive exam preparation, interview readiness, and academic excellence.",
              gradient: "from-red-600 to-red-700",
              delay: 0.2
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100/50 text-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
              >
                <feature.icon className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-400/5" />
            
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-8"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                This is Just the Beginning
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready for the Complete Experience?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Multi-perspective analysis is just one feature. Discover AI debates, intelligent discussions, 
                exam-specific trending insights, and comprehensive preparation tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                <motion.button
                  onClick={handleBackToHome}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Explore All Features
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPage;