'use client';
import { usePageViewTracker } from "@/app/_components/(analytics)/usePageViewTracker";

 // Indicating this is a Client Component

export default function HomeLayout({ children }) {
// usePageViewTracker();

  return (
    <div>
      {children} {/* This renders all the pages or components inside /home */}
    </div>
  );
}
