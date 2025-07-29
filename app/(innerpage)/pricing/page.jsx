"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Crown,
  MessageCircle,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const EnhancedPricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [activeTab, setActiveTab] = useState("features");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const plans = [
    {
      name: "Starter",
      price: 29,
      yearlyPrice: 299,
      originalYearlyPrice: 348,
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
        "Multi-perspective news analysis",
        "Basic current affairs coverage",
        "Mobile app access",
        "Email support",
      ],
      limitations: [
        "No personal notes",
        "No exam-specific trending",
        "No AI chat access",
        "No AI debate features",
        "Limited to 25 article saves",
      ],
      cta: "Start Free Trial",
      highlight: "Great for exploration",
    },
    {
      name: "Pro",
      price: 49,
      yearlyPrice: 499,
      originalYearlyPrice: 588,
      description: "Most popular choice for serious competitive exam aspirants",
      popular: true,
      color: "from-red-500 to-orange-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      icon: Target,
      features: [
        "Save up to 100 articles",
        "Organize with unlimited folders",
        "Add personal notes & annotations",
        "View global + your exam trending",
        "Complete current affairs coverage",
        "AI chat with personalities",
        "Basic AI debate practice",
        "Priority support",
        "Exam-specific content curation",
        "Advanced search & filters",
        "Export articles as PDF",
      ],
      limitations: [
        "Limited to 100 article saves",
        "No custom debates",
        "No advanced AI features",
      ],
      cta: "Start Pro Trial",
      highlight: "Most popular choice",
    },
    {
      name: "Elite",
      price: 99,
      yearlyPrice: 999,
      originalYearlyPrice: 1188,
      description:
        "Ultimate package for civil services & defense exam aspirants",
      popular: false,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      icon: Crown,
      features: [
        "Unlimited article saves",
        "Unlimited folders & organization",
        "Advanced personal notes & tags",
        "View global + all exams trending",
        "AI-powered study recommendations",
        "Full AI chat access",
        "Complete AI debate suite",
        "Create custom debates",
        "Premium global affairs tracking",
        "Expert-curated content",
        "24/7 priority customer support",
        "Advanced analytics & insights",
        "Custom study plans",
        "Interview preparation tools",
        "Group discussion practice",
      ],
      limitations: [],
      cta: "Start Elite Trial",
      highlight: "Ultimate preparation",
    },
  ];

  const featureComparison = [
    {
      category: "Content & Organization",
      features: [
        {
          name: "Article Saves",
          starter: "25 articles",
          pro: "100 articles",
          elite: "Unlimited",
        },
        {
          name: "Folders & Organization",
          starter: "✓",
          pro: "✓ Unlimited",
          elite: "✓ Advanced",
        },
        {
          name: "Personal Notes",
          starter: "✗",
          pro: "✓ Basic",
          elite: "✓ Advanced with Tags",
        },
        {
          name: "PDF Export",
          starter: "✗",
          pro: "✓",
          elite: "✓ Enhanced",
        },
      ],
    },
    {
      category: "News & Analysis",
      features: [
        {
          name: "Multi-perspective Analysis",
          starter: "✓",
          pro: "✓",
          elite: "✓",
        },
        {
          name: "Trending Articles",
          starter: "Global only",
          pro: "Global + Your Exam",
          elite: "Global + All Exams",
        },
        {
          name: "Advanced Search & Filters",
          starter: "Basic",
          pro: "✓",
          elite: "✓ AI-Powered",
        },
        {
          name: "Current Affairs Coverage",
          starter: "Basic",
          pro: "Complete",
          elite: "Premium + Predictions",
        },
      ],
    },
    {
      category: "AI Features",
      features: [
        {
          name: "AI Chat with Personalities",
          starter: "✗",
          pro: "✓ Limited",
          elite: "✓ Full Access",
        },
        {
          name: "AI Debate Practice",
          starter: "✗",
          pro: "✓ Basic",
          elite: "✓ Complete Suite",
        },
        {
          name: "Custom Debates",
          starter: "✗",
          pro: "✗",
          elite: "✓",
        },
        {
          name: "AI Study Recommendations",
          starter: "✗",
          pro: "✗",
          elite: "✓",
        },
      ],
    },
    {
      category: "Exam Preparation",
      features: [
        {
          name: "Exam-specific Content",
          starter: "Basic",
          pro: "✓ Your Exam",
          elite: "✓ All Exams",
        },
        {
          name: "Interview Preparation",
          starter: "✗",
          pro: "Basic",
          elite: "✓ Advanced",
        },
        {
          name: "Group Discussion Practice",
          starter: "✗",
          pro: "✗",
          elite: "✓",
        },
        {
          name: "Custom Study Plans",
          starter: "✗",
          pro: "✗",
          elite: "✓",
        },
      ],
    },
    {
      category: "Support & Analytics",
      features: [
        {
          name: "Customer Support",
          starter: "Email",
          pro: "Priority",
          elite: "24/7 Premium",
        },
        {
          name: "Analytics & Insights",
          starter: "Basic",
          pro: "Standard",
          elite: "✓ Advanced",
        },
        {
          name: "Mobile App",
          starter: "✓",
          pro: "✓",
          elite: "✓ Enhanced",
        },
      ],
    },
  ];

  const faqs = [
    {
      question: "How does the multi-perspective analysis work?",
      answer:
        "Each news article is analyzed from multiple viewpoints - Environmental, Political, Economic, and Social. This helps you understand the complete picture and develop a well-rounded perspective essential for competitive exam interviews and answer writing.",
    },
    {
      question: "What are AI debates and how do they help?",
      answer:
        "Our AI debate feature lets you practice argumentation with AI opponents in three formats: User vs AI, AI vs AI (watch debates), and MCQ debates. This helps improve your logical thinking, argument construction, and prepares you for group discussions and interviews.",
    },
    {
      question: "Can I create custom debates in Elite plan?",
      answer:
        "Yes! Elite members can create custom debate topics on any subject. The AI will take opposing stances and engage in structured debates, helping you practice specific topics relevant to your exam or interests.",
    },
    {
      question: "What does 'Your Exam' trending mean?",
      answer:
        "This shows the most saved articles specifically by students preparing for your chosen exam type (UPSC, SSC, Banking, etc.). It helps you focus on what's most relevant and trending among your peer aspirants.",
    },
    {
      question: "How do AI chat personalities work?",
      answer:
        "Our AI chat feature includes different personalities (like a Political Analyst, Environmental Expert, etc.) that you can engage with on current topics. This helps you understand various perspectives and practice for group discussions.",
    },
    {
      question: "Can I switch between plans anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at your next billing cycle.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! All plans come with a 7-day free trial. You can explore all features during the trial period and decide which plan works best for your preparation needs.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets including Paytm, PhonePe, and Google Pay. All payments are processed securely.",
    },
  ];

  const testimonials = [
    {
      name: "Rahul Verma",
      role: "Civil Services 2023 - Rank 23",
      exam: "UPSC",
      content:
        "The Pro plan was perfect for my civil services preparation. The AI debates helped me practice for interview rounds, and exam-specific trending kept me focused on what mattered most.",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      plan: "Pro",
    },
    {
      name: "Captain Priya Singh",
      role: "CDS 2023 - Recommended",
      exam: "Defense",
      content:
        "Elite plan's custom debates and group discussion practice were game-changers for my SSB preparation. The AI analysis gave me perspectives I never considered.",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
      plan: "Elite",
    },
    {
      name: "Karthik Kumar",
      role: "Banking Services - Selected",
      exam: "Banking",
      content:
        "Started with Starter plan to test the waters. The global trending articles alone were so helpful that I upgraded to Pro within a month. Multi-perspective analysis is brilliant!",
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

  const getDiscountPercentage = (monthly, yearly, originalYearly) => {
    const savings = originalYearly - yearly;
    return Math.round((savings / originalYearly) * 100);
  };

  const tabs = [
    { id: "features", label: "Feature Comparison", icon: BarChart3 },
    { id: "testimonials", label: "Success Stories", icon: Trophy },
    { id: "faq", label: "FAQ", icon: MessageCircle },
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-red-700 rounded-full text-sm font-semibold mb-6">
              <Crown className="w-4 h-4 mr-2" />
              Choose Your Success Plan
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Plans That Respect Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Time and Your Budget
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              From basic exploration to comprehensive exam preparation with
              AI-powered features. Start free, upgrade when you need more power.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center mb-12"
          >
            <div className="bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                  billingCycle === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 15%
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl border-2 p-8 transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? "border-red-300 lg:scale-105 z-10 ring-4 ring-red-100"
                  : plan.borderColor
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹
                    {billingCycle === "monthly" ? plan.price : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                {billingCycle === "yearly" && (
                  <div className="space-y-1">
                    <div className="text-sm text-green-600 font-semibold">
                      Save{" "}
                      {getDiscountPercentage(
                        plan.price,
                        plan.yearlyPrice,
                        plan.originalYearlyPrice
                      )}
                      % annually
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="line-through">
                        ₹{plan.originalYearlyPrice}
                      </span>
                      <span className="ml-2 text-green-600 font-semibold">
                        Save ₹{plan.originalYearlyPrice - plan.yearlyPrice}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-sm text-blue-600 font-medium mt-2">
                  {plan.highlight}
                </div>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">
                  What&apos;s included:
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-500 mb-3">
                      Not included:
                    </h5>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li
                          key={limitIndex}
                          className="flex items-start opacity-60"
                        >
                          <X className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  plan.popular
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  7-day free trial • No credit card required
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center mb-12">
          <div className="bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "features" && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile-friendly Feature Comparison */}
              <div className="block lg:hidden space-y-6">
                {featureComparison.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">
                          {categoryIndex + 1}
                        </span>
                      </div>
                      {category.category}
                    </h3>
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="mb-6 last:mb-0">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {feature.name}
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              Starter
                            </div>
                            <div className="text-sm font-semibold text-gray-700">
                              {feature.starter}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              Pro
                            </div>
                            <div className="text-sm font-semibold text-red-600">
                              {feature.pro}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              Elite
                            </div>
                            <div className="text-sm font-semibold text-purple-600">
                              {feature.elite}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Desktop Feature Comparison */}
              <div className="hidden lg:block bg-white rounded-3xl shadow-xl overflow-hidden">
                {featureComparison.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">
                            {categoryIndex + 1}
                          </span>
                        </div>
                        {category.category}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-6 font-semibold text-gray-900">
                              Feature
                            </th>
                            <th className="text-center p-6 font-semibold text-gray-900">
                              Starter
                            </th>
                            <th className="text-center p-6 font-semibold text-gray-900 bg-red-50 border-x-2 border-red-200">
                              Pro
                              <span className="block text-xs text-red-600 font-normal mt-1">
                                Most Popular
                              </span>
                            </th>
                            <th className="text-center p-6 font-semibold text-gray-900">
                              Elite
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.features.map((feature, featureIndex) => (
                            <tr
                              key={featureIndex}
                              className="border-t border-gray-100"
                            >
                              <td className="p-6 font-medium text-gray-900">
                                {feature.name}
                              </td>
                              <td className="p-6 text-center text-gray-600">
                                {feature.starter}
                              </td>
                              <td className="p-6 text-center text-gray-600 bg-red-50 border-x border-red-100 font-semibold">
                                {feature.pro}
                              </td>
                              <td className="p-6 text-center text-gray-600">
                                {feature.elite}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "testimonials" && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          {testimonial.exam}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          {testimonial.plan} User
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "faq" && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === index ? null : index)
                      }
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4 text-lg">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-6 h-6 text-gray-500 flex-shrink-0" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200"
                        >
                          <div className="px-8 py-6 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Secure Payments</h4>
              <p className="text-sm text-gray-600">256-bit SSL encryption</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">7-Day Free Trial</h4>
              <p className="text-sm text-gray-600">No credit card required</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">10K+ Users</h4>
              <p className="text-sm text-gray-600">Trusted by aspirants</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Success Stories</h4>
              <p className="text-sm text-gray-600">100+ selections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPricingPage;
