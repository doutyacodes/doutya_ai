"use client";
// pages/about-us/page.js

import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="container mx-auto py-4 px-4 bg-gradient-to-r from-orange-100 via-white to-orange-50 rounded-lg">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-4xl font-bold text-center mb-8 mt-5 text-orange-800"
      >
        About Us
      </motion.h1>

      <div className="text-base text-justify mx-auto max-w-5xl leading-relaxed space-y-8">
        
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
        >
          <p>
            At Axara, we are reimagining the way children learn and grow in a world brimming with possibilities. Every child is unique, with their own personality, interests, and learning style. Yet, traditional approaches to education often fail to recognize these individual traits, leaving parents searching for tools that truly resonate with their child. Axara was created to fill this gap—a space where learning is personalized, engaging, and designed to inspire curiosity in every child.
          </p>
        </motion.div>

        {/* Personalized Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
        >
          <p>
            Our platform is built on a foundation of hyper-personalized learning. Using advanced AI, we tailor content to match the unique needs of each child, adapting to their personality, passions, and preferred way of learning. Whether a child learns best through stories, challenges, or interactive feedback, Axara ensures that every moment is meaningful and enjoyable.
          </p>
        </motion.div>

        {/* Content Engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.9 }}
        >
          <p>
            At the heart of Axara lies a powerful content engine that transforms complex ideas into captivating formats. Whether it’s a magical story, a delightful poem, or a simple explanation, we bring any topic to life in a way that sparks understanding and joy. This dynamic approach ensures that learning feels less like a task and more like an adventure—encouraging children to ask questions, explore new ideas, and embrace the joy of discovery.
          </p>
        </motion.div>

        {/* Holistic Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.2 }}
        >
          <p>
            Axara also goes beyond storytelling, offering a comprehensive suite of features to support holistic growth. Weekly evaluations provide continuous insights into a child’s progress, while engaging activities and challenges build knowledge and practical skills. From simple drawing tasks to real-world explorations, Axara encourages hands-on learning that fosters creativity and critical thinking.
          </p>
        </motion.div>

        {/* For Parents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.5 }}
        >
          <p>
            For parents, Axara is a trusted partner in understanding and guiding their child’s journey. Through detailed assessments, we uncover a child’s strengths, learning preferences, and passions, providing parents with actionable insights to support their development. For children aged six and above, our career discovery tools introduce pathways aligned with their interests, helping them explore future possibilities in a fun and approachable way.
          </p>
        </motion.div>

        {/* Community Aspect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 1.8 }}
        >
          <p>
            Community is an essential part of the Axara experience. We provide safe, age-based online spaces where children can celebrate their achievements, share their creations, and connect with peers. These spaces encourage collaboration, build confidence, and make learning a shared journey filled with encouragement and inspiration.
          </p>
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 2.1 }}
        >
          <p>
            At Axara, we believe that learning is most impactful when it’s personal, engaging, and aligned with how a child naturally grows. With tools to track progress, celebrate milestones, and continually adapt to a child’s needs, Axara creates a supportive environment where every child can thrive. We’re not just a learning platform—we’re a partner in your child’s story, helping them build confidence, curiosity, and a lifelong love for learning. Together, let’s empower children to discover their unique potential and write a future that’s truly their own.
          </p>
        </motion.div>
        
      </div>
    </div>
  );
}
