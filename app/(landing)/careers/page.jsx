"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Zap,
  Brain,
  Code,
  PenTool,
  BarChart3,
  Shield,
  Globe,
  ArrowRight,
  Search,
  Filter,
  CheckCircle,
  Star,
  Award,
  Coffee,
  Home,
  Laptop,
  DollarSign,
  Calendar,
  MessageSquare,
  Target,
  Lightbulb,
  Rocket,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  MousePointer
} from 'lucide-react';

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJob, setActiveJob] = useState(null);

  const departments = [
    { id: 'all', name: 'All Positions', count: 12 },
    { id: 'engineering', name: 'Engineering', count: 5 },
    { id: 'product', name: 'Product', count: 2 },
    { id: 'design', name: 'Design', count: 2 },
    { id: 'editorial', name: 'Editorial', count: 2 },
    { id: 'marketing', name: 'Marketing', count: 1 }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: Home,
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours and unlimited PTO',
      gradient: 'from-red-400 to-red-500'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pay',
      description: 'Top-tier salaries, equity participation, and performance bonuses',
      gradient: 'from-red-600 to-red-700'
    },
    {
      icon: Brain,
      title: 'Learning & Growth',
      description: 'Annual learning budget, conference attendance, and skill development',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: Coffee,
      title: 'Great Perks',
      description: 'Free meals, gym membership, tech stipend, and team retreats',
      gradient: 'from-red-400 to-red-600'
    },
    {
      icon: Users,
      title: 'Amazing Team',
      description: 'Work with world-class talent in a collaborative, inclusive environment',
      gradient: 'from-red-600 to-red-700'
    }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior AI Engineer',
      department: 'engineering',
      location: 'Remote / Bengaluru',
      type: 'Full-time',
      experience: '5+ years',
      salary: '₹25-35L',
      description: 'Lead the development of our AI-powered news analysis engine using cutting-edge ML techniques.',
      requirements: [
        'Master\'s in CS/ML or equivalent experience',
        'Experience with NLP, transformer models, and LLMs',
        'Proficiency in Python, TensorFlow/PyTorch',
        'Strong understanding of distributed systems'
      ],
      responsibilities: [
        'Design and implement AI models for news analysis',
        'Optimize model performance and accuracy',
        'Collaborate with product team on ML features',
        'Mentor junior engineers and establish best practices'
      ],
      featured: true
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      department: 'engineering',
      location: 'Remote / Bengaluru',
      type: 'Full-time',
      experience: '3+ years',
      salary: '₹15-25L',
      description: 'Build and maintain our web platform using modern technologies and frameworks.',
      requirements: [
        'Experience with React, Node.js, and TypeScript',
        'Knowledge of databases (MySQL, MongoDB)',
        'Familiarity with cloud platforms (AWS, GCP)',
        'Understanding of API design and microservices'
      ],
      responsibilities: [
        'Develop user-facing features and APIs',
        'Optimize application performance',
        'Collaborate with design and product teams',
        'Write tests and maintain code quality'
      ],
      featured: false
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'product',
      location: 'Hybrid / Bengaluru',
      type: 'Full-time',
      experience: '4+ years',
      salary: '₹20-30L',
      description: 'Drive product strategy and roadmap for our AI-powered news platform.',
      requirements: [
        'Experience in product management for tech products',
        'Understanding of AI/ML technologies',
        'Strong analytical and communication skills',
        'Experience with agile development processes'
      ],
      responsibilities: [
        'Define product vision and strategy',
        'Work with engineering on feature development',
        'Analyze user feedback and metrics',
        'Lead cross-functional product initiatives'
      ],
      featured: true
    },
    {
      id: 4,
      title: 'UX Designer',
      department: 'design',
      location: 'Remote / Bengaluru',
      type: 'Full-time',
      experience: '3+ years',
      salary: '₹12-20L',
      description: 'Create intuitive and engaging user experiences for our news platform.',
      requirements: [
        'Portfolio demonstrating UX design skills',
        'Proficiency in Figma, Sketch, or similar tools',
        'Understanding of user research methods',
        'Experience with responsive web design'
      ],
      responsibilities: [
        'Design user interfaces and interactions',
        'Conduct user research and usability testing',
        'Create design systems and guidelines',
        'Collaborate with product and engineering teams'
      ],
      featured: false
    },
    {
      id: 5,
      title: 'Senior Journalist',
      department: 'editorial',
      location: 'Hybrid / Bengaluru',
      type: 'Full-time',
      experience: '7+ years',
      salary: '₹18-25L',
      description: 'Lead editorial content strategy and oversee news analysis quality.',
      requirements: [
        'Journalism degree and extensive reporting experience',
        'Knowledge of media ethics and fact-checking',
        'Experience with digital content management',
        'Strong writing and editing skills'
      ],
      responsibilities: [
        'Develop editorial guidelines and standards',
        'Review and approve news analysis content',
        'Train AI models on journalistic principles',
        'Collaborate with product team on content features'
      ],
      featured: false
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      department: 'engineering',
      location: 'Remote / Bengaluru',
      type: 'Full-time',
      experience: '4+ years',
      salary: '₹18-28L',
      description: 'Build and maintain scalable infrastructure for our AI-powered platform.',
      requirements: [
        'Experience with cloud platforms (AWS, GCP, Azure)',
        'Proficiency in containerization (Docker, Kubernetes)',
        'Knowledge of CI/CD pipelines and automation',
        'Understanding of monitoring and logging systems'
      ],
      responsibilities: [
        'Design and maintain cloud infrastructure',
        'Implement CI/CD pipelines',
        'Monitor system performance and reliability',
        'Collaborate with engineering teams on deployments'
      ],
      featured: false
    }
  ];

  const companyValues = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We\'re passionate about democratizing access to unbiased news and information.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We embrace new technologies and approaches to solve complex problems.'
    },
    {
      icon: Users,
      title: 'Collaborative',
      description: 'We believe diverse perspectives make us stronger and more creative.'
    },
    {
      icon: TrendingUp,
      title: 'Growth Mindset',
      description: 'We\'re committed to continuous learning and personal development.'
    }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

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
              <Briefcase className="w-4 h-4 mr-2" />
              Join Our Team
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-800">
                Shape the Future
              </span>
              <br />
              <span className="text-gray-900">of Journalism</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join a team of passionate innovators building AI-powered tools that democratize 
              access to unbiased news and information worldwide.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.4)",
                  y: -3,
                }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl shadow-red-500/25 flex items-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-red-300 hover:text-red-600 hover:shadow-xl transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <Users className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Learn About Our Culture
              </motion.button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '50+', label: 'Team Members', icon: Users },
                { number: '15+', label: 'Countries', icon: Globe },
                { number: '100%', label: 'Remote-Friendly', icon: Home },
                { number: '4.9/5', label: 'Glassdoor Rating', icon: Star }
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
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
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
              <Heart className="w-4 h-4 mr-2" />
              What We Stand For
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Values Guide Everything
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that shape our culture and drive us toward our mission
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.title}
                className="group bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              <Zap className="w-4 h-4 mr-2" />
              Why Choose Doutya
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Exceptional Benefits & Perks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We invest in our team&apos;s success with comprehensive benefits that support your growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="group bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-24 bg-white relative">
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
              <Briefcase className="w-4 h-4 mr-2" />
              Open Positions
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Dream Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore exciting opportunities to make an impact in the future of journalism
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-lg"
              />
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-3">
              {departments.map((dept) => (
                <motion.button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    selectedDepartment === dept.id
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dept.name} ({dept.count})
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Job Listings */}
          <div className="space-y-8">
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group bg-white rounded-3xl border-2 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 overflow-hidden ${
                    job.featured ? 'border-red-200 bg-gradient-to-r from-red-50/50 to-transparent' : 'border-gray-200'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                            {job.title}
                          </h3>
                          {job.featured && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-semibold rounded-full flex items-center shadow-sm"
                            >
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </motion.span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                          <span className="flex items-center font-medium">
                            <Briefcase className="w-4 h-4 mr-2 text-red-500" />
                            {job.department}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-red-500" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-red-500" />
                            {job.type}
                          </span>
                          <span className="flex items-center">
                            <Award className="w-4 h-4 mr-2 text-red-500" />
                            {job.experience}
                          </span>
                          <span className="flex items-center font-semibold text-green-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {job.salary}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed">{job.description}</p>
                      </div>

                      <div className="flex gap-4 mt-6 lg:mt-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
                          className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-red-300 hover:text-red-600 transition-all duration-300 font-semibold"
                        >
                          View Details
                        </motion.button>
                        <motion.button 
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 10px 30px -5px rgba(239, 68, 68, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg shadow-red-500/25 flex items-center group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Job Details */}
                    <AnimatePresence>
                      {activeJob === job.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 pt-8 mt-8"
                        >
                          <div className="grid md:grid-cols-2 gap-10">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                Requirements
                              </h4>
                              <ul className="space-y-3">
                                {job.requirements.map((req, idx) => (
                                  <motion.li 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-3 flex-shrink-0" />
                                    <span className="text-gray-600">{req}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <ArrowRight className="w-5 h-5 mr-2 text-red-500" />
                                Responsibilities
                              </h4>
                              <ul className="space-y-3">
                                {job.responsibilities.map((resp, idx) => (
                                  <motion.li 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start"
                                  >
                                    <ArrowRight className="w-4 h-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
                                    <span className="text-gray-600">{resp}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="mt-10 pt-8 border-t border-gray-200 flex justify-end">
                            <motion.button 
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 15px 35px -5px rgba(239, 68, 68, 0.4)"
                              }}
                              whileTap={{ scale: 0.95 }}
                              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-xl shadow-red-500/25 flex items-center group relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                              Apply for this Position
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredJobs.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
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
              Don't See Your Dream Role?
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              We&apos;re Always Growing
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Passionate about journalism and technology? We'd love to hear from you. 
              Send us your resume and let&apos;s explore how you can contribute to our mission.
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
                Contact Us
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <MousePointer className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Submit Resume
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;