// "use client";
// // pages/our-story/page.jsx

// import { motion } from 'framer-motion';
// import { ArrowRight, Globe, Brain, Users } from 'lucide-react';
// import { useRouter } from 'next/navigation';


// export default function OurStory() {
//   const router = useRouter()

//   const handleNav = ()=>{
//     router.push("/")
//   }
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
//       <div className="container mx-auto px-4 py-16">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-bold text-orange-900">About Us</h1>
//           <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
//         </div>

//         {/* Content */}
//         <div className="max-w-4xl mx-auto space-y-8">
//           <p className="text-gray-800 leading-relaxed text-lg text-justify">
//             Doutya News is the world&apos;s first AI-powered multi-perspective news portal, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story. This unique approach allows readers to gain a well-rounded understanding of complex issues, fostering critical thinking, empathy, and a deeper appreciation for the intricacies of the world around us.
//           </p>

//           <p className="text-gray-800 leading-relaxed text-lg text-justify">
//             Doutya News leverages advanced AI technology to deliver content that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story. In doing so, we aim to foster informed decision-making and promote a more discerning, interconnected global community. At Doutya News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today.
//           </p>
//         </div>
//         {/* Call to Action */}
//          <div className="text-center mt-16">
//            <button
//           onClick={handleNav}
//           className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300 flex items-center mx-auto">
//             Start Exploring
//             <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
// pages/our-story/page.jsx

import { motion } from 'framer-motion';
import { ArrowRight, Globe, BookOpen, Compass, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OurStory() {
  const router = useRouter();

  const handleNav = () => {
    router.push("/");
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-red-800">About Us</h1>
          <div className="w-16 h-1 bg-red-800 mx-auto mt-4"></div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-semibold text-red-800 mb-5 border-b border-red-100 pb-2 flex items-center">
              <BookOpen className="mr-2 text-red-800" size={20} />
              About Doutya News Platform
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              At Doutya News Platform, we&apos;re reimagining the future of journalism — blending the power of technology, clarity, and integrity to create a truly inclusive news ecosystem.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">
              What began during the 2018 Kerala floods as a grassroots volunteering platform has evolved into a full-fledged AI-powered media company. Officially incorporated in 2020 and proudly 100% remote since the pandemic, Doutya has grown from a tech services firm into a bold force in the world of news and media.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              In 2024, we pivoted with purpose: to confront growing media bias, lack of news accessibility for younger audiences, and the overwhelming noise in today&apos;s news cycle. The result? A comprehensive and thoughtful media ecosystem designed for everyone — from curious kids to discerning adults.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-semibold text-red-800 mb-5 border-b border-red-100 pb-2 flex items-center">
              <Globe className="mr-2 text-red-800" size={20} />
              Our Platforms
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Doutya News Platform</h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Delivers multiperspective analysis on global and local stories, helping readers see every side before forming an opinion.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Doutya News for Kids</h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Designed with care and inspired by our founder&apos;s 3-year-old child, this platform offers age-appropriate news, word popups for difficult terms, and revision questions to build awareness and comprehension in young minds.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Doutya NewsMaps</h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  A revolutionary way to explore news on interactive global and local maps — built to engage Gen Z and make discovering what&apos;s happening around you effortless and intuitive.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Doutya NewsTech</h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  A B2B SaaS suite for media agencies and newsrooms, offering tools for content analysis, bias detection, audience targeting, and the powerful Doutya Mapper to visualize and structure stories geographically and contextually.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-semibold text-red-800 mb-5 border-b border-red-100 pb-2 flex items-center">
              <Compass className="mr-2 text-red-800" size={20} />
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              To make news accessible, balanced, and intelligent — reshaping how individuals, especially younger generations, interact with the world&apos;s stories.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-semibold text-red-800 mb-5 border-b border-red-100 pb-2 flex items-center">
              <Users className="mr-2 text-red-800" size={20} />
              Backed by Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Doutya is led by Kiran Roice, a serial entrepreneur recognized by global institutions like UNCTAD (awarded the prestigious Empretec certificate), and by organizations like CNBC and The Times of India for innovation and social impact. But it&apos;s not a one-person journey — it&apos;s built by a passionate team of technologists, journalists, designers, and educators who believe news should inform, not overwhelm.
            </p>
          </motion.div>

          <motion.div 
            className="border-t border-red-100 pt-8 mt-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <p className="text-gray-700 italic leading-relaxed text-center mb-6">
              From India to the world, Doutya News Group stands for context, truth, and digital-first storytelling — powered by AI, driven by humanity.
            </p>
            <p className="text-red-800 font-medium text-center">
              Join us on our mission to bring clarity to the chaos.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleNav}
            className="group bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-md text-base font-medium transition-colors duration-300 flex items-center mx-auto"
          >
            Start Exploring
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}