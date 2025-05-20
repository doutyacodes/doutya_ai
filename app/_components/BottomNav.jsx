"use client";

import { useEffect, useState } from 'react';
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
    } else if (path === '/hyperlocal/map' || path.startsWith('/hyperlocal/map/')) {
      return '/hyperlocal/map';
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
      displayName: ['News', '']
    },
    {
      name: 'Kids News',
      path: '/news-kids',
      displayName: ['Kids', 'News']
    },
    {
      name: 'News Map',
      path: '/news-maps',
      displayName: ['News', 'Map']
    },
    {
      name: 'Local News',
      path: '/hyperlocal/map',
      displayName: ['Local', 'News']
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
    // For hyperlocal map tab
    else if (tabPath === '/hyperlocal/map') {
      return pathname === '/hyperlocal/map' || pathname.startsWith('/hyperlocal/map/');
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-2 md:pb-4 z-10">
      {/* Desktop view - wider nav */}
      <div className="hidden md:flex bg-red-800/85 shadow-lg rounded-full items-center justify-around px-6 h-16 w-full max-w-4xl mx-8">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`flex items-center justify-center px-5 py-2 rounded-full transition-colors duration-200 ${
              isTabActive(tab.path)
                ? 'bg-white text-red-800 font-semibold'
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            <span className="text-sm font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
      
      {/* Mobile view - updated to match desktop style without icons */}
      <div className="flex md:hidden bg-red-800/85 shadow-lg rounded-full items-center justify-around h-14 w-full max-w-xl mx-2">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`flex flex-col items-center justify-center px-3 ${
              isTabActive(tab.path)
                ? 'bg-white/20 rounded-full text-white font-medium'
                : 'text-white/80 hover:text-white'
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            <div className="flex flex-col items-center justify-center py-1">
              <span className="text-xs leading-tight">{tab.displayName[0]}</span>
              {tab.displayName[1] && (
                <span className="text-xs leading-tight">{tab.displayName[1]}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}