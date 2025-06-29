import { db } from '../firebase';
import { cafeService } from './services/CafeService';

// Sample cafes data
const sampleCafes = [
  {
    name: "Café de Flore",
    address: "172 Boulevard Saint-Germain, 75006 Paris, France",
    latitude: 48.8575,
    longitude: 2.3355,
    wifiQuality: "excellent",
    powerOutlets: "plentiful",
    noiseLevel: "moderate",
    foodQuality: "excellent"
  },
  {
    name: "Le Procope",
    address: "13 Rue de l'Ancienne Comédie, 75006 Paris, France",
    latitude: 48.8570,
    longitude: 2.3360,
    wifiQuality: "good",
    powerOutlets: "available",
    noiseLevel: "busy",
    foodQuality: "good"
  },
  {
    name: "Café de la Paix",
    address: "10 Place de l'Opéra, 75009 Paris, France",
    latitude: 48.8700,
    longitude: 2.3350,
    wifiQuality: "excellent",
    powerOutlets: "plentiful",
    noiseLevel: "moderate",
    foodQuality: "very good"
  }
];

export const setupFirebase = async () => {
  try {
    // Add sample cafes
    for (const cafeData of sampleCafes) {
      await cafeService.addCafe(cafeData);
    }
    console.log('Sample cafes added successfully!');
  } catch (error) {
    console.error('Error setting up Firebase:', error);
  }
};
