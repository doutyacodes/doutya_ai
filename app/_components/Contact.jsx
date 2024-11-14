"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        

        
        {/* Address Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-gray-50 p-6 rounded-lg shadow-xl max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-800">Our Location</h3>
          <p className="mt-4 text-gray-600">
            <strong>Located in:</strong> Sandeep Vihar
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Address:</strong> AWHO, Whitefield - Hoskote Rd, Whitefield, SV, Kannamangala, Bengaluru, Karnataka 560067
          </p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="mt-6 flex justify-center"
          >
            <motion.a
              href="https://www.google.com/maps?q=AWHO,+Whitefield+-+Hoskote+Rd,+Whitefield,+SV,+Kannamangala,+Bengaluru,+Karnataka+560067"
              target="_blank"
              className="bg-blue-500 text-white py-2 px-6 rounded-full shadow-lg hover:bg-blue-600"
            >
              View on Map
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
