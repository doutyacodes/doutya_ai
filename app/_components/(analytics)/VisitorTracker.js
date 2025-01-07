// components/VisitorTracker.js (Client Component)
'use client'; // This marks the component as client-side
import { useVisitorTracker } from "@/utils/visitorTracker";


export default function VisitorTracker() {
  useVisitorTracker(); // Track visitor on the client

  return null; // This component doesn't need to render anything
}