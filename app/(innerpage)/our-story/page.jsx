"use client";
// pages/our-story/page.js

import { motion } from 'framer-motion';

export default function OurStory() {
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-4xl font-bold text-center mb-8 "
      >
        Our Story: The Birth of Axara
      </motion.h1>

      <div className="text-base text-justify mx-auto max-w-5xl leading-relaxed space-y-6">
        
        {/* First Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
        >
          Every child comes into the world with boundless curiosity, a unique personality, and an innate desire to explore. But in a world teeming with technology, it’s easy for learning to feel one-size-fits-all—leaving parents searching for something more personal, something that truly celebrates their child’s individuality.
        </motion.div>

        {/* Second Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
        >
          Axara was born from this search. The spark came when one of our founders, a parent of a bright and inquisitive 3-year-old, faced the challenge of answering endless questions: “Why is the sky blue? How do volcanoes work? Why do stars twinkle?” These seemingly simple questions led to a powerful realization: there was no tool that could explain these concepts in a way that was captivating, age-appropriate, and tailored to a child’s unique learning style.
        </motion.div>

        {/* Third Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.9 }}
        >
          What started as a quest to create personalized answers turned into a mission to revolutionize learning. Axara became a platform that doesn’t just teach but understands—using the power of AI to tailor every story, explanation, and lesson to the way each child learns best. Whether it’s transforming complex topics into magical tales, offering fun personality-based quizzes, or crafting personalized career roadmaps for kids as young as six, Axara is built to grow alongside your child, nurturing curiosity and confidence at every step.
        </motion.div>

        {/* Fourth Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.2 }}
        >
          At its core, Axara is about connection: helping parents and children explore the world together, one question, one story, one milestone at a time. We believe that learning should feel like an adventure—personal, exciting, and deeply meaningful. With Axara, we’re not just shaping young minds; we’re creating a space where children can dream big, explore their passions, and discover their potential.
        </motion.div>

        {/* Fifth Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.5 }}
        >
          Every child’s story is unique, and at Axara, we’re here to help you write it. Welcome to the future of hyper-personalized learning. Welcome to Axara.
        </motion.div>
        
      </div>
    </div>
  );
}
