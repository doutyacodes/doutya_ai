import React, { useState } from 'react';
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaThreads, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Menu, X, BookOpen, PhoneCall, PenLine, Newspaper } from 'lucide-react';

function FloatingBubbleNav({ showMenu, setShowMenu }) {
    // Keep local state for backward compatibility
    const [isLocalMenuOpen, setIsLocalMenuOpen] = useState(false);
    
    // Use either props or local state
    const isMobileMenuOpen = showMenu !== undefined ? showMenu : isLocalMenuOpen;
    const setIsMobileMenuOpen = setShowMenu || setIsLocalMenuOpen;

    const socialLinks = [
        // {
        //     name: 'Threads',
        //     icon: FaThreads,
        //     href: 'https://www.threads.net/@axaranews',
        //     color: 'hover:bg-black'
        // },
        // {
        //     name: 'Instagram',
        //     icon: FaInstagram,
        //     href: 'https://www.instagram.com/axaranews/',
        //     color: 'hover:bg-pink-600'
        // },
        // {
        //     name: 'X',
        //     icon: FaXTwitter,
        //     href: 'https://x.com/AxaraNews',
        //     color: 'hover:bg-black'
        // },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            href: 'https://www.linkedin.com/company/doutya',
            color: 'hover:bg-blue-700'
        }
    ];

    const navLinks = [
        { 
          name: 'About Us', 
          href: '/about-us',
          icon: BookOpen,
        },
        { 
          name: 'Contact', 
          href: '/contact-us',
          icon: PhoneCall,
        },
        // { 
        //   name: 'NewsTech', 
        //   href: '/newstech',
        //   icon: Newspaper,
        // },
        // { 
        //   name: 'Be A Creator', 
        //   href: '/hyperlocal',
        //   icon: PenLine,
        // }
    ];

    // Only show the floating button if not controlled by parent
    const showFloatingButton = showMenu === undefined;

    return (
        <>
            {/* Overlay */}
            <div 
                className={`md:hidden absolute inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
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
                        <span className="absolute -top-2 right-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {link.name}
                        </span>
                    </Link>
                ))}
            </div>
            
            {/* Nav Links - Now displays horizontally from the top */}
            {/* <div className={`absolute -top-1 right-10 flex flex-row gap-3 z-50 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
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
            </div> */}

        </>
    );
}

export default FloatingBubbleNav;