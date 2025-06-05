import React from 'react';
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaThreads, FaXTwitter, FaYoutube } from "react-icons/fa6";

const SocialMediaNav = () => {
      const socialLinks = [
          // {
          //     name: 'Facebook',
          //     icon: FaFacebookF,
          //     href: 'https://facebook.com/yourpage',
          //     // color: 'bg-orange-600 hover:bg-orange-700'
          //     color: 'hover:bg-blue-600'
          // },
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
          //     // color: 'bg-orange-600 hover:bg-orange-700'
          //     color: 'hover:bg-pink-600'
          // },
          // {
          //     name: 'X',
          //     icon: FaXTwitter,
          //     href: 'https://x.com/AxaraNews',
          //     // color: 'bg-orange-600 hover:bg-orange-700'
          //     color: 'hover:bg-black'
          // },
          {
              name: 'LinkedIn',
              icon: FaLinkedinIn,
              href: 'https://www.linkedin.com/company/doutya',
              // color: 'bg-orange-600 hover:bg-orange-700'
              color: 'hover:bg-blue-700'
          }
      ];
  
  return (
    <div className="hidden md:flex justify-center items-center gap-2">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 md:border-2 transition-all duration-300 ${social.color} hover:border-transparent group me-2`}
            aria-label={social.name}
            // md:w-8 md:h-8 
            //  md:w-4 md:h-4
          >
            <Icon 
              className="w-3 h-3  text-gray-600 group-hover:text-white transition-colors" 
            />
          </a>
        );
      })}
    </div>

  );
  
};

export default SocialMediaNav;