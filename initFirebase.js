import { setupFirebase } from './src/utils/firebaseSetup';

async function initialize() {
  console.log('Initializing Firebase...');
  try {
    await setupFirebase();
    console.log('Firebase initialization completed successfully!');
  } catch (error) {
    console.error('Error during Firebase initialization:', error);
  }
}

initialize();
