"use client";
import React, { useState, useEffect, useRef } from "react";
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
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DemoPage = () => {
  const router = useRouter();
  const [currentPerspective, setCurrentPerspective] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showViewpointModal, setShowViewpointModal] = useState(false);
  const [customViewpoint, setCustomViewpoint] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  // Base perspectives
  const basePerspectives = [
    {
      viewpoint: "Environmental Activist",
      title: "Climate Summit Breakthrough: Historic Carbon Reduction Targets Set Global Standard",
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Environmental groups worldwide are celebrating what they're calling the most significant climate agreement in decades. The summit's comprehensive framework includes binding emission reduction targets of 45% by 2030, unprecedented funding for renewable energy infrastructure, and strict accountability mechanisms for participating nations.\n\nKey achievements include the establishment of a $500 billion Global Climate Fund, mandatory carbon pricing across G20 nations, and innovative carbon capture technology sharing agreements. Environmental scientists emphasize that these measures could limit global warming to 1.5°C if implemented effectively.\n\nDr. Sarah Chen, lead climate researcher at MIT, states: 'This agreement represents the political will we've been waiting for. The binding nature of these commitments, combined with robust verification systems, gives us genuine hope for meaningful climate action.'\n\nThe agreement also includes provisions for protecting biodiversity hotspots, transitioning away from fossil fuel subsidies, and supporting climate adaptation in vulnerable communities. Critics argue the timeline is still too conservative, but most environmental advocates view this as a crucial step forward in the global fight against climate change.",
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tag: "Environment",
      isTest: false,
    },
    {
      viewpoint: "Economic Policy Expert",
      title: "Climate Summit Agreement: Economic Implications and Market Transformation Opportunities",
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Economic analysts are examining the far-reaching implications of the climate summit agreement, with early assessments suggesting a fundamental shift in global economic priorities. The agreement's $500 billion commitment represents the largest coordinated economic intervention since the post-2008 financial recovery packages.\n\nMarket responses have been notably positive, with renewable energy stocks surging 15% globally and green technology firms experiencing unprecedented investment interest. The mandatory carbon pricing mechanism is expected to generate an estimated $2 trillion annually, creating new revenue streams for governments while incentivizing clean technology adoption.\n\nJP Morgan's chief economist, Michael Rodriguez, notes: 'This agreement essentially creates the world's largest new market overnight. The carbon pricing framework will drive innovation, create millions of jobs in emerging sectors, and potentially add 2-3% to global GDP growth over the next decade.'\n\nTraditional energy sectors face significant challenges, with coal and oil companies already announcing major restructuring plans. However, economists emphasize that the transition period includes substantial support for worker retraining and regional economic development, potentially making this the most managed economic transformation in modern history.",
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tag: "Economics",
      isTest: false,
    },
  ];

  const [allPerspectives, setAllPerspectives] = useState(basePerspectives);

  // Auto-advance perspectives
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentPerspective((prev) => (prev + 1) % allPerspectives.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allPerspectives.length]);

  // Load generated count from sessionStorage
  useEffect(() => {
    const storedCount = sessionStorage.getItem("doutya_generated_count");
    if (storedCount) {
      setGeneratedCount(parseInt(storedCount, 10));
    }
  }, []);

  // Handle modal and body scroll
  useEffect(() => {
    if (showViewpointModal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [showViewpointModal]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && showViewpointModal && !isGeneratingTest) {
        handleModalClose();
      }
    };

    if (showViewpointModal) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showViewpointModal, isGeneratingTest]);

  const handleGenerateClick = () => {
    if (generatedCount >= 2) {
      toast.error("Demo limit reached! You can generate maximum 2 test perspectives.");
      return;
    }
    setShowViewpointModal(true);
  };

  const handleModalClose = () => {
    if (isGeneratingTest) return;
    setShowViewpointModal(false);
    setCustomViewpoint("");
  };

  const generateTestPerspective = async () => {
    if (!customViewpoint.trim()) {
      toast.error("Please enter a viewpoint");
      return;
    }

    if (isGeneratingTest) return;

    setIsGeneratingTest(true);

    try {
      const response = await fetch("/api/test-perspective", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseTitle: "Climate Summit Reaches Historic Agreement",
          baseDescription: "World leaders have reached a comprehensive climate agreement with binding emission reduction targets and significant funding commitments.",
          customViewpoint: customViewpoint.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const colors = [
          "from-purple-500 to-violet-600",
          "from-orange-500 to-red-600",
          "from-teal-500 to-cyan-600",
          "from-pink-500 to-rose-600",
        ];

        const textColors = [
          "text-purple-600",
          "text-orange-600", 
          "text-teal-600",
          "text-pink-600",
        ];

        const newTestPerspective = {
          ...data.perspective,
          color: colors[generatedCount % colors.length],
          textColor: textColors[generatedCount % textColors.length],
          bgColor: "bg-purple-50",
          image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
          tag: "AI Generated",
          isTest: true,
        };

        setAllPerspectives((prev) => [...prev, newTestPerspective]);
        setCurrentPerspective(allPerspectives.length);

        const newCount = generatedCount + 1;
        setGeneratedCount(newCount);
        sessionStorage.setItem("doutya_generated_count", newCount.toString());

        setShowViewpointModal(false);
        setCustomViewpoint("");

        toast.success(`Test perspective generated! (${newCount}/2)`);
      } else {
        toast.error(data.error || "Failed to generate perspective");
      }
    } catch (error) {
      console.error("Error generating test perspective:", error);
      toast.error("Failed to generate test perspective");
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const removeTestPerspectives = () => {
    setAllPerspectives(basePerspectives);
    setCurrentPerspective(0);
    setGeneratedCount(0);
    sessionStorage.removeItem("doutya_generated_count");
    toast.info("Test perspectives cleared!");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleGetStarted = () => {
    router.push("/news");
  };

  // Custom Modal Component
  const CustomViewpointModal = () => {
    if (!showViewpointModal) return null;

    return (
      <div className="fixed inset-0 z-[9999] transition-all duration-300">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleModalClose}
        />
        
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Generate Demo Perspective
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                This will generate a demo viewpoint related to the person, organization, or entity you specify. Our AI will create a unique perspective on the climate summit story.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your viewpoint:
                </label>
                <input
                  type="text"
                  value={customViewpoint}
                  onChange={(e) => setCustomViewpoint(e.target.value)}
                  placeholder="e.g., Small Business Owner, Student Leader, Tech Entrepreneur..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  maxLength={50}
                  disabled={isGeneratingTest}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {customViewpoint.length}/50 characters
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    <strong>Demo Limit:</strong> You can generate {2 - generatedCount} more perspective
                    {2 - generatedCount !== 1 ? "s" : ""}
                    {generatedCount > 0 && ` (${generatedCount}/2 used)`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleModalClose}
                disabled={isGeneratingTest}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={generateTestPerspective}
                disabled={isGeneratingTest || !customViewpoint.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isGeneratingTest ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Custom Modal */}
      <CustomViewpointModal />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interactive Demo</h1>
                <p className="text-sm text-gray-500">Multi-Perspective Analysis</p>
              </div>
            </div>

            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Demo Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Brain className="w-4 h-4 mr-2" />
            Live Interactive Demo
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              See How One Story Looks from
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Multiple Perspectives
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Experience Doutya's flagship feature: multi-perspective analysis. The same climate summit story, seen through different expert viewpoints.
          </p>

          {/* Demo Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-12">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Real AI Analysis
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Generate Custom Views
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Interactive Experience
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Demo Interface */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Demo Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Climate Summit Story</h3>
                <p className="text-gray-600 mt-1">Experience multi-perspective analysis in action</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-3 hover:bg-white/50 rounded-xl transition-colors"
                >
                  {isAutoPlaying ? (
                    <Pause className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => setCurrentPerspective(0)}
                  className="p-3 hover:bg-white/50 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentPerspective + 1) / allPerspectives.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Perspective {currentPerspective + 1} of {allPerspectives.length}</span>
              <span>{Math.round(((currentPerspective + 1) / allPerspectives.length) * 100)}% Complete</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Perspective Selector */}
            <div className="lg:col-span-1">
              <h4 className="font-bold text-gray-900 mb-4">Choose Perspective</h4>
              <div className="space-y-3">
                {allPerspectives.map((perspective, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentPerspective(index)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      currentPerspective === index
                        ? `bg-gradient-to-r ${perspective.color} text-white shadow-lg transform scale-105`
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                    whileHover={currentPerspective === index ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold opacity-90">
                        {perspective.tag}
                      </span>
                      {perspective.isTest && (
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          AI
                        </span>
                      )}
                    </div>
                    <div className="font-bold">{perspective.viewpoint}</div>
                  </motion.button>
                ))}

                {/* Generate Custom Perspective */}
                <motion.button
                  onClick={handleGenerateClick}
                  disabled={generatedCount >= 2}
                  className={`w-full p-4 rounded-xl text-left border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                    generatedCount >= 2
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                  whileHover={generatedCount < 2 ? { scale: 1.02 } : {}}
                  whileTap={generatedCount < 2 ? { scale: 0.98 } : {}}
                >
                  <div className={`flex items-center ${generatedCount >= 2 ? "text-gray-400" : "text-purple-600"}`}>
                    <Plus className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <span className="font-medium block">
                        {generatedCount >= 2 ? "Demo Limit Reached" : "Generate Custom View"}
                      </span>
                      <span className="text-xs opacity-75">
                        {generatedCount >= 2 ? "(2/2 used)" : `(${generatedCount}/2 used)`}
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Clear Test Perspectives */}
                {allPerspectives.length > 2 && (
                  <motion.button
                    onClick={removeTestPerspectives}
                    className="w-full p-4 rounded-xl text-left border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center text-red-600">
                      <X className="w-5 h-5 mr-3" />
                      <span className="font-medium">Clear AI Perspectives</span>
                    </div>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Article Display */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPerspective}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Article Image */}
                  <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
                    <img
                      src={allPerspectives[currentPerspective].image}
                      alt={allPerspectives[currentPerspective].viewpoint}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div
                      className={`absolute top-4 left-4 px-4 py-2 bg-gradient-to-r ${allPerspectives[currentPerspective].color} text-white rounded-full font-bold flex items-center`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {allPerspectives[currentPerspective].viewpoint} View
                      {allPerspectives[currentPerspective].isTest && (
                        <Sparkles className="w-4 h-4 ml-2" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                      {allPerspectives[currentPerspective].title}
                    </h2>

                    {/* Article Content */}
                    <div className="max-h-64 overflow-y-auto pr-2">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {allPerspectives[currentPerspective].description}
                      </p>
                    </div>

                    {/* Article Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {allPerspectives[currentPerspective].isTest ? "3 min read" : "5 min read"}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {allPerspectives[currentPerspective].isTest ? "42" : "1.2k"}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Trending
                        </div>
                      </div>
                      <button className="text-red-600 font-semibold hover:text-red-700 flex items-center text-sm">
                        Read Full Article
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 pb-8">
            {allPerspectives.map((perspective, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPerspective(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentPerspective === index
                    ? perspective.isTest
                      ? "bg-purple-600 w-8"
                      : "bg-red-600 w-8"
                    : "bg-gray-300 w-3 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Multiple Viewpoints</h3>
            <p className="text-gray-600 leading-relaxed">
              Every story analyzed from Environmental, Economic, Political, and Social perspectives for complete understanding.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Generated Views</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate custom perspectives from any viewpoint using our advanced AI analysis engine.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Exam-Focused</h3>
            <p className="text-gray-600 leading-relaxed">
              Every analysis is crafted specifically for competitive exam preparation and interview readiness.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Full Platform?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              This is just one feature. Discover AI debates, smart discussions, exam-specific trending, and much more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all"
              >
                Learn More Features
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;