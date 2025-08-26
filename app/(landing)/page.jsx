"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import {
  Eye,
  Brain,
  MessageCircle,
  Target,
  Newspaper,
  GraduationCap,
  Users,
  FolderOpen,
  TrendingUp,
  Star,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Play,
  Award,
  BookOpen,
  Zap,
  Shield,
  Globe,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Check,
  MousePointer,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ModernDoutyaLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  const router = useRouter();

  const handleClick = (routeName) => {
    router.push(`/${routeName}`);
  };
  // Smooth scroll progress with spring animation
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const headerY = useTransform(smoothScrollProgress, [0, 0.1], [0, -100]);
  const heroY = useTransform(smoothScrollProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(smoothScrollProgress, [0, 0.3], [1, 0]);

  // Mouse tracking for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const featuresShowcase = [
    {
      title: "Multi-Perspective Analysis",
      description:
        "Experience the same story through Environmental, Economic, Political, and Social lenses. Understand the complete picture with our AI-powered perspective engine.",
      icon: Eye,
      gradient: "from-red-500 via-red-600 to-red-700",
      image:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&crop=center",
      stats: ["4 Perspectives", "AI Powered", "Real-time Analysis"],
    },
    {
      title: "Advanced AI Debates",
      description:
        "Sharpen your argumentation skills with sophisticated AI opponents. Practice User vs AI, AI vs AI debates, or tackle complex MCQ scenarios.",
      icon: Brain,
      gradient: "from-red-400 via-red-500 to-red-600",
      image:
        "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop&crop=center",
      stats: ["3 Debate Types", "Smart AI", "Performance Analytics"],
    },
    {
      title: "Intelligent Discussions",
      description:
        "Engage with diverse AI personalities on trending topics. Perfect preparation for group discussions, interviews, and competitive exams.",
      icon: MessageCircle,
      gradient: "from-red-300 via-red-400 to-red-500",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
      stats: ["Multiple AI Personas", "Topic Variety", "Interview Prep"],
    },
    {
      title: "Exam-Focused Content",
      description:
        "Curated content specifically designed for UPSC, SSC, Banking, Defense, and other competitive exams with real-time trending insights.",
      icon: Target,
      gradient: "from-red-600 via-red-700 to-red-800",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&crop=center",
      stats: ["25+ Exam Types", "Trending Topics", "Success Stories"],
    },
  ];

  const stats = [
    {
      number: "100+",
      label: "Articles",
      icon: Newspaper,
      color: "text-blue-600",
    },
    {
      number: "5+",
      label: "Exam Categories",
      icon: GraduationCap,
      color: "text-purple-600",
    },
    {
      number: "200+",
      label: "Perspectives",
      icon: Eye,
      color: "text-green-600",
    },
    {
      number: "50K+",
      label: "Active Learners",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const testimonials = [
    {
      name: "Arjun Patel",
      role: "UPSC CSE 2023 - AIR 47",
      exam: "Civil Services",
      content:
        "The multi-perspective analysis revolutionized my current affairs preparation. The AI debate feature was instrumental in my interview success.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
    },
    {
      name: "Priya Sharma",
      role: "SSC CGL 2023 - Selected",
      exam: "SSC",
      content:
        "The exam-specific trending feature kept me ahead of the curve. I could see exactly what topics other SSC aspirants were focusing on.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
    },
    {
      name: "Captain Rajesh Kumar",
      role: "CDS 2023 - Recommended",
      exam: "Defense",
      content:
        "Custom debates prepared me perfectly for SSB group discussions. The AI analysis provided insights I never would have considered.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
    },
  ];

  const features = [
    {
      icon: Eye,
      title: "Multi-Perspective Intelligence",
      description:
        "Advanced AI analyzes every story through Environmental, Economic, Political, and Social frameworks",
      gradient: "from-red-500 to-red-600",
      delay: 0.1,
    },
    {
      icon: Brain,
      title: "AI Debate Mastery",
      description:
        "Practice with sophisticated AI opponents across multiple debate formats and difficulty levels",
      gradient: "from-red-400 to-red-500",
      delay: 0.2,
    },
    {
      icon: MessageCircle,
      title: "Smart Discussion Hub",
      description:
        "Engage with diverse AI personalities on trending topics for comprehensive exam preparation",
      gradient: "from-red-300 to-red-400",
      delay: 0.3,
    },
    {
      icon: FolderOpen,
      title: "Intelligent Organization",
      description:
        "Smart folders with AI-powered categorization, annotations, and cross-referencing capabilities",
      gradient: "from-red-600 to-red-700",
      delay: 0.4,
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description:
        "AI-driven insights into trending topics and exam patterns across different competitive fields",
      gradient: "from-red-500 to-red-600",
      delay: 0.5,
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description:
        "Laser-focused content curation based on your specific exam requirements and performance",
      gradient: "from-red-700 to-red-800",
      delay: 0.6,
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "₹29",
      period: "/month",
      description: "Perfect for beginners exploring multi-perspective news",
      features: [
        "50 Article Saves",
        "Basic Perspectives",
        "Global Trending",
        "Email Support",
      ],
      gradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200 hover:border-gray-300",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800",
      textColor: "text-gray-900",
      popular: false,
      icon: Shield,
    },
    {
      name: "Pro",
      price: "₹79",
      period: "/month",
      description: "Most popular for serious exam preparation",
      features: [
        "Unlimited Saves",
        "AI Chat Access",
        "Exam Trending",
        "Priority Support",
        "Performance Analytics",
      ],
      gradient: "from-red-50 via-red-50 to-red-100",
      borderColor: "border-red-200 ring-2 ring-red-100 shadow-xl",
      buttonStyle:
        "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800",
      textColor: "text-gray-900",
      popular: true,
      icon: Zap,
    },
    {
      name: "Elite",
      price: "₹149",
      period: "/month",
      description: "Ultimate preparation for top performers",
      features: [
        "Everything in Pro",
        "Custom AI Debates",
        "Advanced Analytics",
      ],
      gradient: "from-red-50 via-red-100 to-red-200",
      borderColor: "border-red-200 hover:border-red-300",
      buttonStyle:
        "bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-800 hover:to-red-900",
      textColor: "text-gray-900",
      popular: false,
      icon: Award,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-50/50 via-white to-red-100/30 pointer-events-none" />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-400/10 to-red-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 },
          }}
          className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-red-300/10 to-red-600/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 },
          }}
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-red-500/10 to-red-700/10 rounded-full blur-xl"
        />
      </div>

      {/* Hero Section */}
      <section className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto relative"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                India&apos;s Most Advanced News Intelligence Platform
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                Master{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                    Current Affairs
                  </span>
                </span>
                <br />
                Through AI Intelligence
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Experience news through multiple expert perspectives. Practice
                with advanced AI debates, engage in intelligent discussions, and
                achieve excellence in competitive exams.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.4)",
                  y: -3,
                }}
                onClick={() => handleClick("auth/login")}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl shadow-red-500/25 flex items-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                Start Exploring
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick("demo")}
                className="group bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-red-300 hover:text-red-600 hover:shadow-xl transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Enhanced Hero Stats */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group text-center relative"
                >
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      <stat.icon
                        className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Revolutionary Features
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Next-Generation Learning Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by advanced AI technology to transform how you consume
              news and master competitive exams
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {featuresShowcase.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-100/50 backdrop-blur-sm"
              >
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Floating Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute top-6 left-6 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/20"
                  >
                    <feature.icon className="w-8 h-8 text-gray-700" />
                  </motion.div>

                  {/* Stats Pills */}
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    {feature.stats.map((stat) => (
                      <span
                        key={stat}
                        className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full border border-white/20"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute top-6 right-6 px-4 py-2 bg-gradient-to-r ${feature.gradient} text-white rounded-full text-sm font-semibold shadow-lg opacity-90`}
                  >
                    Latest AI
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {feature.description}
                  </p>
                  {/* <motion.button
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors group-hover:text-red-700"
                  >
                    Explore Feature
                    <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button> */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Comprehensive Success Toolkit
              </h2>
              <p className="text-lg text-gray-600">
                Every tool you need to excel in competitive exams, powered by
                cutting-edge AI technology
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                transition={{ delay: feature.delay }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100/50 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute bottom-6 right-6 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section
        id="success-stories"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-full text-green-700 text-sm font-semibold mb-6"
            >
              <Award className="w-4 h-4 mr-2" />
              Success Stories
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Proven Results from Top Achievers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful candidates who chose Doutya for their
              journey to excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100/50 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-100 group-hover:ring-red-200 transition-all duration-300"
                      />
                      {testimonial.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-red-600 font-medium text-sm">
                        {testimonial.role}
                      </p>
                      <div className="flex mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 leading-relaxed italic mb-6 text-lg group-hover:text-gray-900 transition-colors duration-300">
                    {` "${testimonial.content}"`}
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-sm font-semibold rounded-xl border border-green-200/50">
                      <Award className="w-4 h-4 mr-2" />
                      {testimonial.exam}
                    </div>
                    {testimonial.verified && (
                      <div className="text-xs text-gray-500 font-medium">
                        ✓ Verified Success
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 bg-gradient-to-b from-gray-50/50 to-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-6"
            >
              <MousePointer className="w-4 h-4 mr-2" />
              Flexible Pricing
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Plans Designed for Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan that matches your preparation intensity
              and career goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className={`bg-gradient-to-br ${plan.gradient} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 border-2 ${plan.borderColor} relative overflow-visible group`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-[9999]"
                  >
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </motion.div>
                )}

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <plan.icon className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                    <h3 className={`text-2xl font-bold ${plan.textColor} mb-2`}>
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="flex items-end justify-center mb-6">
                      <span className={`text-5xl font-bold ${plan.textColor}`}>
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2 text-lg">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                        className="flex items-center"
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${plan.buttonStyle} shadow-lg hover:shadow-xl relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    Choose {plan.name}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Join 50,000+ Successful Students
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Join thousands of successful candidates who chose Doutya. Start
              your journey to excellence today with our comprehensive AI-powered
              preparation platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.25)",
                  y: -3,
                }}
                onClick={() => handleClick("auth/login")}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-red-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl flex items-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                Start Exploring
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick("demo")}
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <BookOpen className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModernDoutyaLanding;
