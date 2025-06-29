import React from 'react';
import { Marker } from '@react-google-maps/api';
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

  if (!cafe?.latitude || !cafe?.longitude) return null;

  const markerColor = () => {
    const rating = cafe.rating || 0;
    if (rating >= 70) return 'green';
    if (rating >= 40) return 'yellow';
    return 'red';
  };

  return (
    <Marker
      position={{ lat: cafe.latitude, lng: cafe.longitude }}
      onClick={() => {
        onSelect(cafe);
        setIsOpen(true);
      }}
      icon={{
        url: `https://maps.google.com/mapfiles/ms/icons/${markerColor()}-dot.png`,
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 30)
      }}
    />
  );
};

export default CafeMarker;
