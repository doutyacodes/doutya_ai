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
    } else if (path === '/newsonmap' || path.startsWith('/newsonmap/')) {
      return '/newsonmap';
    } else if (path === '/saved-folders' || path.startsWith('/saved-folders/')) {
      return '/saved-folders';
    } else if (path === '/trending' || path.startsWith('/trending/')) {
      return '/trending';
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
      name: 'News on Map',
      path: '/newsonmap',
      displayName: ['News on', 'Map']
    },
    {
      name: 'Saved News',
      path: '/saved-folders',
      displayName: ['Saved', 'News']
    },
    {
      name: 'Trending News',
      path: '/trending',
      displayName: ['Trending', 'News']
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
    // For news-map tab
    else if (tabPath === '/newsonmap') {
      return pathname === '/newsonmap' || pathname.startsWith('/newsonmap/');
    }
    // For saved news tab
    else if (tabPath === '/saved-folders') {
      return pathname === '/saved-folders' || pathname.startsWith('/saved-folders/');
    }
    // For trending news tab
    else if (tabPath === '/trending') {
      return pathname === '/trending' || pathname.startsWith('/trending/');
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