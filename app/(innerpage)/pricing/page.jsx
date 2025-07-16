"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Crown,
  Star,
  ArrowRight,
  Users,
  Clock,
  BookOpen,
  Globe,
  Target,
  Award,
  Shield,
  Zap,
  Eye,
  Calendar,
  Download,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Newspaper,
  TrendingUp,
  MapPin,
  Bookmark,
  Brain,
  Lightbulb,
  Filter,
  BarChart3,
} from "lucide-react";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [activeTab, setActiveTab] = useState("features");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const plans = [
    {
      name: "Starter",
      price: 29.99,
      yearlyPrice: 299.99,
      description:
        "Perfect for beginners starting their competitive exam journey",
      popular: false,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: BookOpen,
      features: [
        "Basic current affairs coverage",
        "2 perspectives per news",
        "Monthly analysis reports",
        "Basic study notes",
        "Mobile app access",
        "Community forum access",
        "Email support",
      ],
      limitations: [
        "Limited to 50 articles/month",
        "No premium insights",
        "Standard support response",
      ],
    },
    {
      name: "Pro",
      price: 49.99,
      yearlyPrice: 499.99,
      description: "Most popular choice for serious competitive exam aspirants",
      popular: true,
      color: "from-red-500 to-orange-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      icon: Target,
      features: [
        "Complete current affairs coverage",
        "4 perspectives per news",
        "Weekly detailed analysis",
        "Advanced study notes with tags",
        "Global affairs map access",
        "Trending topics dashboard",
        "Custom folder organization",
        "Priority support",
        "Exam-specific content curation",
      ],
      limitations: [
        "Limited to 200 articles/month",
        "Standard download limits",
      ],
    },
    {
      name: "Elite",
      price: 99.99,
      yearlyPrice: 999.99,
      description:
        "Ultimate package for civil services & defense exam aspirants",
      popular: false,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      icon: Crown,
      features: [
        "Unlimited current affairs access",
        "All 4+ perspectives per news",
        "Daily analysis & insights",
        "AI-powered study recommendations",
        "Premium global affairs tracking",
        "Advanced analytics dashboard",
        "Unlimited custom folders",
        "Personal study planner",
        "Expert-curated content",
        "Priority customer support",
        "Offline reading capability",
        "Custom alerts & notifications",
        "Interview preparation content",
      ],
      limitations: [],
    },
  ];

  const faqs = [
    {
      question: "How does the perspective-based learning work?",
      answer:
        "Each news article is analyzed from multiple viewpoints - Environmental, Political, Economic, and Social. This helps you understand the complete picture and develop a well-rounded perspective essential for competitive exam interviews and answer writing.",
    },
    {
      question: "Can I switch between plans anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at your next billing cycle.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "We offer a 7-day free trial for new users to explore all features. No credit card required to start your trial.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets including Paytm, PhonePe, and Google Pay.",
    },
    {
      question: "How often is the content updated?",
      answer:
        "Our content is updated multiple times daily. We track news from over 500+ sources and provide real-time analysis to keep you updated with the latest developments.",
    },
  ];

  const testimonials = [
    {
      name: "Rahul Verma",
      role: "Civil Services 2023 - Rank 23",
      content:
        "The Pro plan was perfect for my civil services preparation. The multiple perspectives helped me ace the interview round.",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      plan: "Pro",
    },
    {
      name: "Ananya Singh",
      role: "Foreign Service Officer 2023",
      content:
        "Elite plan's global affairs tracking was invaluable for my diplomatic services preparation. Worth every penny!",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      plan: "Elite",
    },
    {
      name: "Karthik Kumar",
      role: "Defense Services Qualified 2023",
      content:
        "Started with Starter plan and upgraded to Pro. Great value for comprehensive current affairs.",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      plan: "Starter",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const getDiscountPercentage = (monthly, yearly) => {
    const monthlyTotal = monthly * 12;
    const savings = monthlyTotal - yearly;
    return Math.round((savings / monthlyTotal) * 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Doutya
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm lg:text-base"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm lg:text-base"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm lg:text-base"
              >
                FAQ
              </a>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-xl lg:rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold text-sm lg:text-base"
              >
                Start Free Trial
              </motion.button>
            </div>

            {/* Mobile CTA */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm"
              >
                Start Trial
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16  px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-red-700 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  Choose Your Competitive Exam Success Plan
                </span>
                <span className="sm:hidden">Exam Success Plan</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Plans That Respect Your 
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                 Time and Your Budget
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
                Choose what you need: save a few, go deeper, or get full prep—no distractions, no hidden costs.
              </p>
            </motion.div>

            {/* Billing Toggle */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center mb-8 sm:mb-12"
            >
              <div className="bg-gray-100 p-1 rounded-xl sm:rounded-2xl">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                    billingCycle === "monthly"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 relative text-sm sm:text-base ${
                    billingCycle === "yearly"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Yearly
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-green-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? "border-red-300 lg:scale-105 z-10"
                    : plan.borderColor
                } ${plan.popular ? "ring-2 sm:ring-4 ring-red-100" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${plan.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                  >
                    <plan.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                    {plan.description}
                  </p>

                  <div className="mb-2 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      ₹
                      {billingCycle === "monthly"
                        ? plan.price
                        : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm sm:text-base">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-xs sm:text-sm text-green-600 font-semibold">
                      Save {getDiscountPercentage(plan.price, plan.yearlyPrice)}
                      % annually
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="mb-6 sm:mb-8">
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li
                        key={limitIndex}
                        className="flex items-start opacity-60"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-500">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
                    plan.popular
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section
        id="features"
        className="py-6 sm:py-8 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Detailed Comparison
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Compare Plans
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              See exactly what&apos;s included in each plan to make the best
              choice for your exam preparation.
            </p>
          </motion.div>

          {/* Mobile-friendly Comparison */}
          <div className="block lg:hidden">
            <div className="space-y-4">
              {plans.map((plan, planIndex) => (
                <div
                  key={plan.name}
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ₹
                      {billingCycle === "monthly"
                        ? plan.price
                        : plan.yearlyPrice}
                      <span className="text-sm text-gray-600 ml-1">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Comparison Table */}
          <div className="hidden lg:block bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">
                      Features
                    </th>
                    <th className="text-center p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">
                      Starter
                    </th>
                    <th className="text-center p-4 sm:p-6 font-semibold text-gray-900 bg-red-50 border-x-2 border-red-200 text-sm sm:text-base">
                      Pro
                      <span className="block text-xs text-red-600 font-normal mt-1">
                        Most Popular
                      </span>
                    </th>
                    <th className="text-center p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">
                      Elite
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Current Affairs Coverage",
                      starter: "Basic",
                      pro: "Complete",
                      elite: "Unlimited",
                    },
                    {
                      feature: "Perspectives per News",
                      starter: "2",
                      pro: "4",
                      elite: "4+",
                    },
                    {
                      feature: "Monthly Analysis Reports",
                      starter: "✓",
                      pro: "Weekly",
                      elite: "Daily",
                    },
                    {
                      feature: "Global Affairs Map",
                      starter: "✗",
                      pro: "✓",
                      elite: "✓",
                    },
                    {
                      feature: "Custom Folders",
                      starter: "Basic",
                      pro: "Advanced",
                      elite: "Unlimited",
                    },
                    {
                      feature: "AI Recommendations",
                      starter: "✗",
                      pro: "✗",
                      elite: "✓",
                    },
                    {
                      feature: "Offline Reading",
                      starter: "✗",
                      pro: "✗",
                      elite: "✓",
                    },
                    {
                      feature: "Priority Support",
                      starter: "✗",
                      pro: "✓",
                      elite: "✓",
                    },
                    {
                      feature: "Interview Prep Content",
                      starter: "✗",
                      pro: "✗",
                      elite: "✓",
                    },
                  ].map((row, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="p-4 sm:p-6 font-medium text-gray-900 text-sm sm:text-base">
                        {row.feature}
                      </td>
                      <td className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">
                        {row.starter}
                      </td>
                      <td className="p-4 sm:p-6 text-center text-gray-600 bg-red-50 border-x border-red-100 font-semibold text-sm sm:text-base">
                        {row.pro}
                      </td>
                      <td className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">
                        {row.elite}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Success Stories
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Trusted by Toppers
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-3 sm:mb-4">
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

                <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  {`"${testimonial.content}"`}
                </p>

                <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 rounded-full text-xs sm:text-sm font-semibold">
                  <Crown className="w-3 h-3 mr-1" />
                  {testimonial.plan} Plan
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-6 sm:py-8 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Frequently Asked Questions
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Got Questions?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Find answers to common questions about our pricing and features.
            </p>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 leading-relaxed text-sm sm:text-base">
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

      {/* CTA Section */}
      <section className="py-6 sm:py-8 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Start Your Competitive Exam Journey
              <br />
              <span className="text-red-200">Today</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-red-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Join thousands of successful aspirants who chose Doutya for their
              exam preparation. Start with our 7-day free trial.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold hover:bg-white hover:text-red-700 transition-all duration-300"
              >
                View All Features
              </motion.button>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-red-100 text-xs sm:text-sm">
              <div className="flex items-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                5000+ happy users
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 50, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
          />
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
