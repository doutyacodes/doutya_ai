"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import {
  Eye,
  Globe,
  BookOpen,
  TrendingUp,
  MapPin,
  Star,
  Users,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Newspaper,
  Search,
  Filter,
  Bookmark,
  Share2,
  ChevronDown,
  Check,
  Sparkles,
  Brain,
  Target,
  Lightbulb,
  Zap,
  Shield,
  Layers,
  Clock,
  ChevronRight,
  Award,
  Heart,
  MessageCircle,
  BarChart3,
  Plus,
  Minus,
  Menu,
  X,
  FolderOpen,
  FileText,
  BookmarkPlus,
  Loader2,
  Info,
} from "lucide-react";
import Link from "next/link";
import PricingPage from "../_components/PricingPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const LandingPage = () => {
  const [currentPerspective, setCurrentPerspective] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [testPerspectives, setTestPerspectives] = useState([]);

  // Modal states
  const [showViewpointModal, setShowViewpointModal] = useState(false);
  const [customViewpoint, setCustomViewpoint] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [isModalChanging, setIsModalChanging] = useState(false);
  const [lastGenerateClick, setLastGenerateClick] = useState(0);
  const [modalError, setModalError] = useState(null);

  const router = useRouter();

  const handleClick = () => {
    router.push("/news");
  };

  // Base perspectives (reduced to 2)
  const basePerspectives = [
    {
      viewpoint: "Environmental Activist",
      title:
        "Climate Summit Breakthrough: Historic Carbon Reduction Targets Set Global Standard",
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description:
        "Environmental groups worldwide are celebrating what they're calling the most significant climate agreement in decades. The summit's comprehensive framework includes binding emission reduction targets of 45% by 2030, unprecedented funding for renewable energy infrastructure, and strict accountability mechanisms for participating nations.\n\nKey achievements include the establishment of a $500 billion Global Climate Fund, mandatory carbon pricing across G20 nations, and innovative carbon capture technology sharing agreements. Environmental scientists emphasize that these measures could limit global warming to 1.5°C if implemented effectively.\n\nDr. Sarah Chen, lead climate researcher at MIT, states: 'This agreement represents the political will we've been waiting for. The binding nature of these commitments, combined with robust verification systems, gives us genuine hope for meaningful climate action.'\n\nThe agreement also includes provisions for protecting biodiversity hotspots, transitioning away from fossil fuel subsidies, and supporting climate adaptation in vulnerable communities. Critics argue the timeline is still too conservative, but most environmental advocates view this as a crucial step forward in the global fight against climate change.",
      image:
        "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tag: "Environment",
      isTest: false,
    },
    {
      viewpoint: "Economic Policy Expert",
      title:
        "Climate Summit Agreement: Economic Implications and Market Transformation Opportunities",
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      description:
        "Economic analysts are examining the far-reaching implications of the climate summit agreement, with early assessments suggesting a fundamental shift in global economic priorities. The agreement's $500 billion commitment represents the largest coordinated economic intervention since the post-2008 financial recovery packages.\n\nMarket responses have been notably positive, with renewable energy stocks surging 15% globally and green technology firms experiencing unprecedented investment interest. The mandatory carbon pricing mechanism is expected to generate an estimated $2 trillion annually, creating new revenue streams for governments while incentivizing clean technology adoption.\n\nJP Morgan's chief economist, Michael Rodriguez, notes: 'This agreement essentially creates the world's largest new market overnight. The carbon pricing framework will drive innovation, create millions of jobs in emerging sectors, and potentially add 2-3% to global GDP growth over the next decade.'\n\nTraditional energy sectors face significant challenges, with coal and oil companies already announcing major restructuring plans. However, economists emphasize that the transition period includes substantial support for worker retraining and regional economic development, potentially making this the most managed economic transformation in modern history.",
      image:
        "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tag: "Economics",
      isTest: false,
    },
  ];

  const [allPerspectives, setAllPerspectives] = useState(basePerspectives);

  // Load generated count from sessionStorage on component mount
  useEffect(() => {
    const storedCount = sessionStorage.getItem("doutya_generated_count");
    if (storedCount) {
      setGeneratedCount(parseInt(storedCount, 10));
    }
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showViewpointModal) {
      document.body.classList.add('modal-open');
      document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.paddingRight = '';
    };
  }, [showViewpointModal]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showViewpointModal && !isGeneratingTest) {
        handleModalCancel();
      }
    };

    if (showViewpointModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showViewpointModal, isGeneratingTest]);

  // Handle modal errors
  useEffect(() => {
    if (modalError) {
      console.error('Modal error:', modalError);
      setShowViewpointModal(false);
      setModalError(null);
      toast.error('Something went wrong with the modal. Please try again.');
    }
  }, [modalError]);

  // Auto-rotate perspectives
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentPerspective((prev) => (prev + 1) % allPerspectives.length);
    }, 6000); // Increased to 6 seconds for more content

    return () => clearInterval(interval);
  }, [isAutoPlaying, allPerspectives.length]);

  // Debounced modal state management
  const debouncedSetShowViewpointModal = useCallback((value) => {
    if (isModalChanging) return;
    
    setIsModalChanging(true);
    setShowViewpointModal(value);
    
    setTimeout(() => {
      setIsModalChanging(false);
    }, 300);
  }, [isModalChanging]);

  // Handle generate button click with debouncing
  const handleGenerateClick = useCallback(() => {
    if (generatedCount >= 2) {
      toast.error(
        "Demo limit reached! You can generate maximum 2 test perspectives."
      );
      return;
    }
    
    if (isModalChanging) return;
    
    debouncedSetShowViewpointModal(true);
  }, [generatedCount, isModalChanging, debouncedSetShowViewpointModal]);

  // Handle modal cancel with debouncing
  const handleModalCancel = useCallback(() => {
    if (isGeneratingTest || isModalChanging) return;
    
    debouncedSetShowViewpointModal(false);
    
    setTimeout(() => {
      setCustomViewpoint("");
    }, 100);
  }, [isGeneratingTest, isModalChanging, debouncedSetShowViewpointModal]);

  // Generate test perspective with debouncing and error handling
  const generateTestPerspective = useCallback(async () => {
    const now = Date.now();
    if (now - lastGenerateClick < 1000) {
      return;
    }
    setLastGenerateClick(now);

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
          baseDescription:
            "World leaders have reached a comprehensive climate agreement with binding emission reduction targets and significant funding commitments.",
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
          image:
            "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
          tag: "AI Generated",
          isTest: true,
        };

        setAllPerspectives(prev => [...prev, newTestPerspective]);
        setCurrentPerspective(allPerspectives.length);

        const newCount = generatedCount + 1;
        setGeneratedCount(newCount);
        sessionStorage.setItem("doutya_generated_count", newCount.toString());

        setTimeout(() => {
          debouncedSetShowViewpointModal(false);
          setCustomViewpoint("");
        }, 200);

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
  }, [customViewpoint, generatedCount, allPerspectives.length, isGeneratingTest, lastGenerateClick, debouncedSetShowViewpointModal]);

  // Remove test perspectives
  const removeTestPerspectives = () => {
    setAllPerspectives(basePerspectives);
    setCurrentPerspective(0);
    setGeneratedCount(0);
    sessionStorage.removeItem("doutya_generated_count");
    toast.info("Test perspectives cleared!");
  };

  // Enhanced animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const features = [
    {
      icon: Eye,
      title: "Multiple Viewpoints",
      description:
        "Understand how different countries, institutions, or sides view the same story — not opinions, but real perspectives that help you think deeply.",
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50",
      image:
        "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    },
    {
      icon: FolderOpen,
      title: "Save & Organize",
      description:
        "Save important articles. Group them into folders. Add personal notes (Pro & Elite) to build your revision base.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      image:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    },
    {
      icon: TrendingUp,
      title: "Trending by Aspirants",
      description:
        "See the most saved articles across Doutya. In Pro and Elite, filter trending by your exam — see what UPSC, NDA, or SSC aspirants are reading today.",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      image:
        "https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    },
    {
      icon: Target,
      title: "Designed for Exam Prep",
      description:
        "Every article is selected and structured with aspirants in mind — relevance to GS papers, interviews, current events, and debates.",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      image:
        "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Daily Updates",
      icon: Newspaper,
      color: "from-red-500 to-pink-500",
    },
    {
      number: "500+",
      label: "Topics Covered",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "Multiple",
      label: "Perspectives",
      icon: Eye,
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "5K+",
      label: "Serious Aspirants",
      icon: Users,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const testimonials = [
    {
      name: "Anjali",
      role: "UPSC Aspirant, Delhi",
      content:
        "Breaking down news from multiple sides changed how I prepare for UPSC. The actor-based perspectives make complex topics so much clearer.",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Arjun Patel",
      role: "IFS Aspirant, Mumbai",
      content:
        "The smart saving feature helps me organize my study material perfectly. I can review key insights anytime, anywhere.",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Sneha Reddy",
      role: "CDS Aspirant, Bangalore",
      content:
        "Seeing what other aspirants are reading keeps me updated with trending topics. It's like having a study group online.",
      avatar:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How does the multi-perspective feature work?",
      answer:
        "Each news story is analyzed from different viewpoints - seeing how different countries, institutions, or stakeholders interpret the same event. This helps you understand the complete picture and prepare for comprehensive exam questions, group discussions, and interviews.",
    },
    {
      question: "Can I save articles for later review?",
      answer:
        "Yes! Our smart saving feature lets you organize articles into custom folders with notes (Pro & Elite plans). You can easily review your saved insights anytime and build your personal knowledge base for revision.",
    },
    {
      question: "What makes Doutya different from other news apps?",
      answer:
        "Doutya is specifically built for serious aspirants. We focus on exam-ready content with multi-perspective analysis, trending by exam type, and smart organization - all designed to enhance your preparation for group discussions, interviews, essays, and Mains papers.",
    },
    {
      question: "How often is the content updated?",
      answer:
        "We update our content daily with curated stories selected specifically for their relevance to competitive exams. Our team ensures you get the most exam-focused current affairs content consistently.",
    },
    {
      question: "Can I see what other aspirants are reading?",
      answer:
        "Yes! Our trending feature shows the most saved articles across all Doutya users. With Pro and Elite plans, you can filter trending content by your specific exam track (UPSC, NDA, SSC, etc.) to see what fellow aspirants in your field are focusing on.",
    },
  ];

  // Custom Viewpoint Modal Component with all fixes
  const CustomViewpointModal = () => {
    try {
      return (
        <AnimatePresence mode="wait">
          {showViewpointModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 bg-black bg-opacity-50 z-[9999] modal-backdrop"
                style={{ backdropFilter: 'blur(4px)' }}
                onClick={(e) => {
                  if (e.target === e.currentTarget && !isGeneratingTest) {
                    handleModalCancel();
                  }
                }}
              />
              
              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 pointer-events-none modal-container">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl pointer-events-auto modal-content"
                  style={{ transform: 'translateZ(0)' }}
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
                      This will generate a demo viewpoint related to the person,
                      organization, or entity you specify. Our AI will create a unique
                      perspective on the climate summit story.
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all modal-input"
                        style={{ transition: 'all 0.2s ease-in-out' }}
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
                          <strong>Demo Limit:</strong> You can generate{" "}
                          {2 - generatedCount} more perspective
                          {2 - generatedCount !== 1 ? "s" : ""}
                          {generatedCount > 0 && ` (${generatedCount}/2 used)`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleModalCancel}
                      disabled={isGeneratingTest}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed modal-button"
                      style={{ 
                        touchAction: 'manipulation',
                        userSelect: 'none'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={generateTestPerspective}
                      disabled={isGeneratingTest || !customViewpoint.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center modal-button"
                      style={{ 
                        touchAction: 'manipulation',
                        userSelect: 'none'
                      }}
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
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      );
    } catch (error) {
      setModalError(error);
      return null;
    }
  };

  return (
    <>
      {/* Add CSS styles for modal */}
      <style jsx global>{`
        .modal-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }

        .modal-backdrop {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .modal-backdrop * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .modal-container {
          isolation: isolate;
        }

        .modal-content {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: transform, opacity;
        }

        .modal-input {
          transition: all 0.2s ease-in-out;
        }

        .modal-input:focus {
          transform: scale(1.02);
        }

        .modal-button {
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>

      <div className="min-h-screen bg-white overflow-hidden">
        {/* Custom Viewpoint Modal */}
        <CustomViewpointModal />

        {/* Enhanced Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16 sm:h-20">
              <motion.div
                className="flex items-center space-x-2 sm:space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={"/images/logo.png"}
                  width={150}
                  height={75}
                  alt="logo"
                />
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-red-600 transition-all duration-300 font-medium text-sm lg:text-base"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-red-600 transition-all duration-300 font-medium text-sm lg:text-base"
                >
                  Pricing
                </a>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClick()}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 lg:px-8 py-2 lg:py-3 rounded-xl lg:rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold text-sm lg:text-base"
                >
                  Start Learning
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl"
                >
                  <div className="px-4 py-6 space-y-4">
                    <a
                      href="#features"
                      className="block text-gray-600 hover:text-red-600 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Features
                    </a>
                    <a
                      href="#pricing"
                      className="block text-gray-600 hover:text-red-600 transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Pricing
                    </a>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold mt-4"
                      onClick={() => handleClick()}
                    >
                      Start Learning
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>

        {/* Enhanced Hero Section */}
        <section className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="text-center lg:text-left"
              >
                <motion.div variants={fadeInUp}>
                  <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-red-700 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Perfect for Serious Aspirants
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      Read What Matters.
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                      Understand Every Angle.
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                      Lead the Conversation.
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  variants={fadeInUp}
                  className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
                >
                  Current affairs made for aspirants. Get structured summaries
                  with multiple perspectives — so you&apos;re always ready for
                  group discussions, interviews, essays, and beyond.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center lg:justify-start"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick()}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
                  >
                    Start Learning
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-2 border-gray-200 text-gray-700 px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Watch Demo
                  </motion.button>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-8 text-xs sm:text-sm text-gray-500"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Multi-perspective
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Smart saving
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Exam-ready
                  </div>
                </motion.div>
              </motion.div>

              {/* Enhanced Interactive Demo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mt-8 lg:mt-0"
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 relative overflow-hidden">
                  {/* Glass morphism background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 backdrop-blur-sm"></div>

                  <div className="relative z-10">
                    {/* Demo Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                      <div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                          Live Perspective Demo
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          See how one story looks from different angles
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                          className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                        >
                          {isAutoPlaying ? (
                            <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setCurrentPerspective(0)}
                          className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                        >
                          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Perspective Selector */}
                    <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      {allPerspectives.map((perspective, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentPerspective(index)}
                          className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-left transition-all duration-300 relative ${
                            currentPerspective === index
                              ? `bg-gradient-to-r ${perspective.color} text-white shadow-lg transform scale-105`
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                          whileHover={{
                            scale: currentPerspective === index ? 1.05 : 1.02,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-xs font-semibold opacity-90">
                            {perspective.tag}
                            {perspective.isTest && (
                              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                TEST
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-bold mt-1">
                            {perspective.viewpoint}
                          </div>
                        </motion.button>
                      ))}

                      {/* Generate Test Perspective Button */}
                      <motion.button
                        onClick={handleGenerateClick}
                        disabled={generatedCount >= 2}
                        className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-left border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                          generatedCount >= 2
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                        }`}
                        whileHover={generatedCount < 2 ? { scale: 1.02 } : {}}
                        whileTap={generatedCount < 2 ? { scale: 0.98 } : {}}
                      >
                        <div
                          className={`flex items-center ${
                            generatedCount >= 2
                              ? "text-gray-400"
                              : "text-purple-600"
                          }`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <div className="text-left">
                            <span className="text-sm font-medium block">
                              {generatedCount >= 2
                                ? "Demo Limit Reached"
                                : "Generate Custom Perspective"}
                            </span>
                            <span className="text-xs opacity-75">
                              {generatedCount >= 2
                                ? "(2/2 used)"
                                : `(${generatedCount}/2 used)`}
                            </span>
                          </div>
                        </div>
                      </motion.button>

                      {/* Clear Test Perspectives Button */}
                      {allPerspectives.length > 2 && (
                        <motion.button
                          onClick={removeTestPerspectives}
                          className="p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-left border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              Clear Test Perspectives
                            </span>
                          </div>
                        </motion.button>
                      )}
                    </div>

                    {/* Article Preview */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPerspective}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-3 sm:space-y-4 lg:space-y-6"
                      >
                        {/* Smaller Image */}
                        <div className="relative aspect-[2/1] rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                          <img
                            src={allPerspectives[currentPerspective].image}
                            alt={allPerspectives[currentPerspective].viewpoint}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div
                            className={`absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 bg-gradient-to-r ${allPerspectives[currentPerspective].color} text-white text-xs font-bold rounded-full`}
                          >
                            {allPerspectives[currentPerspective].viewpoint}{" "}
                            Perspective
                            {allPerspectives[currentPerspective].isTest && (
                              <span className="ml-1 opacity-75">✨</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-tight">
                            {allPerspectives[currentPerspective].title}
                          </h4>

                          {/* Expanded Description with Scroll */}
                          <div className="max-h-48 overflow-y-auto">
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                              {allPerspectives[currentPerspective].description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {allPerspectives[currentPerspective].isTest
                                  ? "3 min read"
                                  : "4 min read"}
                              </div>
                              <div className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {allPerspectives[currentPerspective].isTest
                                  ? "42"
                                  : "1.2k"}
                              </div>
                            </div>
                            <button className="text-red-600 text-xs sm:text-sm font-semibold hover:text-red-700 flex items-center">
                              Read more
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Enhanced Progress Dots */}
                    <div className="flex justify-center space-x-2 mt-4 sm:mt-6 lg:mt-8">
                      {allPerspectives.map((perspective, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentPerspective(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            currentPerspective === index
                              ? perspective.isTest
                                ? "bg-purple-600 w-6 sm:w-8"
                                : "bg-red-600 w-6 sm:w-8"
                              : "bg-gray-300 w-2 hover:bg-gray-400"
                          }`}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute top-1/2 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute bottom-1/4 left-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-8 sm:py-12 bg-gradient-to-r from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${stat.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Features That Matter
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Made for Aspirants.
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  Built for Clarity.
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                From multiple viewpoints to smart organization and exam-specific
                trending, every feature is built to help you prepare better.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="group relative"
                >
                  <div
                    className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border-2 transition-all duration-500 hover:shadow-2xl ${
                      hoveredFeature === index
                        ? "border-red-200 scale-105"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Feature Image */}
                    <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 relative">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`absolute top-3 sm:top-4 left-3 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </motion.div>
                    </div>

                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      {feature.description}
                    </p>

                    <motion.button
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center font-semibold text-red-600 group text-sm sm:text-base"
                    >
                      Learn more
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white"
        >
          <PricingPage />
        </section>

        {/* Testimonials Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                What Aspirants Say
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Trusted by Serious
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  Aspirants Across India
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of aspirants who are already using Doutya to
                enhance their current affairs preparation.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4 sm:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                   {` "${testimonial.content}"`}
                  </p>

                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Common Questions
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  You Might Be
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                  Wondering…
                </span>
              </h2>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base lg:text-lg">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200"
                      >
                        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-gray-600 leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              <div className="sm:col-span-2 lg:col-span-2">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                  Built in India, for India&apos;s Future Thinkers.
                </h3>
                <p className="text-gray-400 mb-6 sm:mb-8 max-w-md leading-relaxed text-sm sm:text-base">
                  Doutya PrepHelp — a purposeful tool for smart, serious
                  preparation.
                </p>
                <div className="flex space-x-3 sm:space-x-4">
                  {[Share2, Users, Globe, MessageCircle].map((Icon, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2, y: -3 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                  Product
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="hover:text-white transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                  Company
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} Doutya PrepHelp. All rights
                reserved.
              </p>
              <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;