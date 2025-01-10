"use client";
// pages/our-story/page.jsx

import { motion } from 'framer-motion';
import { ArrowRight, Globe, Brain, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function OurStory() {
  const router = useRouter()

  const handleNav = ()=>{
    router.push("/")
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-orange-900 mb-6">
            About Us
          </h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Transforming news consumption through AI-powered multi-perspective journalism
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-6">
              <Globe className="w-8 h-8 text-orange-500 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-800">Multi Perspective</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Axara News is the world&apos;s first AI-powered multi-perspective news portal, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story. This unique approach allows readers to gain a well-rounded understanding of complex issues, fostering critical thinking, empathy, and a deeper appreciation for the intricacies of the world around us.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-6">
              <Brain className="w-8 h-8 text-orange-500 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-800">AI Innovation</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Axara News leverages advanced AI technology to deliver content that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story. In doing so, we aim to foster informed decision-making and promote a more discerning, interconnected global community. At Axara News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-orange-900 text-white rounded-2xl p-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Users className="w-12 h-12 mr-4" />
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg leading-relaxed text-center">
            At Axara News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today. We&apos;re committed to fostering informed decision-making and promoting a more discerning, interconnected global community.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button
          onClick={handleNav}
          className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300 flex items-center mx-auto">
            Start Exploring
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
