"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Book,
  Brain,
  CheckCircle,
  ChevronDown,
  CreditCard,
  Globe,
  HelpCircle,
  Mail,
  MessageSquare,
  MousePointer,
  Phone,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState([]);

  const categories = [
    { id: "all", name: "All", icon: Book },
    { id: "general", name: "General", icon: HelpCircle },
    { id: "features", name: "Features", icon: Zap },
    { id: "pricing", name: "Pricing", icon: CreditCard },
    { id: "account", name: "Account", icon: Settings },
    { id: "privacy", name: "Privacy", icon: Shield },
    { id: "technical", name: "Technical", icon: Brain },
  ];

  const faqData = [
    {
      id: 1,
      category: "general",
      question: "What is Doutya and how does it work?",
      answer:
        "Doutya is an AI-powered news platform that provides multi-perspective analysis of global events. Our advanced AI algorithms analyze news stories from multiple sources and viewpoints, presenting neutral, aligned, differing, and opposing perspectives to help readers understand the complete picture of any story.",
      popular: true,
    },
    {
      id: 2,
      category: "general",
      question: "How is Doutya different from other news platforms?",
      answer:
        "Unlike traditional news platforms that often present single perspectives, Doutya uses AI to analyze and present multiple viewpoints on every story. This helps readers break out of echo chambers and gain a comprehensive understanding of complex issues.",
      popular: true,
    },
    {
      id: 3,
      category: "features",
      question: "What are AI Debates and how do they work?",
      answer:
        "AI Debates allow you to engage in discussions with different AI personalities (Scholar, Advocate, Skeptic, Visionary) on various topics. Each AI has distinct characteristics and approaches to argumentation, providing diverse perspectives on the subjects you want to explore.",
      popular: true,
    },
    {
      id: 4,
      category: "features",
      question: "Can I save articles and create personal folders?",
      answer:
        "Yes! Pro and Elite members can save articles, create custom folders, and organize their content for future reference. You can also add personal notes to saved articles and share your collections with others.",
      popular: false,
    },
    {
      id: 5,
      category: "features",
      question: "What is the News Map feature?",
      answer:
        "Our interactive News Map visualizes global events geographically, allowing you to explore news by location. You can see trending stories in different regions, understand local perspectives, and track how events spread across different areas.",
      popular: false,
    },
    {
      id: 6,
      category: "pricing",
      question: "What subscription plans do you offer?",
      answer:
        "We offer three plans: Starter (free with basic features), Pro (₹299/month with AI debates and advanced features), and Elite (₹599/month with unlimited access and premium features). All plans include our core multi-perspective news analysis.",
      popular: true,
    },
    {
      id: 7,
      category: "pricing",
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. Your access to premium features will continue until the end of your current billing period, and you won't be charged for the next cycle.",
      popular: false,
    },
    {
      id: 8,
      category: "pricing",
      question: "Do you offer student discounts?",
      answer:
        "Yes! We offer 50% discounts for students and educational institutions. Contact our support team with valid student ID or institutional email to apply for the discount.",
      popular: false,
    },
    {
      id: 9,
      category: "account",
      question: "How do I create an account?",
      answer:
        'Creating an account is simple! Click "Sign Up" on our homepage, enter your email and create a password. You can also sign up using your Google or social media accounts for faster registration.',
      popular: false,
    },
    {
      id: 10,
      category: "account",
      question: "Can I change my subscription plan?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan anytime from your account dashboard. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.",
      popular: false,
    },
    {
      id: 11,
      category: "privacy",
      question: "How do you protect my personal data?",
      answer:
        "We take privacy seriously and use industry-standard encryption to protect your data. We never sell personal information to third parties and only collect data necessary to improve your experience. Read our Privacy Policy for complete details.",
      popular: true,
    },
    {
      id: 12,
      category: "privacy",
      question: "Do you track my reading habits?",
      answer:
        "We collect anonymous analytics to improve our platform and personalize your experience. You can opt out of tracking in your privacy settings, and we never share individual reading patterns with external parties.",
      popular: false,
    },
    {
      id: 13,
      category: "technical",
      question: "Which devices and browsers are supported?",
      answer:
        "Doutya works on all modern browsers (Chrome, Firefox, Safari, Edge) and devices (desktop, tablet, mobile). We also have mobile apps for iOS and Android. Our platform is optimized for responsive design across all screen sizes.",
      popular: false,
    },
    {
      id: 14,
      category: "technical",
      question: "Is there an API available for developers?",
      answer:
        "We offer API access for Enterprise customers and partners. Our API provides access to our news analysis engine and perspective generation capabilities. Contact our business team to learn more about API access and pricing.",
      popular: false,
    },
    {
      id: 15,
      category: "technical",
      question: "How accurate is your AI analysis?",
      answer:
        "Our AI achieves 99.9% accuracy in source verification and perspective analysis. We continuously train our models on diverse datasets and have human editorial oversight to ensure quality and reduce bias in our analysis.",
      popular: true,
    },
  ];

  const toggleItem = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFAQs = faqData.filter((faq) => faq.popular).slice(0, 6);

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      gradient: "from-red-500 to-red-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      gradient: "from-red-400 to-red-500",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us during business hours",
      action: "Call Now",
      gradient: "from-red-600 to-red-700",
    },
  ];

  const helpfulResources = [
    {
      icon: Book,
      title: "User Guide",
      description: "Comprehensive guide to using Doutya",
    },
    {
      icon: Zap,
      title: "Feature Updates",
      description: "Latest features and improvements",
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other users",
    },
    {
      icon: Globe,
      title: "Status Page",
      description: "Check platform status and updates",
    },
  ];

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen">
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
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-800">
                How Can We
              </span>
              <br />
              <span className="text-gray-900">Help You?</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Find answers to common questions about Doutya&apos;s features,
              pricing, and how our AI-powered platform works.
            </p>

            {/* Search Bar */}
            <motion.div
              className="relative max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 shadow-sm"
              />
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                {
                  number: "95%",
                  label: "Questions Resolved",
                  icon: CheckCircle,
                },
                { number: "<2min", label: "Average Response", icon: Zap },
                {
                  number: "24/7",
                  label: "Support Available",
                  icon: MessageSquare,
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-2xl md:text-3xl font-bold text-red-600">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-6"
            >
              <Star className="w-4 h-4 mr-2 fill-current" />
              Popular Questions
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Most Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The questions our users ask most frequently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="group bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedCategory("all");
                  toggleItem(faq.id);
                }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors text-lg">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-red-600 text-sm font-medium mt-4 group">
                  Read more
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full FAQ Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-6"
            >
              <Book className="w-4 h-4 mr-2" />
              Complete FAQ
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              All Questions & Answers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse by category or search for specific topics
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Category Sidebar */}
            <motion.div
              className="lg:w-80 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl border border-gray-200 p-8 sticky top-8">
                <h3 className="font-bold text-gray-900 mb-8 text-xl">
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 text-left ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm border border-red-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <category.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* FAQ Content */}
            <div className="flex-1">
              <AnimatePresence>
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <motion.button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {faq.popular && (
                            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex-shrink-0">
                              <div className="w-full h-full bg-red-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                          <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors text-lg">
                            {faq.question}
                          </h3>
                        </div>
                        <motion.div
                          animate={{
                            rotate: openItems.includes(faq.id) ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {openItems.includes(faq.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200"
                          >
                            <div className="px-8 py-6">
                              <p className="text-gray-600 leading-relaxed text-lg">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {filteredFAQs.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or browse different categories
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-6"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Get Support
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Need More Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.title}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${option.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <option.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {option.description}
                </p>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px -5px rgba(239, 68, 68, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg shadow-red-500/25"
                >
                  {option.action}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Helpful Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Helpful Resources
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {helpfulResources.map((resource, index) => (
                <motion.a
                  key={resource.title}
                  href="#"
                  className="group bg-white p-8 rounded-3xl hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 border border-gray-200"
                  whileHover={{ scale: 1.02, y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <resource.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h4 className="font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {resource.description}
                  </p>
                  <div className="flex items-center text-red-600 text-sm font-medium group">
                    Learn more
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
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
              Still Have Questions?
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              We&apos;re Here to Help
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Our friendly support team is always ready to help you get the most
              out of Doutya. Don&apos;t hesitate to reach out!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.25)",
                  y: -3,
                }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-red-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl flex items-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Support
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <MousePointer className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
