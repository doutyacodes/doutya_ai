"use client";

import { useEffect, useState } from 'react';
import { Map, Newspaper, Users } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));
  
  // Function to determine active tab based on current path
  function getActiveTabFromPath(path) {
    if (path === '/news' || path.startsWith('/news/')) {
      return '/news';
    } else if (path === '/news-kids' || path.startsWith('/news-kids/')) {
      return '/news-kids';
    } else if (path === '/news-maps' || path.startsWith('/news-maps/')) {
      return '/news-maps';
    }
    return path;
  }
  
  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [pathname]);
  
  const tabs = [
    {
      name: 'News',
      path: '/news',
      icon: <Newspaper size={20} />,
    },
    {
      name: 'News For Kids',
      path: '/news-kids',
      icon: <Users size={20} />,
    },
    {
      name: 'News Map',
      path: '/news-maps',
      icon: <Map size={20} />,
    },
  ];

  const handleTabClick = (path) => {
    setActiveTab(path);
    router.push(path);
  };

  // Helper function to check if a tab is active
  const isTabActive = (tabPath) => {
    // For news tab
    if (tabPath === '/news') {
      return pathname === '/news' || pathname.startsWith('/news/');
    }
    // For news-kids tab
    else if (tabPath === '/news-kids') {
      return pathname === '/news-kids' || pathname.startsWith('/news-kids/');
    }
    // For news-map tab
    else if (tabPath === '/news-maps') {
      return pathname === '/news-maps' || pathname.startsWith('/news-maps/');
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-10">
      {/* Desktop view - wider nav */}
      <div className="hidden md:flex bg-red-800/85 shadow-lg rounded-full items-center justify-around px-6 h-16 w-full max-w-3xl mx-8">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`flex items-center justify-center px-6 py-2 rounded-full transition-colors duration-200 ${
              isTabActive(tab.path)
                ? 'bg-white text-red-800 font-semibold'
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            {/* <span className="mr-2">{tab.icon}</span> */}
            <span className="text-sm font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
      
      {/* Mobile view - better spacing */}
      <div className="flex md:hidden bg-red-800/85 shadow-lg rounded-full items-center justify-around px-3 h-16 w-full max-w-xl mx-4">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`flex flex-col items-center justify-center rounded-full px-3 py-1 ${
              isTabActive(tab.path)
                ? 'bg-white text-red-800 font-semibold'
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            {/* <span className="mb-1">{tab.icon}</span> */}
            <span className="text-xs font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}