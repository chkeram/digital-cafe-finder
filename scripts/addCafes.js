const admin = require('./initAdmin');
const { sampleCafes } = require('../src/data/sampleCafes');

async function addCafesToDatabase() {
  try {
    const db = admin.firestore();
    
    console.log('Adding cafes to database...');
    
    for (const cafe of sampleCafes) {
      const cafeData = {
        ...cafe,
        rating: parseFloat(cafe.rating),
        upvotes: parseInt(cafe.upvotes),
        downvotes: parseInt(cafe.downvotes),
        createdAt: cafe.createdAt,
        updatedAt: cafe.updatedAt
      };
      
      const docRef = await db.collection('cafes').add(cafeData);
      console.log(`Successfully added cafe ${cafe.name} with ID: ${docRef.id}`);
    }
    
    console.log('All cafes added successfully!');
  } catch (error) {
    console.error('Error adding cafes:', error);
    process.exit(1);
  } finally {
    admin.app().delete();
  }
}

addCafesToDatabase();
