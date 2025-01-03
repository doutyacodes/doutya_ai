import React, { useState } from 'react';
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaThreads, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Menu, X, BookOpen, PhoneCall } from 'lucide-react';

function FloatingBubbleNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const socialLinks = [
        // {
        //     name: 'Facebook',
        //     icon: FaFacebookF,
        //     href: 'https://facebook.com/yourpage',
        //     // color: 'bg-orange-600 hover:bg-orange-700'
        //     color: 'hover:bg-blue-600'
        // },
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
            // color: 'bg-orange-600 hover:bg-orange-700'
            color: 'hover:bg-pink-600'
        },
        {
            name: 'X',
            icon: FaXTwitter,
            href: 'https://x.com/AxaraNews',
            // color: 'bg-orange-600 hover:bg-orange-700'
            color: 'hover:bg-black'
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            href: 'https://www.linkedin.com/company/axaranews',
            // color: 'bg-orange-600 hover:bg-orange-700'
            color: 'hover:bg-blue-700'
        }
    ];

    const navLinks = [
        { 
          name: 'Our Story', 
          href: '/our-story',
          icon: BookOpen,
          tooltip: 'Our Story'
        },
        // { 
        //   name: 'Contact', 
        //   href: '/contact',
        //   icon: PhoneCall,
        //   tooltip: 'Contact'
        // }
      ];


    return (
        <>
            {/* Overlay */}
            <div 
                className={`md:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="md:hidden fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-700 transition-colors duration-200 w-10 h-10 flex items-center justify-center"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className={`absolute bottom-14 right-1 flex flex-col gap-3 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {socialLinks.map((social, index) => (
                        <Link
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${social.color} bg-white/90 hover:text-white text-orange-600 p-2 rounded-full shadow-md transition-all duration-200 w-10 h-10 flex items-center justify-center hover:scale-110`}
                            style={{
                                transitionDelay: `${index * 50}ms`
                            }}
                        >
                            <social.icon size={16} />
                        </Link>
                    ))}
                </div>
                {/* Horizontal Row (Nav Links) */}
                <div className={`absolute bottom-0 right-14 flex flex-row gap-3 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={()=>setIsMobileMenuOpen(false)}
                            className="bg-orange-600 text-white p-2 rounded-full shadow-md hover:bg-orange-700 transition-transform duration-200 w-10 h-10 flex items-center justify-center group relative"
                            style={{
                                transitionDelay: `${(index + socialLinks.length) * 50}ms`,
                            }}
                        >
                            <link.icon size={20} />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                {link.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

        </>
    );
}

export default FloatingBubbleNav;