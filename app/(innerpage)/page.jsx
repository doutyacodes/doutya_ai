"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Brain,
  Check,
  Crown,
  Eye,
  FolderOpen,
  GraduationCap,
  Menu,
  MessageCircle,
  Newspaper,
  Play,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ModernLandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  // Auto-advance feature showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % featuresShowcase.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    router.push("/news");
  };

  const handleViewDemo = () => {
    router.push("/demo");
  };

  // Key platform features based on your schema
  const featuresShowcase = [
    {
      title: "Multi-Perspective News Analysis",
      description: "Same story, different viewpoints. Understand how Environmental experts, Economic analysts, and Political observers see the same event.",
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
      image: "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      title: "AI-Powered Debates",
      description: "Practice your argumentation skills with AI opponents. Choose from User vs AI, AI vs AI, or MCQ debate formats.",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      image: "https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      title: "Smart Chat & Discussions",
      description: "Engage with AI personalities on current topics. Practice for group discussions and interviews.",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500",
      image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      title: "Exam-Specific Preparation",
      description: "Content curated for UPSC, SSC, Banking, Defense, and other competitive exams with trending insights.",
      icon: Target,
      color: "from-red-500 to-orange-500",
      image: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    }
  ];

  const stats = [
    { number: "50K+", label: "Daily Articles", icon: Newspaper },
    { number: "25+", label: "Exam Types", icon: GraduationCap },
    { number: "1M+", label: "Perspectives", icon: Eye },
    { number: "10K+", label: "Active Users", icon: Users }
  ];

  const testimonials = [
    {
      name: "Arjun Patel",
      role: "UPSC CSE 2023 - Rank 47",
      exam: "Civil Services",
      content: "The multi-perspective analysis completely changed how I understood current affairs. The AI debates helped me practice for the interview round.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "SSC CGL 2023 - Selected",
      exam: "SSC",
      content: "The exam-specific trending feature kept me updated with exactly what other SSC aspirants were focusing on. Brilliant concept!",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Captain Rajesh Kumar",
      role: "CDS 2023 - Recommended",
      exam: "Defense",
      content: "Custom debates feature helped me prepare for SSB group discussions. The AI analysis gave insights I never considered.",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Eye,
      title: "Multi-Perspective Analysis",
      description: "Every story from Environmental, Economic, Political, and Social viewpoints",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI Debate Practice",
      description: "Sharpen your arguments with AI opponents in various debate formats",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: MessageCircle,
      title: "Smart Discussions",
      description: "Chat with AI personalities on trending topics and current affairs",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FolderOpen,
      title: "Smart Organization",
      description: "Save, organize, and annotate articles with folders and personal notes",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: TrendingUp,
      title: "Exam-Specific Trending",
      description: "See what other aspirants in your exam category are reading",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Target,
      title: "Focused Preparation",
      description: "Content curated specifically for competitive exam patterns",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "₹29",
      period: "/month",
      description: "Perfect for beginners",
      features: ["25 Article Saves", "Basic Folders", "Global Trending", "Multi-perspective Access"],
      color: "border-blue-200",
      popular: false
    },
    {
      name: "Pro",
      price: "₹49",
      period: "/month",
      description: "Most popular choice",
      features: ["75 Article Saves", "Personal Notes", "Exam-Specific Trending", "AI Chat Access", "Priority Support"],
      color: "border-red-300 ring-2 ring-red-100",
      popular: true
    },
    {
      name: "Elite",
      price: "₹99",
      period: "/month", 
      description: "Ultimate preparation",
      features: ["Unlimited Saves", "Custom Debates", "AI Debate Practice", "All Exam Trending", "Premium Support"],
      color: "border-purple-200",
      popular: false
    }
  ];
const { icon: Icon, color } = featuresShowcase[currentFeature];
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Image src="/images/logo.png" width={150} height={75} alt="Doutya" />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-red-600 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-red-600 transition-colors font-medium">Pricing</a>
              <button 
                onClick={handleViewDemo}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                Demo
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl"
              >
                <div className="px-4 py-6 space-y-4">
                  <a href="#features" className="block py-2 text-gray-600 hover:text-red-600 transition-colors">Features</a>
                  <a href="#pricing" className="block py-2 text-gray-600 hover:text-red-600 transition-colors">Pricing</a>
                  <button onClick={handleViewDemo} className="block py-2 text-gray-600 hover:text-red-600 transition-colors">Demo</button>
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold mt-4"
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-red-700 rounded-full text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Exam Preparation Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Master Current Affairs.
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Ace Every Interview.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-4xl mx-auto">
              India&apos;s most comprehensive current affairs platform with <strong>AI debates</strong>, <strong>multi-perspective analysis</strong>, and <strong>exam-specific preparation</strong> for UPSC, SSC, Banking, Defense & more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDemo}
                className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                10,000+ Active Users
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                25+ Exam Categories
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                AI-Powered Analysis
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Everything You Need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Excel in Competitive Exams
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered debates to multi-perspective analysis, we&apos;ve built the most comprehensive exam preparation platform in India.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Feature Display */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6`}>
  <Icon className="w-8 h-8 text-white" />
</div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuresShowcase[currentFeature].title}
                  </h3>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {featuresShowcase[currentFeature].description}
                  </p>

                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <img 
                      src={featuresShowcase[currentFeature].image}
                      alt={featuresShowcase[currentFeature].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Feature Navigation */}
            <div className="space-y-4">
              {featuresShowcase.map((feature, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-full p-6 rounded-2xl text-left transition-all duration-300 ${
                    currentFeature === index
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-3">
                    <feature.icon className={`w-6 h-6 mr-3 ${currentFeature === index ? 'text-white' : 'text-gray-400'}`} />
                    <h4 className="font-bold text-lg">{feature.title}</h4>
                  </div>
                  <p className={`text-sm ${currentFeature === index ? 'text-white/90' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Trusted by Top
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Rankers Across India
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        {testimonial.exam}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed">{`"{testimonial.content}"`}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
              <Crown className="w-4 h-4 mr-2" />
              Choose Your Plan
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Plans That Fit
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Your Preparation Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free, upgrade when you need more. No hidden costs, no commitments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-3xl p-8 shadow-lg border-2 ${plan.color} ${plan.popular ? 'lg:scale-105' : ''} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Exam Preparation?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join thousands of successful aspirants who&apos;ve already started their journey with India&apos;s most comprehensive current affairs platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Learning Today
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDemo}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Explore Features
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Image src="/images/logo.png" width={150} height={75} alt="Doutya" className="mb-6" />
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                India&apos;s most comprehensive AI-powered current affairs platform, designed specifically for competitive exam aspirants.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "Instagram", "YouTube"].map((social) => (
                  <div key={social} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                    <span className="text-xs">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><button onClick={handleViewDemo} className="hover:text-white transition-colors">Demo</button></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Doutya PrepHelp. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <span>Made in 🇮🇳 India</span>
              <span>•</span>
              <span>For India&apos;s Future Leaders</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLandingPage;