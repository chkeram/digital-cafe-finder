const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { collection, addDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Check if environment variables are set
if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  console.error('REACT_APP_FIREBASE_API_KEY is not set');
  process.exit(1);
}

if (!process.env.REACT_APP_FIREBASE_PROJECT_ID) {
  console.error('REACT_APP_FIREBASE_PROJECT_ID is not set');
  process.exit(1);
}

// Log the environment variables (for debugging)
console.log('Environment variables loaded:');
console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY);
console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('Firebase initialized successfully');
  
  // Test connection
  const testRef = collection(db, 'test');
  console.log('Firestore collection reference created');

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
      foodQuality: "excellent",
      rating: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Café de la Paix",
      address: "10 Place de l'Opéra, 75009 Paris, France",
      latitude: 48.8700,
      longitude: 2.3350,
      wifiQuality: "excellent",
      powerOutlets: "plentiful",
      noiseLevel: "moderate",
      foodQuality: "very good",
      rating: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Add validation function
  const validateCafeData = (cafe) => {
    const requiredFields = ['name', 'address', 'latitude', 'longitude'];
    const valid = requiredFields.every(field => cafe[field] !== undefined);
    
    if (!valid) {
      throw new Error(`Missing required fields. Cafe data: ${JSON.stringify(cafe)}`);
    }
    
    // Validate coordinates
    if (cafe.latitude < -90 || cafe.latitude > 90 || cafe.longitude < -180 || cafe.longitude > 180) {
      throw new Error(`Invalid coordinates for cafe ${cafe.name}`);
    }
  };

  // Validate all cafes
  sampleCafes.forEach(cafe => validateCafeData(cafe));

  async function setupFirebase() {
    try {
      console.log('Initializing Firebase setup...');
      const cafesCollection = collection(db, 'cafes');
      
      // Add sample cafes
      for (const cafeData of sampleCafes) {
        console.log(`Adding cafe: ${cafeData.name}`);
        const docRef = await addDoc(cafesCollection, cafeData);
        console.log(`Successfully added cafe ${cafeData.name} with ID: ${docRef.id}`);
      }
      
      console.log('Sample cafes added successfully!');
    } catch (error) {
      console.error('Error setting up Firebase:', error);
      console.error('Detailed error:', {
        message: error.message,
        code: error.code,
        name: error.name
      });
      throw error;
    }
  }

  setupFirebase();
} catch (error) {
  console.error('Error during Firebase initialization:', error);
  process.exit(1);
}
