// import React from 'react';
// import { Globe, Users, Briefcase, Instagram, Twitter, Linkedin } from 'lucide-react';

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <img
//                 src="/api/placeholder/40/40"
//                 alt="Axara News Logo"
//                 className="h-10 w-auto"
//               />
//             </div>
//             <div className="hidden md:flex space-x-8">
//               <a href="#about" className="text-gray-700 hover:text-orange-600">About</a>
//               <a href="#features" className="text-gray-700 hover:text-orange-600">Features</a>
//               <a href="#careers" className="text-gray-700 hover:text-orange-600">Careers</a>
//               <a href="#contact" className="text-gray-700 hover:text-orange-600">Contact</a>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* About Section */}
//       <section id="about" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Us</h2>
//           <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-8 shadow-lg">
//             <p className="text-gray-700 leading-relaxed mb-4">
//               Axara News is the world's first AI-powered multi-perspective news portal, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story. This unique approach allows readers to gain a well-rounded understanding of complex issues, fostering critical thinking, empathy, and a deeper appreciation for the intricacies of the world around us.
//             </p>
//             <p className="text-gray-700 leading-relaxed">
//               Axara News leverages advanced AI technology to deliver content that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story. In doing so, we aim to foster informed decision-making and promote a more discerning, interconnected global community. At Axara News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Features</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                 <Globe className="h-6 w-6 text-orange-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Global Perspectives</h3>
//               <p className="text-gray-600">Access news stories from multiple viewpoints across the globe, breaking free from single-narrative journalism.</p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                 <Users className="h-6 w-6 text-orange-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
//               <p className="text-gray-600">Advanced AI technology helps curate and analyze diverse perspectives for comprehensive news coverage.</p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                 <Globe className="h-6 w-6 text-orange-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Unbiased Reporting</h3>
//               <p className="text-gray-600">Experience news coverage that presents multiple viewpoints, helping you form your own informed opinions.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Careers Section */}
//       <section id="careers" className="py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Careers</h2>
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             <div className="text-center mb-8">
//               <Briefcase className="h-12 w-12 text-orange-600 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold mb-2">Join Our Team</h3>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Be part of the revolution in news delivery. We're looking for passionate individuals who believe in the power of multiple perspectives and want to make a difference in how people consume news.
//               </p>
//             </div>
//             <div className="text-center">
//               <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
//                 View Open Positions
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h2>
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             <div className="grid md:grid-cols-2 gap-8">
//               <div>
//                 <div className="space-y-4">
//                   <p className="text-gray-700">Axara News,</p>
//                   <p className="text-gray-700">(Doutya Technologies),</p>
//                   <p className="text-gray-700">Whitefield, Bengaluru,</p>
//                   <p className="text-gray-700">Karnataka, India - 560067</p>
//                   <p className="text-gray-700">Phone : +91 - 6361400800</p>
//                   <p className="text-gray-700">Email : contact@axaranews.com</p>
//                 </div>
//                 <div className="mt-8 flex space-x-6">
//                   <a href="#" className="text-gray-400 hover:text-orange-600">
//                     <Instagram className="h-6 w-6" />
//                   </a>
//                   <a href="#" className="text-gray-400 hover:text-orange-600">
//                     <Twitter className="h-6 w-6" />
//                   </a>
//                   <a href="#" className="text-gray-400 hover:text-orange-600">
//                     <Linkedin className="h-6 w-6" />
//                   </a>
//                 </div>
//               </div>
//               <div>
//                 <form className="space-y-4">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Name"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="email"
//                       placeholder="Email"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
//                     />
//                   </div>
//                   <div>
//                     <textarea
//                       placeholder="Message"
//                       rows="4"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
//                     ></textarea>
//                   </div>
//                   <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
//                     Send Message
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LandingPage;
"use client"

// import React, { useEffect } from 'react';
// import { Globe, Users, Briefcase, Instagram, Twitter, Linkedin } from 'lucide-react';

// const LandingPage = () => {
//   // Smooth scroll function
//   useEffect(() => {
//     const handleNavClick = (e) => {
//       const links = document.querySelectorAll('a[href^="#"]');
//       links.forEach(link => {
//         link.addEventListener('click', (e) => {
//           e.preventDefault();
//           const targetId = link.getAttribute('href');
//           const targetElement = document.querySelector(targetId);
//           if (targetElement) {
//             targetElement.scrollIntoView({ behavior: 'smooth' });
//           }
//         });
//       });
//     };

//     handleNavClick();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <img
//                 src="/api/placeholder/40/40"
//                 alt="Axara News Logo"
//                 className="h-10 w-auto"
//               />
//             </div>
//             <div className="hidden md:flex space-x-8">
//               <a href="#hero" className="text-gray-300 hover:text-orange-500">Home</a>
//               <a href="#about" className="text-gray-300 hover:text-orange-500">About</a>
//               <a href="#features" className="text-gray-300 hover:text-orange-500">Features</a>
//               <a href="#careers" className="text-gray-300 hover:text-orange-500">Careers</a>
//               <a href="#social" className="text-gray-300 hover:text-orange-500">Social</a>
//               <a href="#contact" className="text-gray-300 hover:text-orange-500">Contact</a>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section id="hero" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"></div>
//             </div>
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 relative">
//               News Through Every Lens
//             </h1>
//           </div>
//           <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
//             Experience the world's first AI-powered multi-perspective news platform, delivering comprehensive insights from every angle.
//           </p>
//           <button className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg hover:bg-orange-600 transition-colors">
//             Start Reading
//           </button>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-white mb-8 text-center">About Us</h2>
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
//             <p className="text-gray-300 leading-relaxed mb-4">
//               Axara News is the world's first AI-powered multi-perspective news portal, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story. This unique approach allows readers to gain a well-rounded understanding of complex issues, fostering critical thinking, empathy, and a deeper appreciation for the intricacies of the world around us.
//             </p>
//             <p className="text-gray-300 leading-relaxed">
//               Axara News leverages advanced AI technology to deliver content that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story. In doing so, we aim to foster informed decision-making and promote a more discerning, interconnected global community. At Axara News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-white mb-12 text-center">Features</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700">
//               <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
//                 <Globe className="h-6 w-6 text-orange-500" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-white">Global Perspectives</h3>
//               <p className="text-gray-300">Access news stories from multiple viewpoints across the globe, breaking free from single-narrative journalism.</p>
//             </div>
//             <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700">
//               <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
//                 <Users className="h-6 w-6 text-orange-500" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Analysis</h3>
//               <p className="text-gray-300">Advanced AI technology helps curate and analyze diverse perspectives for comprehensive news coverage.</p>
//             </div>
//             <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700">
//               <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
//                 <Globe className="h-6 w-6 text-orange-500" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-white">Unbiased Reporting</h3>
//               <p className="text-gray-300">Experience news coverage that presents multiple viewpoints, helping you form your own informed opinions.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Careers Section */}
//       <section id="careers" className="py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-white mb-8 text-center">Careers</h2>
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-8">
//             <div className="text-center mb-8">
//               <Briefcase className="h-12 w-12 text-orange-500 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold mb-2 text-white">Join Our Team</h3>
//               <p className="text-gray-300 max-w-2xl mx-auto">
//                 Be part of the revolution in news delivery. We're looking for passionate individuals who believe in the power of multiple perspectives and want to make a difference in how people consume news.
//               </p>
//             </div>
//             <div className="text-center">
//               <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
//                 View Open Positions
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Social Media Section */}
//       <section id="social" className="py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-white mb-8 text-center">Connect With Us</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             <a href="#" className="group">
//               <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors text-center">
//                 <Instagram className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-300 group-hover:text-orange-500 transition-colors">Instagram</p>
//               </div>
//             </a>
//             <a href="#" className="group">
//               <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors text-center">
//                 <Twitter className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-300 group-hover:text-orange-500 transition-colors">Twitter</p>
//               </div>
//             </a>
//             <a href="#" className="group">
//               <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors text-center">
//                 <Users className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-300 group-hover:text-orange-500 transition-colors">Threads</p>
//               </div>
//             </a>
//             <a href="#" className="group">
//               <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors text-center">
//                 <Linkedin className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-300 group-hover:text-orange-500 transition-colors">LinkedIn</p>
//               </div>
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Us</h2>
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-8">
//             <div className="grid md:grid-cols-2 gap-8">
//               <div>
//                 <div className="space-y-4 text-gray-300">
//                   <p>Axara News,</p>
//                   <p>(Doutya Technologies),</p>
//                   <p>Whitefield, Bengaluru,</p>
//                   <p>Karnataka, India - 560067</p>
//                   <p>Phone : +91 - 6361400800</p>
//                   <p>Email : contact@axaranews.com</p>
//                 </div>
//               </div>
//               <div>
//                 <form className="space-y-4">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Name"
//                       className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-white"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="email"
//                       placeholder="Email"
//                       className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-white"
//                     />
//                   </div>
//                   <div>
//                     <textarea
//                       placeholder="Message"
//                       rows="4"
//                       className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-white"
//                     ></textarea>
//                   </div>
//                   <button className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
//                     Send Message
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LandingPage;

// import React, { useEffect } from 'react';
// import { Globe, Users, Briefcase, Instagram, Twitter, Linkedin } from 'lucide-react';
// import Image from 'next/image';

// const LandingPage = () => {
//   useEffect(() => {
//     const handleNavClick = (e) => {
//       const links = document.querySelectorAll('a[href^="#"]');
//       links.forEach(link => {
//         link.addEventListener('click', (e) => {
//           e.preventDefault();
//           const targetId = link.getAttribute('href');
//           const targetElement = document.querySelector(targetId);
//           if (targetElement) {
//             targetElement.scrollIntoView({ behavior: 'smooth' });
//           }
//         });
//       });
//     };

//     handleNavClick();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm border-b-4 border-orange-600 ">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* <div className="flex items-center">
//               <img
//                 src="/api/placeholder/40/40"
//                 alt="Axara News Logo"
//                 className="h-10 w-auto"
//               />
//             </div> */}
//             <div className="flex items-center justify-start">
//                 <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
//                   <Image
//                     src={"/images/logo4.png"}
//                     fill
//                     objectFit="contain"
//                     alt="Axara News Logo"
//                     className="object-center"
//                   />
//                 </div>
//             </div>
//             <div className="hidden md:flex space-x-8">
//               <a href="#hero" className="text-gray-600 hover:text-orange-500 font-medium">Home</a>
//               <a href="#about" className="text-gray-600 hover:text-orange-500 font-medium">About</a>
//               <a href="#features" className="text-gray-600 hover:text-orange-500 font-medium">Features</a>
//               <a href="#careers" className="text-gray-600 hover:text-orange-500 font-medium">Careers</a>
//               <a href="#social" className="text-gray-600 hover:text-orange-500 font-medium">Social</a>
//               <a href="#contact" className="text-gray-600 hover:text-orange-500 font-medium">Contact</a>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* About Section */}
//       <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Us</h2>
//           <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-lg">
//             <p className="text-gray-700 leading-relaxed mb-4">
//               Axara News is the world's first AI-powered multi-perspective news portal, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story. This unique approach allows readers to gain a well-rounded understanding of complex issues, fostering critical thinking, empathy, and a deeper appreciation for the intricacies of the world around us.
//             </p>
//             <p className="text-gray-700 leading-relaxed">
//               Axara News leverages advanced AI technology to deliver content that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story. In doing so, we aim to foster informed decision-making and promote a more discerning, interconnected global community. At Axara News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-orange-50">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Features</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                 <Globe className="h-6 w-6 text-orange-500" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-900">Global Perspectives</h3>
//               <p className="text-gray-600">Access news stories from multiple viewpoints across the globe, breaking free from single-narrative journalism.</p>
//             </div>
//             <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                 <Users className="h-6 w-6 text-orange-500" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-900">AI-Powered Analysis</h3>
//               <p className="text-gray-600">Advanced AI technology helps curate and analyze diverse perspectives for comprehensive news coverage.</p>
//             </div>
//             <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                 <Globe className="h-6 w-6 text-orange-500" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-900">Unbiased Reporting</h3>
//               <p className="text-gray-600">Experience news coverage that presents multiple viewpoints, helping you form your own informed opinions.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Careers Section */}
//       <section id="careers" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Careers</h2>
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             <div className="text-center mb-8">
//               <Briefcase className="h-12 w-12 text-orange-500 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold mb-2 text-gray-900">Join Our Team</h3>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Be part of the revolution in news delivery. We're looking for passionate individuals who believe in the power of multiple perspectives and want to make a difference in how people consume news.
//               </p>
//             </div>
//             <div className="text-center">
//               <button className="bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl">
//                 View Open Positions
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Social Media Section */}
//       <section id="social" className="py-24 px-4 sm:px-6 lg:px-8 bg-orange-50">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Connect With Us</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             <a href="#" className="group">
//               <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
//                 <Instagram className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-600 group-hover:text-orange-500 transition-colors">Instagram</p>
//               </div>
//             </a>
//             <a href="#" className="group">
//               <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
//                 <Twitter className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-600 group-hover:text-orange-500 transition-colors">Twitter</p>
//               </div>
//             </a>
//             <a href="#" className="group">
//               <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
//                 <Users className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-600 group-hover:text-orange-500 transition-colors">Threads</p>
//               </div>
//             </a>
//             <a href="#" className="group">
//               <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
//                 <Linkedin className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                 <p className="text-gray-600 group-hover:text-orange-500 transition-colors">LinkedIn</p>
//               </div>
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h2>
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             <div className="grid md:grid-cols-2 gap-8">
//               {/* <div>
//                 <div className="space-y-4 text-gray-600">
//                   <p>Axara News,</p>
//                   <p>(Doutya Technologies),</p>
//                   <p>Whitefield, Bengaluru,</p>
//                   <p>Karnataka, India - 560067</p>
//                   <p>Phone : +91 - 6361400800</p>
//                   <p>Email : contact@axaranews.com</p>
//                 </div>
//               </div> */}

//               <div>
//                 <div className="space-y-4">
//                   <p className="text-gray-700">Axara News,</p>
//                   <p className="text-gray-700">(Doutya Technologies),</p>
//                   <p className="text-gray-700">Whitefield, Bengaluru,</p>
//                   <p className="text-gray-700">Karnataka, India - 560067</p>
//                   <p className="text-gray-700">Phone : +91 - 6361400800</p>
//                   <p className="text-gray-700">Email : contact@axaranews.com</p>
//                 </div>
//                 <div className="mt-8 flex space-x-6">
//                   <a href="#" className="text-gray-400 hover:text-orange-600">
//                     <Instagram className="h-6 w-6" />
//                   </a>
//                   <a href="#" className="text-gray-400 hover:text-orange-600">
//                     <Twitter className="h-6 w-6" />
//                   </a>
//                   <a href="#" className="text-gray-400 hover:text-orange-600">
//                     <Linkedin className="h-6 w-6" />
//                   </a>
//                 </div>
//               </div>
//               <div>
//                 <form className="space-y-4">
//                   <div>
//                       <input
//                         type="text"
//                         placeholder="Name"
//                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
//                       />
//                     </div>
//                     <div>
//                       <input
//                         type="email"
//                         placeholder="Email"
//                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
//                       />
//                     </div>
//                     <div>
//                       <textarea
//                         placeholder="Message"
//                         rows="4"
//                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
//                       ></textarea>
//                     </div>
//                     <button className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl">
//                       Send Message
//                     </button>
//                   </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//     );
//   };

// export default LandingPage;


      {/* Hero Section */}
      // <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      //   {/* Background Elements */}
      //   <div className="absolute inset-0 overflow-hidden">
      //     <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
      //     <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
      //     <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-10"></div>
      //   </div>
        
      //   {/* Content Grid */}
      //   <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      //     <div className="grid md:grid-cols-2 gap-12 items-center">
      //       {/* Text Content */}
      //       <div className="text-left space-y-8">
      //         <h1 className="text-5xl md:text-6xl font-bold leading-tight">
      //           <span className="text-gray-900">See News Through</span>
      //           <br />
      //           <span className="text-orange-500">Every Lens</span>
      //         </h1>
      //         <p className="text-xl text-gray-600 max-w-lg">
      //           Experience the world's first AI-powered multi-perspective news platform, breaking free from single narratives.
      //         </p>
      //         <div className="flex flex-col sm:flex-row gap-4">
      //           <button className="px-8 py-4 bg-orange-500 text-white rounded-lg text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl">
      //             Start Reading
      //           </button>
      //           <button className="px-8 py-4 bg-white text-orange-500 rounded-lg text-lg border-2 border-orange-500 hover:bg-orange-50 transition-colors">
      //             Learn More
      //           </button>
      //         </div>
              
      //         {/* Stats */}
      //         <div className="grid grid-cols-3 gap-8 pt-8">
      //           <div>
      //             <p className="text-3xl font-bold text-orange-500">50K+</p>
      //             <p className="text-gray-600">Daily Readers</p>
      //           </div>
      //           <div>
      //             <p className="text-3xl font-bold text-orange-500">100+</p>
      //             <p className="text-gray-600">Global Sources</p>
      //           </div>
      //           <div>
      //             <p className="text-3xl font-bold text-orange-500">24/7</p>
      //             <p className="text-gray-600">Updates</p>
      //           </div>
      //         </div>
      //       </div>
            
      //       {/* Hero Image/Illustration */}
      //       <div className="relative">
      //         <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
      //           {/* Replace with your actual hero image */}
      //           <img
      //             src="https://images.pexels.com/photos/6204080/pexels-photo-6204080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      //             alt="News Perspectives Illustration"
      //             className="absolute inset-0 w-full h-full object-cover "
      //           />
      //           {/* mix-blend-overlay */}
                
      //           {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50"> */}
      //             {/* Decorative Elements */}
      //             {/* <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-200 rounded-lg transform rotate-12"></div>
      //             <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-orange-300 rounded-lg transform -rotate-12"></div>
      //             <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-orange-100 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      //           </div>
      //            */}
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </section>


// import React, { useState, useEffect } from 'react';
// import { Globe, Users, Briefcase, Instagram, Twitter, Linkedin, Network, ChevronRight, MessageSquare } from 'lucide-react';

// const ModernLanding = () => {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Ultra-modern Navbar */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20">
//             <div className="flex items-center justify-start">
//               <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
//                 <img
//                   src="/api/placeholder/180/40"
//                   alt="Axara News Logo"
//                   className="object-contain"
//                 />
//               </div>
//             </div>
//             <div className="hidden md:flex space-x-1">
//               {['Home', 'About', 'Features', 'Careers', 'Social', 'Contact'].map((item) => (
//                 <a
//                   key={item}
//                   href={`#${item.toLowerCase()}`}
//                   className="px-4 py-2 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
//                 >
//                   {item}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section with Dynamic Background */}
//       <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
//         <div className="absolute inset-0 w-full h-full">
//           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,237,213,0.4)_0%,rgba(255,255,255,0)_100%)]"></div>
//           <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_90%,rgba(255,237,213,0.4)_0%,rgba(255,255,255,0)_100%)]"></div>
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
//           <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
//             Multiple Perspectives, One Truth
//           </h1>
//           <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
//             Experience news through different lenses, enhanced by AI technology for a comprehensive understanding.
//           </p>
//           <button className="px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
//             Discover More
//           </button>
//         </div>
//       </section>

//       {/* About Section with Glass Effect */}
//       <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,237,213,0.4)_0%,rgba(255,255,255,0)_70%)]"></div>
//         <div className="max-w-7xl mx-auto relative">
//           <div className="flex flex-col items-center mb-16">
//             <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">About Us</span>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Transforming News Consumption</h2>
//           </div>
//           <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-orange-100">
//             <p className="text-gray-700 leading-relaxed mb-6 text-lg">
//               Axara News is the world's first multi-perspective news portal enhanced by AI technology, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story.
//             </p>
//             <p className="text-gray-700 leading-relaxed text-lg">
//               Axara News utilizes AI technology to enhance content delivery that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section with Floating Cards */}
//       <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange-50 relative">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col items-center mb-16">
//             <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Features</span>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Why Choose Axara</h2>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Globe,
//                 title: "Global Perspectives",
//                 description: "Access news stories from multiple viewpoints across the globe, breaking free from single-narrative journalism."
//               },
//               {
//                 icon: Network,
//                 title: "AI-Enhanced Analysis",
//                 description: "Smart technology helps organize and present diverse perspectives for better understanding of news coverage."
//               },
//               {
//                 icon: Users,
//                 title: "Unbiased Reporting",
//                 description: "Experience news coverage that presents multiple viewpoints, helping you form your own informed opinions."
//               }
//             ].map((feature, index) => (
//               <div key={index} className="group relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl transform group-hover:translate-y-2 transition-transform duration-300"></div>
//                 <div className="relative bg-white p-8 rounded-2xl shadow-lg group-hover:-translate-y-2 transition-all duration-300">
//                   <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
//                     <feature.icon className="h-7 w-7 text-orange-500" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Careers Section with Modern Cards */}
//       <section id="careers" className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,237,213,0.4)_0%,rgba(255,255,255,0)_70%)]"></div>
//         <div className="max-w-7xl mx-auto relative">
//           <div className="flex flex-col items-center mb-16">
//             <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Careers</span>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Join Our Mission</h2>
//           </div>
//           <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-12 shadow-xl border border-orange-100">
//             <div className="text-center max-w-3xl mx-auto">
//               <Briefcase className="h-16 w-16 text-orange-500 mx-auto mb-6" />
//               <h3 className="text-2xl font-semibold mb-4 text-gray-900">Be Part of Our Story</h3>
//               <p className="text-gray-600 text-lg mb-8">
//                 Be part of the revolution in news delivery. We're looking for passionate individuals who believe in the power of multiple perspectives and want to make a difference in how people consume news.
//               </p>
//               <button className="group relative px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-200">
//                 <span className="relative flex items-center">
//                   View Open Positions
//                   <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Social Media Section with Hover Effects */}
//       <section id="social" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col items-center mb-16">
//             <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Social</span>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Connect With Us</h2>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { icon: Instagram, label: 'Instagram' },
//               { icon: Twitter, label: 'Twitter' },
//               { icon: Users, label: 'Threads' },
//               { icon: Linkedin, label: 'LinkedIn' }
//             ].map((social, index) => (
//               <a key={index} href="#" className="group">
//                 <div className="relative bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2">
//                   <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
//                   <social.icon className="h-12 w-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
//                   <p className="text-center text-gray-600 group-hover:text-orange-500 transition-colors">{social.label}</p>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Section with Modern Form */}
//       <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,237,213,0.4)_0%,rgba(255,255,255,0)_100%)]"></div>
//         <div className="max-w-7xl mx-auto relative">
//           <div className="flex flex-col items-center mb-16">
//             <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Contact</span>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Get in Touch</h2>
//           </div>
//           <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
//             <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
//               <div className="space-y-6">
//                 <div className="bg-orange-50 p-8 rounded-2xl">
//                   <h3 className="text-2xl font-semibold mb-6 text-gray-900">Our Office</h3>
//                   <div className="space-y-4 text-gray-600">
//                     <p>Axara News,</p>
//                     <p>(Doutya Technologies),</p>
//                     <p>Whitefield, Bengaluru,</p>
//                     <p>Karnataka, India - 560067</p>
//                     <p>Phone : +91 - 6361400800</p>
//                     <p>Email : contact@axaranews.com</p>
//                   </div>
//                   <div className="mt-8 flex space-x-6">
//                     <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
//                       <Instagram className="h-6 w-6" />
//                     </a>
//                     <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
//                       <Twitter className="h-6 w-6" />
//                     </a>
//                     <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
//                       <Linkedin className="h-6 w-6" />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <form className="space-y-6">
//                   <div className="space-y-4">
//                     <input
//                       type="text"
//                       placeholder="Name"
//                       className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
//                     />
//                     <input
//                       type="email"
//                       placeholder="Email"
//                       className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
//                     />
//                     <textarea
//                       placeholder="Message"
//                       rows="6"
//                       className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
//                     ></textarea>
//                   </div>
//                   <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
//                     <MessageSquare className="w-5 h-5 mr-2" />
//                     Send Message
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-50 border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div className="col-span-2 md:col-span-1">
//               <img
//                 src="/api/placeholder/120/32"
//                 alt="Axara News Logo"
//                 className="mb-6"
//               />
//               <p className="text-gray-500 text-sm">
//                 Bringing multiple perspectives to every story, enhanced by AI technology.
//               </p>
//             </div>
//             <div>
//               <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
//               <ul className="space-y-2">
//                 {['About', 'Features', 'Careers', 'Contact'].map((item) => (
//                   <li key={item}>
//                     <a href={`#${item.toLowerCase()}`} className="text-gray-500 hover:text-orange-500 text-sm">
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect</h4>
//               <ul className="space-y-2">
//                 {['Twitter', 'Instagram', 'LinkedIn', 'Threads'].map((item) => (
//                   <li key={item}>
//                     <a href="#" className="text-gray-500 hover:text-orange-500 text-sm">
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
//               <ul className="space-y-2 text-sm text-gray-500">
//                 <li>Whitefield, Bengaluru</li>
//                 <li>Karnataka, India - 560067</li>
//                 <li>contact@axaranews.com</li>
//                 <li>+91 - 6361400800</li>
//               </ul>
//             </div>
//           </div><p></p><p></p>
//           <div className="mt-12 pt-8 border-t border-gray-100">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <p className="text-gray-500 text-sm">
//                 © {new Date().getFullYear()} Axara News. All rights reserved.
//               </p>
//               <div className="flex space-x-6 mt-4 md:mt-0">
//                 <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
//                   <Instagram className="h-5 w-5" />
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
//                   <Twitter className="h-5 w-5" />
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
//                   <Linkedin className="h-5 w-5" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ModernLanding;


import React, { useState, useEffect } from 'react';
import { Globe, Users, Briefcase, Instagram, Twitter, Linkedin, Network, ChevronRight, MessageSquare, Bot, Brain, Shield } from 'lucide-react';
import Image from 'next/image';

const ModernLanding = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center justify-start">
              <div className="flex items-center justify-start">
                <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
                   <Image
                    src={"/images/logo4.png"}
                    fill
                    objectFit="contain"
                    alt="Axara News Logo"
                    className="object-contain brightness-200"
                  />
                </div>
            </div>
            </div>
            <div className="hidden md:flex space-x-1">
              {['Home', 'About', 'Features', 'Careers', 'Social', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 rounded-full text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:24px_24px]">
        <div style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          transition: 'transform 0.2s ease-out'
        }} className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-orange-900/20 opacity-50"></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-orange-700/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content wrapper with improved spacing */}
      <div className="relative w-full flex flex-col min-h-screen">
        {/* Hero content */}
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                Every Perspective
              </span>
              <br />
              <span className="text-4xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500">
                Every Voice
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Uncover the complete story through AI-powered news analysis
            </p>
            <div className="flex justify-center">
              <button className="group px-8 md:px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 flex items-center">
                <span className="mr-2">Start Reading</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats section with improved mobile layout */}
        <div className="relative bottom-0 w-full px-4 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-4xl font-bold text-orange-500 mb-2">50M+</h3>
              <p className="text-gray-400">Daily Readers</p>
            </div>
            <div className="bg-black/50 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-4xl font-bold text-orange-500 mb-2">99%</h3>
              <p className="text-gray-400">Accuracy Rate</p>
            </div>
            <div className="bg-black/50 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-4xl font-bold text-orange-500 mb-2">200+</h3>
              <p className="text-gray-400">Global Sources</p>
            </div>
          </div>
        </div>

        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"
              style={{
                top: `${20 * i}%`,
                animation: `moveLeft ${10 + i * 2}s linear infinite`,
                opacity: 0.3
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_90%,rgba(251,146,60,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-center">
              Transforming News Consumption
            </h2>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-orange-500/20 shadow-[0_0_50px_rgba(251,146,60,0.1)]">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-orange-500/30"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-orange-500/30"></div>
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                Axara News is the world&apos;s first AI-powered multi-perspective news portal, designed to provide a comprehensive and unbiased understanding of global events. Our platform offers news from a range of viewpoints, including neutral, aligned, differing, and opposing perspectives, as well as offering insights from all parties impacted by each story. This unique approach allows readers to gain a well-rounded understanding of complex issues, fostering critical thinking, empathy, and a deeper appreciation for the intricacies of the world around us.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Axara News leverages advanced AI technology to deliver content that is accurate, engaging, and accessible. Our platform provides an opportunity to break free from echo chambers by offering a broader spectrum of viewpoints, helping readers understand all sides of the story. In doing so, we aim to foster informed decision-making and promote a more discerning, interconnected global community. At Axara News, we believe that understanding differing perspectives is essential to navigating the complexities of the world today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-center">
              Why Choose Axara
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
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 p-8 rounded-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Careers Section */}
      <section id="careers" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.1),transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Careers</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-center">
              Join Our Mission
            </h2>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-12 border border-orange-500/20 shadow-[0_0_50px_rgba(251,146,60,0.1)]">
            <div className="text-center max-w-3xl mx-auto">
              <Bot className="h-16 w-16 text-orange-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-white">Be Part of Our Story</h3>
              <p className="text-gray-300 text-lg mb-8">
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
      <section id="social" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Social</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-center">
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
                <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <social.icon className="h-12 w-12 text-gray-500 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
                  <p className="text-center text-gray-400 group-hover:text-orange-500 transition-colors">{social.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center mb-16">
            <span className="text-orange-500 text-sm uppercase tracking-wider mb-4">Contact</span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-center">
              Get in Touch
            </h2>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-orange-500/20 overflow-hidden shadow-[0_0_50px_rgba(251,146,60,0.1)]">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="space-y-6">
                <div className="bg-orange-500/5 p-8 rounded-2xl border border-orange-500/10">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Our Office</h3>
                  <div className="space-y-4 text-gray-400">
                    <p>Axara News,</p>
                    <p>(Doutya Technologies),</p>
                    <p>Whitefield, Bengaluru,</p>
                    <p>Karnataka, India - 560067</p>
                    <p>Phone : +91 - 6361400800</p>
                    <p>Email : contact@axaranews.com</p>
                  </div>
                  <div className="mt-8 flex space-x-6">
                    <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
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
                      className="w-full px-6 py-4 bg-black/40 border border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-white placeholder-gray-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-6 py-4 bg-black/40 border border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-white placeholder-gray-500"
                    />
                    <textarea
                      placeholder="Message"
                      rows="6"
                      className="w-full px-6 py-4 bg-black/40 border border-orange-500/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-white placeholder-gray-500"
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
      <footer className="bg-black/40 border-t border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
                   <Image
                    src={"/images/logo4.png"}
                    fill
                    objectFit="contain"
                    alt="Axara News Logo"
                    className="object-contain brightness-200"
                  />
                </div>
              <p className="text-gray-400 text-sm">
                Bringing multiple perspectives to every story, enhanced by AI technology.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Features', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2">
                {['Twitter', 'Instagram', 'LinkedIn', 'Threads'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Whitefield, Bengaluru</li>
                <li>Karnataka, India - 560067</li>
                <li>contact@axaranews.com</li>
                <li>+91 - 6361400800</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-orange-500/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Axara News. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
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