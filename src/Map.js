import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import CafeMarker from './components/CafeMarker';
import { cafeService } from './services/CafeService';

const containerStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden'
};

const Map = ({ cafes = [], selectedFilters = [] }) => {
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

  const [selectedCafe, setSelectedCafe] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.9838, // Athens latitude
    lng: 23.7275  // Athens longitude
  });

  // Update map center when cafes change
  useEffect(() => {
    if (cafes.length > 0) {
      // Calculate average center of all cafes
      const totalLat = cafes.reduce((sum, cafe) => sum + (cafe.latitude || 0), 0);
      const totalLng = cafes.reduce((sum, cafe) => sum + (cafe.longitude || 0), 0);
      setMapCenter({
        lat: totalLat / cafes.length,
        lng: totalLng / cafes.length
      });
    }
  }, [cafes]);

  // Filter cafes based on selected filters
  const filteredCafes = cafes.filter(cafe => {
    if (selectedFilters.includes('popular') && cafe.rating < 4) return false;
    if (selectedFilters.includes('wifi') && cafe.wifiQuality !== 'excellent') return false;
    if (selectedFilters.includes('outlets') && cafe.powerOutlets !== 'plentiful') return false;
    return true;
  });

  const handleCafeSelect = (cafe) => {
    setSelectedCafe(cafe);
    setMapCenter({ lat: cafe.latitude, lng: cafe.longitude });
  };

  return (
    <div style={containerStyle}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: true,
            gestureHandling: 'greedy',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          }}
        >
          {filteredCafes.map(cafe => (
            <CafeMarker
              key={cafe.id}
              cafe={cafe}
              selectedCafe={selectedCafe}
              onSelect={handleCafeSelect}
            />
          ))}
          {selectedCafe && (
            <InfoWindow
              position={{ lat: selectedCafe.latitude, lng: selectedCafe.longitude }}
              onCloseClick={() => setSelectedCafe(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -30)
              }}
            >
              <div className="info-window">
                <h3>{selectedCafe.name}</h3>
                <p>{selectedCafe.address}</p>
                <div className="details">
                  <p>Rating: {selectedCafe.rating}</p>
                  <p>WiFi: {selectedCafe.wifiQuality}</p>
                  <p>Power Outlets: {selectedCafe.powerOutlets}</p>
                  <p>Noise Level: {selectedCafe.noiseLevel}</p>
                  <p>Food Quality: {selectedCafe.foodQuality}</p>
                </div>
                <div className="ratings">
                  <button onClick={() => cafeService.updateCafeVote(selectedCafe.id, 'up')} style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}>👍</button>
                  <button onClick={() => cafeService.updateCafeVote(selectedCafe.id, 'down')} style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}>👎</button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          Loading map...
        </div>
      )}
    </div>
  );
};

export default React.memo(Map);
