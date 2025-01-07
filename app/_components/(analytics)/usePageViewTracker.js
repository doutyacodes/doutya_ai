'use client'; // Make sure this is a Client Component
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Use usePathname for URL
import Cookies from 'js-cookie';

export function usePageViewTracker() {
  const pathname = usePathname(); // Get the current page URL using next/navigation
  const sessionId = Cookies.get('session_id'); // Get session ID from cookies

  useEffect(() => {
    const startTime = Date.now(); // Capture when the page starts loading

    // Send page view data when the page is unloaded or when the route changes
    const handleBeforeUnload = async () => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000); // Calculate time spent on page in seconds

      // Send page view data to the backend
      await fetch('/api/track-page-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,   // The session ID you created earlier
          pageUrl: pathname,      // Use the pathname from next/navigation
          timeOnPage: timeOnPage,
        }),
      });
    };

    // Add event listener for before the page is unloaded
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener when the component is unmounted or the page is changed
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [pathname, sessionId]); // Track when the page changes or session ID changes
}
