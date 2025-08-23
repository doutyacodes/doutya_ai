"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Target,
  BookOpen,
  Check,
  X,
  Star,
  CheckCircle,
  ArrowLeft,
  Zap,
  TrendingUp,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Infinity,
  Heart,
  Brain,
  Shield,
  Rocket
} from 'lucide-react';

const UpgradePlanPage = () => {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 29.99,
      yearlyPrice: 299.99,
      description: "Perfect for beginners starting their competitive exam journey",
      shortDesc: "Essential features to get started",
      popular: false,
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      lightGradient: "from-blue-50 to-blue-100",
      accentColor: "blue",
      borderColor: "border-blue-200",
      icon: BookOpen,
      features: [
        "Save up to 25 articles",
        "Organize with folders",
        "View global trending articles",
        "Basic current affairs coverage",
        "Mobile app access",
        "Email support"
      ],
      limitations: [
        "No personal notes",
        "No exam-specific trending",
        "Limited article saves"
      ],
      highlight: "Great for exploration",
    },
    {
      id: "pro",
      name: "Pro",
      price: 49.99,
      yearlyPrice: 499.99,
      description: "Most popular choice for serious competitive exam aspirants",
      shortDesc: "Everything you need to excel",
      popular: true,
      gradient: "from-red-400 via-red-500 to-orange-500",
      lightGradient: "from-red-50 to-orange-100",
      accentColor: "red",
      borderColor: "border-red-200",
      icon: Target,
      features: [
        "Save up to 75 articles",
        "Personal notes & insights",
        "Exam-specific trending",
        "Weekly analysis reports",
        "Priority support",
        "Advanced search filters",
        "Bookmark collections",
        "Study progress tracking"
      ],
      limitations: ["Limited to 75 article saves"],
      highlight: "Most popular choice",
    },
    {
      id: "elite",
      name: "Elite",
      price: 99.99,
      yearlyPrice: 999.99,
      description: "Ultimate package for civil services & defense exam aspirants",
      shortDesc: "Unlimited power for serious aspirants",
      popular: false,
      gradient: "from-purple-400 via-purple-500 to-indigo-600",
      lightGradient: "from-purple-50 to-indigo-100",
      accentColor: "purple",
      borderColor: "border-purple-200",
      icon: Crown,
      features: [
        "Unlimited article saves",
        "AI-powered recommendations",
        "All exam trending insights",
        "Expert-curated content",
        "Advanced analytics",
        "Custom study plans",
        "1-on-1 support sessions",
        "Early access to features"
      ],
      limitations: [],
      highlight: "Ultimate experience",
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

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Try both API endpoints
      let response = await fetch('/api/user/plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If first endpoint fails, try the upgrade endpoint with GET
      if (!response.ok) {
        response = await fetch('/api/user/upgrade-plan', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data); // Debug log
        
        // Handle different response structures - check all possible locations
        const plan = data.current_plan || data.plan || data.user?.plan || data.user?.current_plan || 'starter';
        const user = data.user || data;
        
        console.log('Extracted plan:', plan); // Debug log
        
        setCurrentPlan(plan);
        setUserInfo(user);
        setSelectedPlan(plan);
      } else {
        console.error('Failed to fetch plan:', response.status);
        toast.error('Failed to fetch current plan');
        // Set default values instead of redirecting
        setCurrentPlan('starter');
        setSelectedPlan('starter');
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
      toast.error('Failed to fetch current plan');
      // Set default values
      setCurrentPlan('starter');
      setSelectedPlan('starter');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan || selectedPlan === currentPlan) {
      toast.error('Please select a different plan');
      return;
    }

    // Only allow upgrades, no downgrades
    if (isDowngrade(selectedPlan)) {
      toast.error('Downgrades are not allowed. Please wait for your current subscription to expire.');
      return;
    }

    setUpgrading(true);

    try {
      const token = localStorage.getItem('user_token');
      
      // Create payment order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan: selectedPlan,
          billingCycle: billingCycle 
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_R6W8uNyG4waGLz',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Doutya',
        description: `${orderData.planDetails.name} Plan - ${billingCycle}`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: selectedPlan,
                billingCycle: billingCycle,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              if (verifyData.token) {
                localStorage.setItem('user_token', verifyData.token);
              }
              
              toast.success(verifyData.message);
              
              // Use window.location instead of router to avoid logout issues
              setTimeout(() => {
                window.location.href = '/trending';
              }, 2000);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userInfo?.name || userInfo?.first_name || '',
          email: userInfo?.email || '',
          contact: userInfo?.phone || '',
        },
        notes: {
          plan: selectedPlan,
          billing_cycle: billingCycle,
        },
        theme: {
          color: '#DC2626',
        },
        modal: {
          ondismiss: () => {
            setUpgrading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setUpgrading(false);
    }
  };

  const getUpgradeAction = () => {
    const currentIndex = plans.findIndex(p => p.id === currentPlan);
    const selectedIndex = plans.findIndex(p => p.id === selectedPlan);
    
    if (selectedIndex > currentIndex) {
      return 'upgraded';
    } else if (selectedIndex < currentIndex) {
      return 'downgraded';
    }
    return 'changed';
  };

  const getCurrentPlanDetails = () => {
    return plans.find(p => p.id === currentPlan);
  };

  const isUpgrade = (planId) => {
    const currentIndex = plans.findIndex(p => p.id === currentPlan);
    const planIndex = plans.findIndex(p => p.id === planId);
    return planIndex > currentIndex;
  };

  const isDowngrade = (planId) => {
    const currentIndex = plans.findIndex(p => p.id === currentPlan);
    const planIndex = plans.findIndex(p => p.id === planId);
    return planIndex < currentIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-red-400 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading your plans...</p>
        </div>
      </div>
    );
  }

  const currentPlanDetails = getCurrentPlanDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
        }}
      />
      
      {/* Header with Glass Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 mb-4 sm:mb-6 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-gray-200/50 hover:border-gray-300/50 hover:bg-white/80"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium text-sm sm:text-base">Back</span>
              </button>
              
              <div className="text-center">
                <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-200/50 text-red-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Plan Management
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
                  Choose Your Perfect Plan
                </h1>
                <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                  Upgrade, downgrade, or switch plans anytime. No hidden fees, no commitments.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-32">
        {/* Current Plan Showcase */}
        {currentPlanDetails && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-8 sm:mb-16"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">Your Current Plan</h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/50 p-4 sm:p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-16 sm:translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-tr from-green-400/10 to-emerald-500/10 rounded-full translate-y-10 -translate-x-10 sm:translate-y-20 sm:-translate-x-20"></div>
                
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${currentPlanDetails.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                        <currentPlanDetails.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{currentPlanDetails.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600">{currentPlanDetails.shortDesc}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Active Plan
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ₹{currentPlanDetails.price}
                        <span className="text-sm sm:text-lg text-gray-600 font-normal">/month</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                    {currentPlanDetails.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Plans */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 sm:mb-12"
        >
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Available Plans</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4 mb-6">Choose the plan that best fits your preparation needs</p>
            
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
              <div className="relative bg-gray-100 rounded-full p-1 shadow-inner">
                <div className={`absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300 ${
                  billingCycle === 'monthly' ? 'left-1 right-1/2' : 'left-1/2 right-1'
                }`}></div>
                <div className="relative flex">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                      billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 text-sm font-medium transition-colors duration-300 rounded-full flex items-center gap-1 ${
                      billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Yearly
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      Save 17%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                onClick={() => plan.id !== currentPlan && !isDowngrade(plan.id) && setSelectedPlan(plan.id)}
                className={`relative group ${
                  plan.id === currentPlan 
                    ? 'cursor-default' 
                    : isDowngrade(plan.id) 
                    ? 'cursor-not-allowed opacity-60' 
                    : 'cursor-pointer'
                }`}
              >
                {/* Card Container */}
                <div className={`relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border transition-all duration-500 overflow-hidden ${
                  plan.id === currentPlan
                    ? "border-green-300/50 ring-2 sm:ring-4 ring-green-100/50"
                    : plan.popular
                    ? "border-red-300/50 ring-2 sm:ring-4 ring-red-100/50 lg:scale-105"
                    : selectedPlan === plan.id
                    ? "border-red-400/50 ring-2 sm:ring-4 ring-red-200/50 shadow-xl sm:shadow-2xl"
                    : "border-gray-200/50 hover:border-gray-300/50 hover:shadow-xl"
                }`}>
                  
                  {/* Background Gradient Effects */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.lightGradient} opacity-30 ${
                    hoveredPlan === plan.id ? 'opacity-50' : ''
                  } transition-opacity duration-500`}></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-6 translate-x-6 sm:-translate-y-12 sm:translate-x-12"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8 sm:translate-y-16 sm:-translate-x-16"></div>

                  {/* Top Labels */}
                  <div className="relative p-4 sm:p-8">
                    {plan.id === currentPlan && (
                      <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Current Plan
                        </div>
                      </div>
                    )}
                    
                    {plan.popular && plan.id !== currentPlan && (
                      <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Plan Type Indicator */}
                    {plan.id !== currentPlan && (
                      <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                        {isUpgrade(plan.id) && (
                          <div className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Upgrade</span>
                          </div>
                        )}
                        {isDowngrade(plan.id) && (
                          <div className="bg-gray-400 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                            <span className="hidden sm:inline">Not Available</span>
                            <span className="sm:hidden">N/A</span>
                          </div>
                        )}
                        {selectedPlan === plan.id && (
                          <div className="bg-red-600 rounded-full p-1 sm:p-1.5 shadow-lg">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6 sm:mb-8 pt-2 sm:pt-4">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${plan.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg ${
                        hoveredPlan === plan.id ? 'scale-105 sm:scale-110 shadow-xl' : ''
                      } transition-all duration-300`}>
                        <plan.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{plan.name}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-2 px-2">{plan.shortDesc}</p>
                      <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.accentColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                        plan.accentColor === 'red' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {plan.highlight}
                      </div>

                      <div className="mt-4 sm:mt-6">
                        <span className="text-2xl sm:text-4xl font-bold text-gray-900">
                          ₹{billingCycle === 'yearly' ? plan.yearlyPrice : plan.price}
                        </span>
                        <span className="text-sm sm:text-base text-gray-600 ml-1 sm:ml-2">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                        {billingCycle === 'yearly' && (
                          <div className="text-xs text-green-600 mt-1">
                            Save ₹{((plan.price * 12) - plan.yearlyPrice).toFixed(2)} annually
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
                      {plan.features.slice(0, 6).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.length > 0 && (
                        <div className="flex items-start gap-2 sm:gap-3 opacity-60">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500 leading-relaxed">{plan.limitations[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {plan.id === currentPlan ? (
                      <div className="text-center">
                        <div className="bg-green-100 text-green-800 py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base">
                          Your Current Plan
                        </div>
                      </div>
                    ) : isDowngrade(plan.id) ? (
                      <div className="text-center">
                        <div className="text-xs sm:text-sm font-semibold mb-2 px-2 text-gray-500">
                          Wait for current plan to expire
                        </div>
                        <div className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base bg-gray-200 text-gray-500 cursor-not-allowed">
                          Not Available
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xs sm:text-sm font-semibold mb-2 px-2 text-blue-600">
                          Upgrade to unlock more features
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                            selectedPlan === plan.id
                              ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Plan Change Confirmation - Fixed Bottom */}
        <AnimatePresence>
          {selectedPlan && selectedPlan !== currentPlan && !isDowngrade(selectedPlan) && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-gradient-to-t from-black/10 to-transparent"
            >
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-purple-500/5 to-blue-500/5"></div>
                  
                  <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full lg:w-auto">
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">From</div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{currentPlanDetails?.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          ₹{billingCycle === 'yearly' ? currentPlanDetails?.yearlyPrice : currentPlanDetails?.price}/{billingCycle === 'yearly' ? 'yr' : 'mo'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3">
                        <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                        <div className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                          Upgrade
                        </div>
                        <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">To</div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{plans.find(p => p.id === selectedPlan)?.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          ₹{billingCycle === 'yearly' ? plans.find(p => p.id === selectedPlan)?.yearlyPrice : plans.find(p => p.id === selectedPlan)?.price}/{billingCycle === 'yearly' ? 'yr' : 'mo'}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">Billing</div>
                        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {billingCycle}
                          {billingCycle === 'yearly' && (
                            <span className="text-green-600 ml-1">Save 17%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto">
                      <button
                        onClick={() => setSelectedPlan(currentPlan)}
                        className="flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={upgrading}
                        className={`flex-1 lg:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                          upgrading
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {upgrading ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Processing...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Pay & Upgrade</span>
                            <span className="sm:hidden">Pay Now</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UpgradePlanPage;