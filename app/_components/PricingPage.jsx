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
  FolderOpen,
  FileText,
  Tag,
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
        "Save up to 25 articles",
        "Organize with folders",
        "View global trending articles",
        "Basic current affairs coverage",
        "Mobile app access",
        "Community forum access",
      ],
      limitations: [
        "No personal notes",
        "No exam-specific trending",
        "Limited article saves (25 max)",
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
        "Save up to 75 articles",
        "Organize with folders",
        "Add personal notes",
        "View global + your exam trending",
        "Complete current affairs coverage",
        "Weekly detailed analysis",
        "Priority support",
        "Exam-specific content curation",
      ],
      limitations: ["Limited to 75 article saves"],
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
        "Unlimited article saves",
        "Organize with folders + tags",
        "Add personal notes",
        "View global + all exams trending",
        "AI-powered study recommendations",
        "Premium global affairs tracking",
        "Advanced analytics dashboard",
        "Personal study planner",
        "Expert-curated content",
        "Priority customer support",
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
      question: "What does 'Your Exam' trending mean?",
      answer:
        "This shows the most saved articles specifically by students preparing for your chosen exam type (UPSC, SSC, Banking, etc.). It helps you focus on what's most relevant for your specific preparation.",
    },
    {
      question: "How do tags work in the Elite plan?",
      answer:
        "Tags allow you to categorize your saved articles with custom labels like 'Environment', 'Economy', 'Current Affairs', etc. This makes finding and organizing your study material much easier.",
    },
    {
      question: "Can I add personal notes to articles?",
      answer:
        "Personal notes are available in Pro and Elite plans. You can add your own insights, important points, and study notes to any saved article for better revision.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets including Paytm, PhonePe, and Google Pay.",
    },
  ];

  const testimonials = [
    {
      name: "Rahul Verma",
      role: "Civil Services 2023 - Rank 23",
      content:
        "The Pro plan was perfect for my civil services preparation. Being able to see UPSC-specific trending articles helped me focus on what mattered most.",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      plan: "Pro",
    },

    {
      name: "Karthik Kumar",
      role: "Defense Services Qualified 2023",
      content:
        "Started with Starter plan to test the waters. The global trending articles alone were so helpful that I upgraded to Pro within a month.",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      plan: "Pro",
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
                Choose what you need: save a few, go deeper, or get full prep—no
                distractions, no hidden costs.
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
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              What You Get
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
                      feature: "Save articles",
                      starter: "Up to 25",
                      pro: "Up to 75",
                      elite: "Unlimited",
                    },
                    {
                      feature: "Organize with folders",
                      starter: "✓",
                      pro: "✓",
                      elite: "✓ + Tags",
                    },
                    {
                      feature: "Add personal notes",
                      starter: "✗",
                      pro: "✓",
                      elite: "✓",
                    },
                    {
                      feature: "View most saved articles (trending)",
                      starter: "Global only",
                      pro: "Global + Your Exam",
                      elite: "Global + All Exams",
                    },

                    {
                      feature: "AI Recommendations",
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
    </div>
  );
};

export default PricingPage;
