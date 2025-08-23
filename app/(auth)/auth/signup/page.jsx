"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  UserIcon, 
  LockIcon, 
  Phone, 
  UserPlus, 
  ChevronLeft, 
  BookOpen, 
  CheckCircle, 
  Crown,
  Target,
  Star,
  Check,
  X,
  ArrowRight
} from "lucide-react";
import '../styles.css'

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  mobile: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(100),
  confirmPassword: z.string().min(6, { message: "Confirm password is required." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [examTypes, setExamTypes] = useState([]);
  const [loadingExamTypes, setLoadingExamTypes] = useState(true);
  const [filteredExamTypes, setFilteredExamTypes] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [registeredUser, setRegisteredUser] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 29.99,
      yearlyPrice: 299.99,
      description: "Perfect for beginners starting their competitive exam journey",
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
      ],
      limitations: [
        "No personal notes",
        "No exam-specific trending",
        "Limited article saves (25 max)",
      ],
    },
    {
      id: "pro",
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
      id: "elite",
      name: "Elite",
      price: 99.99,
      yearlyPrice: 999.99,
      description: "Ultimate package for civil services & defense exam aspirants",
      popular: false,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      icon: Crown,
      features: [
        "Unlimited article saves",
        "Organize with folders ",
        "Add personal notes",
        "View global + all exams trending",
        "AI-powered study recommendations",
        "Premium global affairs tracking",
        "Expert-curated content",
        "Priority customer support",
      ],
      limitations: [],
    },
  ];

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await fetch('/api/exam-types');
        const data = await response.json();
        setExamTypes(data.examTypes);
        setFilteredExamTypes(data.examTypes);
      } catch (error) {
        console.error('Error fetching exam types:', error);
        toast.error('Failed to load exam types');
      } finally {
        setLoadingExamTypes(false);
      }
    };

    fetchExamTypes();
  }, []);

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
    setProcessingPayment(true);

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
          plan: selectedPlan.id,
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
                plan: selectedPlan.id,
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
                const redirectPath = sessionStorage.getItem("temp_redirect");
                if (redirectPath) {
                  sessionStorage.removeItem("temp_redirect");
                  window.location.href = redirectPath;
                } else {
                  window.location.href = "/news";
                }
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
          name: registeredUser?.name || '',
          email: registeredUser?.email || '',
          contact: registeredUser?.mobile || '',
        },
        notes: {
          plan: selectedPlan.id,
          billing_cycle: billingCycle,
        },
        theme: {
          color: '#DC2626',
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  const skipPayment = () => {
    toast.success("You can complete payment anytime from your account!");
    const redirectPath = sessionStorage.getItem("temp_redirect");
    if (redirectPath) {
      sessionStorage.removeItem("temp_redirect");
      router.replace(redirectPath);
    } else {
      router.replace("/news");
    }
  };

  const SignupUser = async (data) => {
    const response = await fetch(`/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData, status: response.status } };
    }

    return { data: await response.json() };
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = data;
      signupData.examTypeId = selectedExamType.id;
      signupData.plan = selectedPlan.id;
      
      // Send signup request
      const response = await SignupUser(signupData);
      if (response.data.token) {
        localStorage.setItem('user_token', response.data.token);
        setRegisteredUser(response.data.user);
        
        // All plans require payment now, including starter
        toast.success("Account created! Complete your payment to activate your plan.");
        setCurrentStep(4); // Payment step
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderExamTypeSelection = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-red-50 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-red-100">
        <div className="bg-red-800 p-6">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-white/10 mb-3">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Choose Your Exam</h1>
            <p className="text-red-100 mt-1">Select the exam you&apos;re preparing for</p>
          </div>
        </div>
        
        <div className="p-6">
          {loadingExamTypes ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
            </div>
          ) : (
            <>
              {/* Search/Filter Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search exam types..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = examTypes.filter(exam => 
                      exam.name.toLowerCase().includes(searchTerm) ||
                      exam.description?.toLowerCase().includes(searchTerm)
                    );
                    setFilteredExamTypes(filtered);
                  }}
                />
              </div>

              {/* Scrollable Grid Container */}
              <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-800 scrollbar-track-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  {filteredExamTypes.map((examType) => (
                    <div
                      key={examType.id}
                      onClick={() => setSelectedExamType(examType)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 relative ${
                        selectedExamType?.id === examType.id
                          ? 'border-red-800 bg-red-50 shadow-md'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {examType.name}
                        </h3>
                        {examType.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {examType.description}
                          </p>
                        )}
                        {selectedExamType?.id === examType.id && (
                          <div className="absolute -top-1 -right-1 bg-red-800 rounded-full p-1">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Exam Display */}
              {selectedExamType && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Selected:</p>
                      <p className="font-semibold text-red-800">{selectedExamType.name}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-red-800" />
                  </div>
                </div>
              )}
            </>
          )}
          
          <button
            onClick={() => setCurrentStep(2)}
            disabled={!selectedExamType || loadingExamTypes}
            className={`w-full mt-6 py-3 px-4 rounded-md font-semibold transition-colors ${
              selectedExamType && !loadingExamTypes
                ? 'bg-red-800 text-white hover:bg-red-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Plan Selection
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlanSelection = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-red-50 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden border border-red-100">
        <div className="bg-red-800 p-6">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-white/10 mb-3">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Choose Your Plan</h1>
            <p className="text-red-100 mt-1">
              Preparing for: <span className="font-semibold">{selectedExamType?.name}</span>
            </p>
          </div>
        </div>
        
        {/* Add back button */}
        <div className="px-6 pt-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center text-red-800 hover:text-red-900 font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Change Exam Type
          </button>
        </div>
        
        <div className="p-6 pt-4">
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="relative bg-gray-100 rounded-full p-1 shadow-inner">
              <div className={`absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300 ${
                billingCycle === 'monthly' ? 'left-1 right-1/2' : 'left-1/2 right-1'
              }`}></div>
              <div className="relative flex">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                    billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                  plan.popular
                    ? "border-red-300 md:scale-105 z-10"
                    : plan.borderColor
                } ${plan.popular ? "ring-2 ring-red-100" : ""} ${
                  selectedPlan?.id === plan.id ? "border-red-500 ring-2 ring-red-200" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {selectedPlan?.id === plan.id && (
                  <div className="absolute top-3 right-3 bg-red-800 rounded-full p-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-base text-gray-600 mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{billingCycle === 'yearly' ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    {billingCycle === 'yearly' && (
                      <div className="text-xs text-green-600 mt-1">
                        Save ₹{((plan.price * 12) - plan.yearlyPrice).toFixed(2)} annually
                      </div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <ul className="space-y-3">
                    {plan.features.slice(0, 4).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.slice(0, 1).map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start opacity-60">
                        <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Plan Display */}
          {selectedPlan && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected Plan:</p>
                  <p className="font-semibold text-red-800 text-lg">{selectedPlan.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.price}/{billingCycle === 'yearly' ? 'year' : 'month'}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-red-800" />
              </div>
            </div>
          )}
          
          <button
            onClick={() => setCurrentStep(3)}
            disabled={!selectedPlan}
            className={`w-full mt-6 py-3 px-4 rounded-md font-semibold transition-colors ${
              selectedPlan
                ? 'bg-red-800 text-white hover:bg-red-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Registration
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-red-50 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden border border-red-100">
        <div className="bg-red-800 p-6">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-white/10 mb-3">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Complete Your Payment</h1>
            <p className="text-red-100 mt-1">
              Welcome {registeredUser?.name}! Activate your {selectedPlan?.name} plan
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{selectedPlan?.name} Plan</h3>
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedPlan?.color} rounded-lg flex items-center justify-center`}>
                <selectedPlan.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Billing Cycle:</span>
                <span className="font-medium capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-lg text-gray-900">
                  ₹{billingCycle === 'yearly' ? selectedPlan?.yearlyPrice : selectedPlan?.price}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="flex justify-between text-green-600">
                  <span>Annual Savings:</span>
                  <span className="font-medium">
                    ₹{((selectedPlan?.price * 12) - selectedPlan?.yearlyPrice).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Actions */}
          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className={`w-full py-3 px-4 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                processingPayment
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-800 hover:bg-red-900 text-white'
              }`}
            >
              {processingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Pay ₹{billingCycle === 'yearly' ? selectedPlan?.yearlyPrice : selectedPlan?.price} & Activate Plan
                </>
              )}
            </button>

            <button
              onClick={skipPayment}
              disabled={processingPayment}
              className="w-full py-3 px-4 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Pay Later (Login to Complete)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Your account has been created successfully.</p>
            <p>You can upgrade your plan anytime from your settings.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserDetailsForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-red-50 p-5">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-red-100">
        <div className="bg-red-800 p-6">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-white/10 mb-3">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
            <div className="text-red-100 mt-1 space-y-1">
              <p>Exam: <span className="font-semibold">{selectedExamType?.name}</span></p>
              <p>Plan: <span className="font-semibold">{selectedPlan?.name}</span></p>
            </div>
          </div>
        </div>
        
        {/* Add back button */}
        <div className="px-6 pt-4">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center text-red-800 hover:text-red-900 font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Change Plan
          </button>
        </div>
        
        <div className="p-6 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Enter your full name" 
                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )} />

              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Choose a unique username" 
                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Enter your mobile number" 
                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="Create password" 
                          className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Confirm</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="Confirm password" 
                          className="pl-10 py-2 bg-gray-50 border-gray-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 rounded-md" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )} />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-800 hover:bg-red-900 text-white py-3 font-medium rounded-md transition-all duration-200 mt-2"
              >
                {isSubmitting ? (
                  "Creating account..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-red-800 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentStep === 1 && renderExamTypeSelection()}
      {currentStep === 2 && renderPlanSelection()}
      {currentStep === 3 && renderUserDetailsForm()}
      {currentStep === 4 && renderPaymentStep()}
    </>
  );
}