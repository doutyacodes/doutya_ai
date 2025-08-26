"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Users, 
  Target, 
  Lightbulb, 
  Award, 
  Heart,
  Zap,
  Shield,
  Eye,
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Quote,
  Star,
  TrendingUp,
  Compass,
  Rocket,
  ArrowUpRight,
  BookOpen,
  MousePointer
} from 'lucide-react';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [hoveredCard, setHoveredCard] = useState(null);

  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '500+', label: 'News Sources', icon: Globe },
    { number: '10M+', label: 'Stories Analyzed', icon: Eye },
    { number: '99.9%', label: 'Accuracy Rate', icon: Target }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We believe in open journalism where sources and biases are clearly identified.',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: Brain,
      title: 'Intelligence',
      description: 'AI-powered analysis ensures comprehensive understanding of every story.',
      gradient: 'from-red-400 to-red-500'
    },
    {
      icon: Heart,
      title: 'Empathy',
      description: 'We present perspectives with understanding and respect for all viewpoints.',
      gradient: 'from-red-600 to-red-700'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly evolving our technology to serve better journalism.',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Former journalist with 15+ years experience in digital media and AI research.',
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO',
      bio: 'AI researcher and former Google engineer specializing in natural language processing.',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Editorial',
      bio: 'Award-winning journalist and media ethics expert with global newsroom experience.',
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      bio: 'Product strategist focused on user experience and democratizing access to information.',
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Founded Doutya',
      description: 'Started with a vision to revolutionize news consumption through AI.',
      icon: Rocket
    },
    {
      year: '2022',
      title: 'AI Engine Launch',
      description: 'Launched our proprietary multi-perspective analysis engine.',
      icon: Brain
    },
    {
      year: '2023',
      title: '50K Users',
      description: 'Reached 50,000 active users across 25+ countries.',
      icon: Users
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to 15 languages and launched interactive news maps.',
      icon: Globe
    }
  ];

  const tabContent = {
    mission: {
      title: 'Our Mission',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Doutya exists to break down information silos and combat echo chambers by providing 
            comprehensive, multi-perspective analysis of global events. We believe that understanding 
            different viewpoints is essential for making informed decisions in our interconnected world.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-2xl border border-red-200/50 shadow-sm">
              <Compass className="w-8 h-8 text-red-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Guide Through Complexity</h4>
              <p className="text-gray-600 text-sm">
                Navigate the complex landscape of modern news with AI-powered insights 
                that reveal multiple dimensions of every story.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-2xl border border-red-200/50 shadow-sm">
              <Eye className="w-8 h-8 text-red-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Broaden Perspectives</h4>
              <p className="text-gray-600 text-sm">
                Challenge assumptions and expand understanding by presenting 
                diverse viewpoints on every major news story.
              </p>
            </div>
          </div>
        </div>
      )
    },
    vision: {
      title: 'Our Vision',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            We envision a world where informed citizens can access unbiased, comprehensive news analysis 
            instantly. Our AI-powered platform will become the global standard for multi-perspective journalism, 
            fostering empathy and understanding across cultural and ideological divides.
          </p>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-xl">
            <Quote className="w-8 h-8 text-red-400 mb-4" />
            <blockquote className="text-xl font-medium mb-4">
              {`"Information is power. Our mission is to democratize that power by making 
              comprehensive, unbiased news analysis accessible to everyone, everywhere."`}
            </blockquote>
            <cite className="text-gray-300">- Doutya Team</cite>
          </div>
        </div>
      )
    },
    impact: {
      title: 'Our Impact',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Since our launch, Doutya has helped millions of people understand complex global events 
            through multiple lenses, fostering more informed discussions and decision-making.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-red-200 transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
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
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              About Doutya
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-800">
                Transforming
              </span>
              <br />
              <span className="text-gray-900">News Consumption</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              We&apos;re building the future of journalism with AI-powered multi-perspective 
              news analysis that breaks echo chambers and fosters understanding.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.4)",
                  y: -3,
                }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl shadow-red-500/25 flex items-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                Join Our Mission
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-red-300 hover:text-red-600 hover:shadow-xl transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <BookOpen className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Our Story
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission/Vision/Impact Tabs */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-16">
              <motion.div 
                className="bg-gray-50 p-1 rounded-2xl flex border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {Object.keys(tabContent).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 capitalize relative overflow-hidden ${
                      activeTab === tab
                        ? 'bg-white text-red-600 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 rounded-xl"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl p-10 border border-gray-200 shadow-xl shadow-red-500/5"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  {tabContent[activeTab].title}
                </h2>
                {tabContent[activeTab].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              <Heart className="w-4 h-4 mr-2" />
              Our Core Values
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Principles That Guide Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything we do is rooted in these fundamental beliefs about journalism and technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="group bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10`}
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300 relative z-10">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed relative z-10">
                  {value.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: hoveredCard === index ? 1 : 0, x: hoveredCard === index ? 0 : -10 }}
                  className="absolute bottom-6 right-6 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              <TrendingUp className="w-4 h-4 mr-2" />
              Our Journey
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Key Milestones
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The important moments that shaped our mission to transform news consumption
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 to-red-700"></div>

              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className="relative flex items-center mb-16 last:mb-0"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full border-4 border-white shadow-xl"></div>
                  
                  {/* Content */}
                  <motion.div 
                    className="ml-20 bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 flex-1 group"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <milestone.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{milestone.title}</h3>
                          <span className="text-sm text-red-600 font-medium">{milestone.year}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              <Users className="w-4 h-4 mr-2" />
              Meet Our Team
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Minds Behind Doutya
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A diverse team of journalists, technologists, and visionaries united by a common goal
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="group bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
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
              Join thousands of successful candidates who chose Doutya. Start your journey to 
              excellence today with our comprehensive AI-powered preparation platform.
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
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <MousePointer className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;