"use client";
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
          Doutya Kids was born from a simple idea—to make learning an exciting journey of discovery for young minds. It all began when our founder, faced with the daily challenge of explaining complex topics to his curious 3-year-old, found himself running out of bedtime stories and explanations that would captivate and satisfy his child’s endless questions. This experience sparked the vision for a platform that could provide children with endless age-appropriate stories, facts, and explanations tailored to their unique, growing curiosity.
        </motion.div>

        {/* Second Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
        >
          Our mission at Doutya Kids is to help parents inspire a love for learning in their children by turning their natural curiosity into moments of joy, wonder, and understanding. We believe that the early years are crucial for exploring the world, so we’ve created a space where children ages 2 to 12 can dive into stories and information designed just for them. Every story and fact is crafted with care to ignite young imaginations, from the magical world of animals and nature to fun facts about the stars, science, and the history of amazing people.
        </motion.div>

        {/* Third Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.9 }}
        >
          With Doutya Kids, parents can find engaging stories and explanations that bring knowledge to life. Whether it’s a cozy bedtime story, an interesting fact, or a fascinating explanation, Doutya Kids is here to help families share joyful learning moments. We’re committed to making every child feel like a little explorer, supported by stories that spark curiosity and excitement about the world around them.
        </motion.div>

        {/* Fourth Paragraph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.2 }}
        >
          Our journey is one of inspiring young minds and creating lifelong learners. At Doutya Kids, we’re here to make childhood curiosity an endless adventure, one story at a time.
        </motion.div>
        
      </div>
    </div>
  );
}
