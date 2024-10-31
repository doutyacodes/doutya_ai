"use client"
// pages/about-us/page.js

import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="container mx-auto py-12 pt-20 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-5xl font-bold text-center mb-8 text-white"
      >
        About Us
      </motion.h1>

      <div className="text-lg text-justify mx-auto max-w-5xl text-white leading-relaxed space-y-6">
        
        {/* First Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
        >
          Welcome to DOutya Kids, a place where learning is an adventure, and every child’s curiosity is celebrated. We’re passionate about providing young minds with an engaging, age-appropriate way to explore the world, guided by their natural wonder and creativity. DOutya Kids was born out of a simple but powerful idea: every child deserves a learning experience that is as unique, delightful, and meaningful as they are.
        </motion.div>

        {/* Second Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
        >
          DOutya Kids started when our founder, a parent himself, found that explaining complex ideas to his curious 3-year-old was a bigger challenge than he’d expected. He realized that the world is filled with fascinating topics, but that young children needed a way to understand them in ways that were both accurate and engaging. Bedtime stories ran out too quickly, explanations were often too complicated, and he wondered: What if there was a way for parents to create educational, interesting stories on any topic at the click of a button?
        </motion.div>

        {/* Third Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.9 }}
        >
          From this idea, DOutya Kids grew into a comprehensive learning platform designed for children aged 2-12, covering everything from bedtime stories to informative tales on any topic parents might imagine. But it doesn’t stop there. DOutya Kids also offers personalized evaluations that help parents understand their child’s unique strengths and areas for growth. Based on these insights, DOutya Kids provides courses tailored to nurture each child’s skills, from creative thinking and problem-solving to language development and early science exploration.
        </motion.div>

        {/* Fourth Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.2 }}
        >
          We know that every family’s learning journey is different, and we’re here to support that journey with content designed to entertain, educate, and inspire. DOutya Kids makes it easy for parents, grandparents, and caregivers to explore topics as varied as outer space, wildlife, history, or even the wonders of everyday life. We are here to make learning moments magical, all while helping children grow confidently with tools crafted just for them.
        </motion.div>

        {/* Fifth Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.5 }}
        >
          At DOutya Kids, we’re more than just a learning app; we’re a partner in your child’s development. Our goal is to help you nurture curious, capable, and joyful learners who are ready to explore the world around them with enthusiasm and imagination. Join us on this journey and let’s make every day a new adventure in learning for your little ones!
        </motion.div>
        
      </div>
    </div>
  );
}
