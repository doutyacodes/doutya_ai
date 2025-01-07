// import { v4 as uuidv4 } from 'uuid';
// import Cookies from 'js-cookie';

// export function useVisitorTracker() {
//   // Get or create UUID
//   let visitorUuid = Cookies.get('visitor_uuid');
//   if (!visitorUuid) {
//     visitorUuid = uuidv4(); // Generate a new UUID
//     Cookies.set('visitor_uuid', visitorUuid, { expires: 365 }); // Set cookie for 1 year
//   }

//   // Send UUID to backend
//   const trackVisit = async () => {
//     await fetch('/api/track-visit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ uuid: visitorUuid }),
//     });
//   };

//   return { trackVisit };
// }

"use client"
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useVisitorTracker() {
  // Get or create UUID
  let visitorUuid = Cookies.get('visitor_uuid');
  if (!visitorUuid) {
    visitorUuid = uuidv4(); // Generate a new UUID
    Cookies.set('visitor_uuid', visitorUuid, { expires: 365 }); // Set cookie for 1 year
  }

  // Function to track visit
  const trackVisit = async () => {
    await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid: visitorUuid }),
    });
  };

  // Function to start a new session
  const startSession = async () => {
    const response = await fetch('/api/session/start-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid: visitorUuid }),
    });

    if (response.ok) {
      const { sessionId } = await response.json();
      Cookies.set('session_id', sessionId); // Store session ID in cookies
    }
  };

  // Function to end the current session
  const endSession = async () => {
    const sessionId = Cookies.get('session_id');
    if (!sessionId) return;

    console.log("cokie", sessionId);
    
    await fetch('/api/session/end-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    Cookies.remove('session_id'); // Clean up session ID
  };

  // Call these functions at the appropriate lifecycle events
  useEffect(() => {
    trackVisit(); // Log the visit
    startSession(); // Start a new session

    // End session on page unload
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
