import { LoadScript } from '@react-google-maps/api';

const libraries = ['places', 'geometry'];

export default function MapProvider({ children }) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
}
