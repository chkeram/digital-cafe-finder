import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { cafeService } from '../services/CafeService';

const CafeMarker = ({ cafe, selectedCafe, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleVote = async (type) => {
    try {
      await cafeService.updateCafeVote(cafe.id, type);
      // Refresh the cafe data
      const updatedCafe = await cafeService.getCafes().then(cafes => 
        cafes.find(c => c.id === cafe.id)
      );
      onSelect(updatedCafe);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <>
      {cafe?.latitude && cafe?.longitude && (
        <Marker
          position={{ lat: cafe.latitude, lng: cafe.longitude }}
          onClick={() => {
            onSelect(cafe);
            setIsOpen(true);
          }}
          icon={{
            url: `https://maps.google.com/mapfiles/ms/icons/${
              (cafe.rating || 0) >= 70 ? 'green' : (cafe.rating || 0) >= 40 ? 'yellow' : 'red'
            }-dot.png`
          }}
        />
      )}
      {isOpen && selectedCafe?.id === cafe.id && (
        <InfoWindow
          position={{ lat: cafe.latitude, lng: cafe.longitude }}
          onCloseClick={() => setIsOpen(false)}
        >
          <div style={{ padding: '10px' }}>
            <h3>{cafe.name}</h3>
            <p>Rating: {cafe.rating}%</p>
            <p>WiFi: {cafe.wifiQuality}</p>
            <p>Power Outlets: {cafe.powerOutlets}</p>
            <p>Noise Level: {cafe.noiseLevel}</p>
            <p>Food Quality: {cafe.foodQuality}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => handleVote('upvote')} style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}>👍</button>
              <button onClick={() => handleVote('downvote')} style={{
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
    </>
  );
};

export default CafeMarker;
