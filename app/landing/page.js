"use client"

import React, { useState, useEffect } from 'react';
import { Globe, Users, Briefcase, Instagram, Twitter, Linkedin, Network, ChevronRight, MessageSquare, Bot, Brain, Shield } from 'lucide-react';
import Image from 'next/image';

const ModernLanding = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 50);
  //   };
    
  //   const handleMouseMove = (e) => {
  //     setMousePosition({
  //       x: (e.clientX / window.innerWidth) * 2 - 1,
  //       y: (e.clientY / window.innerHeight) * 2 - 1
  //     });
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     window.removeEventListener('mousemove', handleMouseMove);
  //   };
  // }, []);

  useEffect(() => {
    // Check initial scroll position when the component mounts
    if (window.scrollY > 50) {
      setScrolled(true);
    }
  
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
  
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
  
    // Add event listeners for scroll and mouse move
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
  
    return () => {
      // Cleanup event listeners
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center sm:justify-between items-center h-20">
            <div className="flex items-center justify-start">
              <div className="flex items-center justify-start">
                <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
                   <Image
                    src={"/images/logo4.png"}
                    fill
                    objectFit="contain"
                    alt="Doutya Logo"
                    className="object-contain brightness-75"
                  />
                </div>
              </div>
            </div>
            <div className="hidden md:flex space-x-1">
              {['Home', 'About', 'Features', 'Careers', 'Social', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 rounded-full text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>


      {/* Enhanced About Section */}
      <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_90%,rgba(251,146,60,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-600 text-sm uppercase tracking-wider mb-4">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 text-center">
              Transforming News Consumption
            </h2>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-orange-500/20 shadow-lg">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-orange-500/30"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-orange-500/30"></div>
              
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Doutya News Platform is the world&apos;s first AI-powered multi-perspective news portal, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story. This unique approach allows readers to gain a well-rounded understanding of complex issues, fostering critical thinking, empathy, and a deeper appreciation for the intricacies of the world around us.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                D News leverages advanced AI technology to deliver content that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story. In doing so, we aim to foster informed decision-making and promote a more discerning, interconnected global community. At Doutya News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-100 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-600 text-sm uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 text-center">
              Why Choose Doutya
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Advanced algorithms process and analyze news from multiple sources to provide comprehensive insights."
              },
              {
                icon: Globe,
                title: "Global Perspectives",
                description: "Access diverse viewpoints from around the world, breaking free from single-narrative journalism."
              },
              {
                icon: Shield,
                title: "Unbiased Reporting",
                description: "Our AI ensures balanced coverage by presenting multiple viewpoints for every story."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-white/70 backdrop-blur-xl border border-orange-500/20 p-8 rounded-2xl transition-all duration-300 group-hover:-translate-y-2 shadow-sm">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Careers Section */}
      <section id="careers" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.1),transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-600 text-sm uppercase tracking-wider mb-4">Careers</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 text-center">
              Join Our Mission
            </h2>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-orange-500/20 shadow-lg">
            <div className="text-center max-w-3xl mx-auto">
              <Bot className="h-16 w-16 text-orange-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Be Part of Our Story</h3>
              <p className="text-gray-600 text-lg mb-8">
                Join the revolution in AI-powered news delivery. We&apos;re looking for passionate individuals who believe in the power of multiple perspectives and want to make a difference.
              </p>
              <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25">
                <span className="relative flex items-center">
                  View Open Positions
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Social Media Section */}
      <section id="social" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-100 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-600 text-sm uppercase tracking-wider mb-4">Social</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 text-center">
              Connect With Us
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Instagram, label: 'Instagram' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Users, label: 'Threads' },
              { icon: Linkedin, label: 'LinkedIn' }
            ].map((social, index) => (
              <a key={index} href="#" className="group">
                <div className="relative bg-white/70 backdrop-blur-xl border border-orange-500/20 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <social.icon className="h-12 w-12 text-gray-400 group-hover:text-orange-600 mx-auto mb-4 transition-colors" />
                  <p className="text-center text-gray-600 group-hover:text-orange-600 transition-colors">{social.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-600 text-sm uppercase tracking-wider mb-4">Contact</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 text-center">
              Get in Touch
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-orange-500/20 overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="space-y-6">
                <div className="bg-orange-50 p-8 rounded-2xl border border-orange-500/10">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Our Office</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>Doutya News</p>
                    <p>(Doutya News Platform),</p>
                    <p>Whitefield, Bengaluru,</p>
                    <p>Karnataka, India - 560067</p>
                    <p>Phone : +91 - 9633738938</p>
                    <p>Email : contact@doutya.com</p>
                  </div>
                  <div className="mt-8 flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                      <Linkedin className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full px-6 py-4 bg-white/70 border border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-6 py-4 bg-white/70 border border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    />
                    <textarea
                      placeholder="Message"
                      rows="6"
                      className="w-full px-6 py-4 bg-white/70 border border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    ></textarea>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-white/70 border-t border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
                   <Image
                    src={"/images/logo4.png"}
                    fill
                    objectFit="contain"
                    alt="Doutya News Logo"
                    className="object-contain brightness-75"
                  />
                </div>
              <p className="text-gray-600 text-sm">
                Bringing multiple perspectives to every story, enhanced by AI technology.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Features', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-600 hover:text-orange-600 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Connect</h4>
              <ul className="space-y-2">
                {['Twitter', 'Instagram', 'LinkedIn', 'Threads'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-orange-600 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Whitefield, Bengaluru</li>
                <li>Karnataka, India - 560067</li>
                <li>contact@doutya.com</li>
                <li>+91 - 9633738938</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-orange-500/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Doutya News Platform. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLanding;