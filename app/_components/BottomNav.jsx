"use client";

import { useEffect, useState } from 'react';
import { Map, Newspaper, Users } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  
  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);
  
  const tabs = [
    {
      name: 'Zaeser News',
      path: '/viewpoint',
      icon: <Newspaper size={20} />,
    },
    {
      name: 'Zaeser Kids',
      path: '/news/',
      icon: <Users size={20} />,
    },
    {
      name: 'News Map',
      path: '/news-map',
      icon: <Map size={20} />,
    },
  ];

  const handleTabClick = (path) => {
    setActiveTab(path);
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-10">
    {/* Desktop view - wider nav */}
    <div className="hidden md:flex bg-white shadow-lg rounded-full items-center justify-around px-6 h-16 w-full max-w-3xl mx-8">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`flex items-center justify-center px-6 py-2 rounded-full transition-colors duration-200 ${
            pathname.startsWith(tab.path)
              ? 'bg-red-800 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick(tab.path)}
        >
          <span className="mr-2">{tab.icon}</span>
          <span className="text-sm font-medium">{tab.name}</span>
        </button>
      ))}
    </div>
    
    {/* Mobile view - better spacing */}
    <div className="flex md:hidden bg-white shadow-lg rounded-full items-center justify-around px-3 h-16 w-full max-w-xl mx-4">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`flex flex-col items-center justify-center rounded-full px-3 py-1 ${
            pathname.startsWith(tab.path)
              ? 'bg-red-800 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleTabClick(tab.path)}
        >
          <span className="mb-1">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.name}</span>
        </button>
      ))}
    </div>
  </div>
  );
}