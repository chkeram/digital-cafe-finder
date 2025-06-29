import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import CafeMarker from './components/CafeMarker';
import { cafeService } from './services/CafeService';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 48.8566, // Paris latitude
  lng: 2.3522   // Paris longitude
};

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  // Check if Firebase is properly initialized
  useEffect(() => {
    if (!process.env.REACT_APP_FIREBASE_API_KEY) {
      console.error('Firebase API key is missing in .env.local');
    }
    if (!process.env.REACT_APP_FIREBASE_PROJECT_ID) {
      console.error('Firebase Project ID is missing in .env.local');
    }
  }, []);

  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        console.log('Fetching cafes...');
        const data = await cafeService.getCafes();
        console.log('Fetched cafes:', data);
        setCafes(data);
      } catch (error) {
        console.error('Error fetching cafes:', error);
      }
    };
    fetchCafes();
  }, []);

  const handleCafeSelect = (cafe) => {
    setSelectedCafe(cafe);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      {cafes.map(cafe => (
        <CafeMarker
          key={cafe.id}
          cafe={cafe}
          selectedCafe={selectedCafe}
          onSelect={handleCafeSelect}
        />
      ))}
    </GoogleMap>
  ) : <></>;
};

export default React.memo(Map);
