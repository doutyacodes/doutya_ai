import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid";
import base64url from "base64-url";

export function generateUniqueSlug() {
  return base64url.encode(uuidv4());
}
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Function to calculate distance between two points in kilometers
export default function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}
