// import React, { useState } from 'react';
// import Link from "next/link";
// import { FaFacebookF, FaInstagram, FaLinkedinIn, FaThreads, FaXTwitter, FaYoutube } from "react-icons/fa6";
// import { Menu, X, BookOpen, PhoneCall } from 'lucide-react';

// function FloatingBubbleNav({ isOpen, setIsOpen, position = "bottom" }) {
//     // If the props aren't passed, use local state (for backwards compatibility)
//     const [localIsOpen, setLocalIsOpen] = useState(false);
    
//     // Use either the props or local state
//     const isMobileMenuOpen = isOpen !== undefined ? isOpen : localIsOpen;
//     const setIsMobileMenuOpen = setIsOpen || setLocalIsOpen;

//     const socialLinks = [
//         {
//             name: 'Threads',
//             icon: FaThreads,
//             href: 'https://www.threads.net/@axaranews',
//             color: 'hover:bg-black'
//         },
//         {
//             name: 'Instagram',
//             icon: FaInstagram,
//             href: 'https://www.instagram.com/axaranews/',
//             color: 'hover:bg-pink-600'
//         },
//         {
//             name: 'X',
//             icon: FaXTwitter,
//             href: 'https://x.com/AxaraNews',
//             color: 'hover:bg-black'
//         },
//         {
//             name: 'LinkedIn',
//             icon: FaLinkedinIn,
//             href: 'https://www.linkedin.com/company/axaranews',
//             color: 'hover:bg-blue-700'
//         }
//     ];

//     const navLinks = [
//         { 
//           name: 'About Us', 
//           href: '/about-us',
//           icon: BookOpen,
//           tooltip: 'About Us'
//         },
//         { 
//           name: 'Contact', 
//           href: '/contact-us',
//           icon: PhoneCall,
//           tooltip: 'Contact'
//         }
//     ];
    
//     // Define positioning classes based on whether it's top or bottom mounted
//     const socialLinksPosition = position === "top" 
//         ? "top-16 right-4 flex-col-reverse" // From top-right
//         : "bottom-14 right-1 flex-col"; // From bottom-right (original)
        
//     const navLinksPosition = position === "top"
//         ? "top-16 right-14 flex-row" // From top-right, horizontal row
//         : "bottom-0 right-14 flex-row"; // From bottom, horizontal row (original)
    
//     // Animations for top vs bottom placement
//     const socialLinkAnimation = position === "top" 
//         ? "opacity-0 -translate-y-4"  // Animate from top (opposite direction)
//         : "opacity-0 translate-y-4";  // Original bottom animation
    
//     const navLinkAnimation = position === "top"
//         ? "opacity-0 -translate-x-4"  // Animate from right but from top position
//         : "opacity-0 translate-x-4";  // Original animation

//     // Only render the floating button if we're NOT using the prop-based control
//     const renderFloatingButton = isOpen === undefined;

//     return (
//         <>
//             {/* Overlay */}
//             <div 
//                 className={`md:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
//                     isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//                 }`}
//                 onClick={() => setIsMobileMenuOpen(false)}
//             />

//             {/* Only render this button if we're not controlling from the parent */}
//             {renderFloatingButton && (
//                 <div className="md:hidden fixed bottom-4 right-4 z-50">
//                     <button
//                         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                         className="bg-red-900 text-white p-2 rounded-full shadow-lg hover:bg-red-800 transition-colors duration-200 w-10 h-10 flex items-center justify-center"
//                     >
//                         {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//                     </button>
//                 </div>
//             )}

//             {/* Social Media Links */}
//             <div className={`md:hidden fixed ${socialLinksPosition} gap-3 transition-all duration-300 z-50 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : `${socialLinkAnimation} pointer-events-none`}`}>
//                 {socialLinks.map((social, index) => (
//                     <Link
//                         key={social.name}
//                         href={social.href}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className={`${social.color} bg-white/90 hover:text-white text-red-900 p-2 rounded-full shadow-md transition-all duration-200 w-10 h-10 flex items-center justify-center hover:scale-110`}
//                         style={{
//                             transitionDelay: `${index * 50}ms`
//                         }}
//                     >
//                         <social.icon size={16} />
//                     </Link>
//                 ))}
//             </div>

//             {/* Nav Links Row */}
//             <div className={`md:hidden fixed ${navLinksPosition} gap-3 transition-all duration-300 z-50 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : `${navLinkAnimation} pointer-events-none`}`}>
//                 {navLinks.map((link, index) => (
//                     <Link
//                         key={link.name}
//                         href={link.href}
//                         onClick={() => setIsMobileMenuOpen(false)}
//                         className="bg-red-900 text-white p-2 rounded-full shadow-md hover:bg-red-800 transition-transform duration-200 w-10 h-10 flex items-center justify-center group relative"
//                         style={{
//                             transitionDelay: `${(index + socialLinks.length) * 50}ms`,
//                         }}
//                     >
//                         <link.icon size={20} />
//                         <span className={`absolute ${position === "top" ? "top-full mt-2" : "-top-8"} left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap`}>
//                             {link.name}
//                         </span>
//                     </Link>
//                 ))}
//             </div>
//         </>
//     );
// }

// export default FloatingBubbleNav;


import React, { useState } from 'react';
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaThreads, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Menu, X, BookOpen, PhoneCall } from 'lucide-react';

function FloatingBubbleNav({ showMenu, setShowMenu }) {
    // Keep local state for backward compatibility
    const [isLocalMenuOpen, setIsLocalMenuOpen] = useState(false);
    
    // Use either props or local state
    const isMobileMenuOpen = showMenu !== undefined ? showMenu : isLocalMenuOpen;
    const setIsMobileMenuOpen = setShowMenu || setIsLocalMenuOpen;

    const socialLinks = [
        {
            name: 'Threads',
            icon: FaThreads,
            href: 'https://www.threads.net/@axaranews',
            color: 'hover:bg-black'
        },
        {
            name: 'Instagram',
            icon: FaInstagram,
            href: 'https://www.instagram.com/axaranews/',
            color: 'hover:bg-pink-600'
        },
        {
            name: 'X',
            icon: FaXTwitter,
            href: 'https://x.com/AxaraNews',
            color: 'hover:bg-black'
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            href: 'https://www.linkedin.com/company/axaranews',
            color: 'hover:bg-blue-700'
        }
    ];

    const navLinks = [
        { 
          name: 'About Us', 
          href: '/about-us',
          icon: BookOpen,
          tooltip: 'About Us'
        },
        { 
          name: 'Contact', 
          href: '/contact-us',
          icon: PhoneCall,
          tooltip: 'Contact'
        }
    ];

    // Only show the floating button if not controlled by parent
    const showFloatingButton = showMenu === undefined;

    return (
        <>
            {/* Overlay */}
            <div 
                className={`md:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Only show the floating button if not controlled by Navbar */}
            {showFloatingButton && (
                <div className="md:hidden fixed bottom-4 right-4 z-50">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="bg-red-900 text-white p-2 rounded-full shadow-lg hover:bg-red-800 transition-colors duration-200 w-10 h-10 flex items-center justify-center"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            )}

            {/* Social Media Links - Now displays from top when menu opens */}
            <div className={`md:hidden fixed top-16 right-3 flex flex-col gap-3 transition-all duration-300 z-50 ${
                isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}>
                {socialLinks.map((social, index) => (
                    <Link
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${social.color} bg-white/90 hover:text-white text-red-900 p-2 rounded-full shadow-md transition-all duration-200 w-10 h-10 flex items-center justify-center hover:scale-110`}
                        style={{
                            transitionDelay: `${index * 50}ms`
                        }}
                    >
                        <social.icon size={16} />
                    </Link>
                ))}
            </div>
            
            {/* Nav Links - Now displays horizontally from the top */}
            {/* <div className={`md:hidden fixed top-16 left-0 flex flex-row gap-3 transition-all duration-300 z-50 ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
            }`}>
                {navLinks.map((link, index) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="bg-red-900 text-white p-2 rounded-full shadow-md hover:bg-red-800 transition-transform duration-200 w-10 h-10 flex items-center justify-center group relative"
                        style={{
                            transitionDelay: `${(index + socialLinks.length) * 50}ms`,
                        }}
                    >
                        <link.icon size={20} />
                        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {link.name}
                        </span>
                    </Link>
                ))}
            </div> */}

            <div className={`absolute -top-1 right-10 flex flex-row gap-3 z-50 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                {navLinks.map((link, index) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={()=>setIsMobileMenuOpen(false)}
                        className="bg-red-900 text-white p-2 rounded-full shadow-md hover:bg-red-900 transition-transform duration-200 w-10 h-10 flex items-center justify-center group relative"
                        style={{
                            transitionDelay: `${(index + socialLinks.length) * 50}ms`,
                        }}
                    >
                        <link.icon size={20} />
                        <span className="absolute -top-8 right-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {link.name}
                        </span>
                    </Link>
                ))}
            </div>

        </>
    );
}

export default FloatingBubbleNav;