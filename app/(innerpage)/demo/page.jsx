"use client";

import CustomViewpointModal from "@/components/CustomViewpointModal";
import Toast from "@/components/Toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  ChevronRight,
  Clock,
  Eye,
  Globe,
  Heart,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  const router = useRouter()

  // Toast helper - memoized to prevent re-creation
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, id: Date.now() });

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  // Base perspectives - moved to state to prevent re-creation
  const basePerspectives = useMemo(
    () => [
      {
        viewpoint: "Environmental Activist",
        title:
          "Climate Summit Breakthrough: Historic Carbon Reduction Targets Set Global Standard",
        color: "from-red-500 to-red-600",
        textColor: "text-red-600",
        bgColor: "bg-red-50",
        description:
          "Environmental groups worldwide are celebrating what they're calling the most significant climate agreement in decades. The summit's comprehensive framework includes binding emission reduction targets of 45% by 2030, unprecedented funding for renewable energy infrastructure, and strict accountability mechanisms for participating nations.\n\nKey achievements include the establishment of a $500 billion Global Climate Fund, mandatory carbon pricing across G20 nations, and innovative carbon capture technology sharing agreements. Environmental scientists emphasize that these measures could limit global warming to 1.5°C if implemented effectively.\n\nDr. Sarah Chen, lead climate researcher at MIT, states: 'This agreement represents the political will we've been waiting for. The binding nature of these commitments, combined with robust verification systems, gives us genuine hope for meaningful climate action.'\n\nThe agreement also includes provisions for protecting biodiversity hotspots, transitioning away from fossil fuel subsidies, and supporting climate adaptation in vulnerable communities. Critics argue the timeline is still too conservative, but most environmental advocates view this as a crucial step forward in the global fight against climate change.",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        tag: "Environment",
        isTest: false,
      },
      {
        viewpoint: "Economic Policy Expert",
        title:
          "Climate Summit Agreement: Economic Implications and Market Transformation Opportunities",
        color: "from-red-400 to-red-500",
        textColor: "text-red-500",
        bgColor: "bg-red-50",
        description:
          "Economic analysts are examining the far-reaching implications of the climate summit agreement, with early assessments suggesting a fundamental shift in global economic priorities. The agreement's $500 billion commitment represents the largest coordinated economic intervention since the post-2008 financial recovery packages.\n\nMarket responses have been notably positive, with renewable energy stocks surging 15% globally and green technology firms experiencing unprecedented investment interest. The mandatory carbon pricing mechanism is expected to generate an estimated $2 trillion annually, creating new revenue streams for governments while incentivizing clean technology adoption.\n\nJP Morgan's chief economist, Michael Rodriguez, notes: 'This agreement essentially creates the world's largest new market overnight. The carbon pricing framework will drive innovation, create millions of jobs in emerging sectors, and potentially add 2-3% to global GDP growth over the next decade.'\n\nTraditional energy sectors face significant challenges, with coal and oil companies already announcing major restructuring plans. However, economists emphasize that the transition period includes substantial support for worker retraining and regional economic development, potentially making this the most managed economic transformation in modern history.",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        tag: "Economics",
        isTest: false,
      },
    ],
    []
  );

  const [allPerspectives, setAllPerspectives] = useState(basePerspectives);

  // Stable handlers using useCallback
  const handleModalClose = useCallback(() => {
    if (isGeneratingTest) return;
    setShowViewpointModal(false);
    setCustomViewpoint("");
  }, [isGeneratingTest]);

  const handleBackToHome = useCallback(() => {
    router.push("/");
  }, []);

  const handleGetStarted = useCallback(() => {
    router.push("/auth/login");
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
      showToast(
        "Demo limit reached! You can generate maximum 2 test perspectives.",
        "error"
      );
      return;
    }
    setShowViewpointModal(true);
  }, [generatedCount, showToast]);

  const generateTestPerspective = useCallback(async () => {
    const trimmedViewpoint = customViewpoint.trim();
    if (!trimmedViewpoint) {
      showToast("Please enter a viewpoint", "error");
      return;
    }

    if (isGeneratingTest) return;

    setIsGeneratingTest(true);

    try {
      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
        image:
          "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop",
        tag: "AI Generated",
        isTest: true,
      };

      setAllPerspectives((prev) => [...prev, newTestPerspective]);
      setCurrentPerspective(allPerspectives.length);

      const newCount = generatedCount + 1;
      setGeneratedCount(newCount);

      setShowViewpointModal(false);
      setCustomViewpoint("");

      showToast(`Test perspective generated! (${newCount}/2)`, "success");
    } catch (error) {
      console.error("Error generating test perspective:", error);
      showToast("Failed to generate test perspective", "error");
    } finally {
      setIsGeneratingTest(false);
    }
  }, [
    customViewpoint,
    isGeneratingTest,
    generatedCount,
    allPerspectives.length,
    showToast,
  ]);

  const removeTestPerspectives = useCallback(() => {
    setAllPerspectives(basePerspectives);
    setCurrentPerspective(0);
    setGeneratedCount(0);
    showToast("Test perspectives cleared!", "info");
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
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-400/10 to-red-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [10, -10, 10],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
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

      {/* Header - Improved mobile layout */}
      <div className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div
              onClick={() => router.push("/")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-20 h-10 sm:w-24 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25 p-1">
                <img
                  src="/images/logo.png"
                  alt="Doutya Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900">Doutya</div>
                <div className="text-xs text-gray-500">Live Demo</div>
              </div>
            </div>

            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-lg text-sm sm:text-base"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>

      {/* Demo Introduction - Better mobile spacing */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 text-red-700 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-sm"
          >
            <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Live Interactive Demo
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight px-2">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Experience News Through
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Multiple Expert Lenses
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
            Discover Doutya&apos;s revolutionary multi-perspective analysis. See
            how the same climate summit story transforms when viewed through
            different expert viewpoints.
          </p>

          {/* Enhanced Demo Stats - Better mobile layout */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-8 text-sm mb-8 sm:mb-16">
            {[
              {
                icon: Shield,
                label: "Real AI Analysis",
                color: "text-green-600",
              },
              {
                icon: Brain,
                label: "Custom Perspectives",
                color: "text-red-600",
              },
              { icon: Zap, label: "Interactive Demo", color: "text-blue-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-gray-200/50 shadow-sm"
              >
                <div
                  className={`w-2 h-2 ${stat.color.replace(
                    "text-",
                    "bg-"
                  )} rounded-full`}
                />
                <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
                <span className="font-medium text-gray-700 text-xs sm:text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Demo Interface - Mobile-first design */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden"
        >
          {/* Header with improved mobile layout */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 md:p-8 border-b border-red-200/50">
            <div className="flex flex-col space-y-4 sm:space-y-6">
              {/* Title and controls */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Climate Summit Analysis
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                    Interactive multi-perspective demonstration
                  </p>
                </div>
                
                {/* Control buttons - better mobile layout */}
                <div className="flex justify-center sm:justify-end gap-2 sm:gap-3">
                  <motion.button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 sm:p-3 bg-white/70 backdrop-blur-sm hover:bg-white/90 rounded-xl transition-all duration-300 border border-white/50 shadow-sm"
                  >
                    {isAutoPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentPerspective(0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 sm:p-3 bg-white/70 backdrop-blur-sm hover:bg-white/90 rounded-xl transition-all duration-300 border border-white/50 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Progress Indicator - improved mobile visibility */}
              <div className="space-y-3">
                <div className="w-full bg-white/60 rounded-full h-2.5 sm:h-3 shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 sm:h-3 rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((currentPerspective + 1) / allPerspectives.length) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 font-medium">
                    Perspective {currentPerspective + 1} of{" "}
                    {allPerspectives.length}
                  </span>
                  <span className="text-red-600 font-semibold">
                    {Math.round(
                      ((currentPerspective + 1) / allPerspectives.length) * 100
                    )}
                    % Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area - Stacked layout for mobile */}
          <div className="flex flex-col lg:flex-row">
            {/* Article Section - First on mobile for better UX */}
            <div className="lg:order-2 flex-1 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPerspective}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Image with better mobile aspect ratio */}
                  <div className="relative aspect-[16/10] sm:aspect-[2/1] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
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
                      className={`absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 bg-gradient-to-r ${allPerspectives[currentPerspective].color} text-white rounded-xl sm:rounded-2xl font-bold flex items-center shadow-lg backdrop-blur-sm text-xs sm:text-sm`}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2" />
                      <span className="hidden sm:inline">{allPerspectives[currentPerspective].viewpoint} View</span>
                      <span className="sm:hidden">{allPerspectives[currentPerspective].viewpoint}</span>
                      {allPerspectives[currentPerspective].isTest && (
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      )}
                    </motion.div>
                  </div>

                  {/* Title with better mobile typography */}
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
                  >
                    {allPerspectives[currentPerspective].title}
                  </motion.h2>

                  {/* Article content with improved mobile reading */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-h-[40vh] sm:max-h-[50vh] lg:max-h-72 overflow-y-auto pr-2 sm:pr-3 md:pr-4 bg-gradient-to-b from-gray-50/50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100"
                  >
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg whitespace-pre-line">
                      {allPerspectives[currentPerspective].description}
                    </p>
                  </motion.div>

                  {/* Article metadata - responsive layout */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 border-t border-gray-200"
                  >
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {allPerspectives[currentPerspective].isTest
                          ? "3 min read"
                          : "5 min read"}
                      </div>
                      <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {allPerspectives[currentPerspective].isTest
                          ? "42"
                          : "1.2k"}
                      </div>
                      <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Trending
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-red-600 font-semibold hover:text-red-700 flex items-center text-xs sm:text-sm bg-red-50 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-300 self-start sm:self-auto"
                    >
                      Read Full Article
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Perspective Selector - Second on mobile, collapsible design */}
            <div className="lg:order-1 w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-r border-gray-200/50 bg-gray-50/30">
              <div className="p-4 sm:p-6">
                <h4 className="font-bold text-gray-900 mb-4 sm:mb-6 text-base sm:text-lg flex items-center">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                  Choose Perspective
                </h4>
                
                <div className="space-y-3">
                  {allPerspectives.map((perspective, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentPerspective(index)}
                      className={`w-full p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl text-left transition-all duration-500 ${
                        currentPerspective === index
                          ? `bg-gradient-to-r ${perspective.color} text-white shadow-xl transform scale-105`
                          : "bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg text-gray-700 border border-gray-200/50"
                      }`}
                      whileHover={
                        currentPerspective === index ? {} : { scale: 1.02, y: -2 }
                      }
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
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
                      <div className="font-bold text-sm sm:text-base md:text-lg">
                        {perspective.viewpoint}
                      </div>
                    </motion.button>
                  ))}

                  {/* Generate Button - Improved mobile design */}
                  <motion.button
                    onClick={handleGenerateClick}
                    disabled={generatedCount >= 2}
                    className={`w-full p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl text-left border-2 border-dashed transition-all duration-500 flex items-center justify-between ${
                      generatedCount >= 2
                        ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50/30"
                        : "border-red-300 hover:border-red-400 hover:bg-red-50 bg-white/80 backdrop-blur-sm hover:shadow-lg"
                    }`}
                    whileHover={generatedCount < 2 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={generatedCount < 2 ? { scale: 0.98 } : {}}
                  >
                    <div
                      className={`flex items-center ${
                        generatedCount >= 2 ? "text-gray-400" : "text-red-600"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 ${
                          generatedCount >= 2 ? "bg-gray-200" : "bg-red-100"
                        }`}
                      >
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold block text-sm sm:text-base md:text-lg">
                          {generatedCount >= 2
                            ? "Demo Limit Reached"
                            : "Generate Custom View"}
                        </span>
                        <span className="text-xs sm:text-sm opacity-75">
                          {generatedCount >= 2
                            ? "(2/2 used)"
                            : `(${generatedCount}/2 used)`}
                        </span>
                      </div>
                    </div>
                  </motion.button>

                  {/* Clear Test - Improved mobile design */}
                  {allPerspectives.length > 2 && (
                    <motion.button
                      onClick={removeTestPerspectives}
                      className="w-full p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl text-left border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-between bg-white/80 backdrop-blur-sm hover:shadow-lg"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center text-red-600">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                          <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="text-left">
                          <span className="font-semibold block text-sm sm:text-base md:text-lg">
                            Clear AI Perspectives
                          </span>
                          <span className="text-xs sm:text-sm opacity-75">
                            Reset to original views
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots - Better mobile positioning */}
          <div className="flex justify-center space-x-2 sm:space-x-3 py-4 sm:py-6 md:py-8 bg-gray-50/30 border-t border-gray-200/50">
            {allPerspectives.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPerspective(index)}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                  currentPerspective === index
                    ? "bg-red-600 w-6 sm:w-8 shadow-lg"
                    : "bg-gray-300 w-2.5 sm:w-3 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Mobile-specific CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 sm:p-8 border border-red-200/50">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to explore more perspectives?
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Experience unlimited viewpoints on real-time news with Doutya&apos;s full platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-lg flex items-center justify-center"
              >
                <Target className="w-4 h-4 mr-2" />
                Start Free Trial
              </motion.button>
              <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto text-red-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-red-200 hover:bg-red-50 transition-all duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPage;