"use client"

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800"
        >
          Contact Us
        </motion.h2>
        <p className="mt-4 text-gray-600">We’d love to hear from you! Fill out the form below to get in touch.</p>
        <form className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="p-4 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-4 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Your Message"
            className="col-span-2 p-4 border border-gray-300 rounded-lg"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="col-span-2 bg-orange-500 text-white p-4 rounded-full"
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </section>
  );
}
