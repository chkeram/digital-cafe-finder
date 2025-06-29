import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { Cafe } from '../models/Cafe';
import { sampleCafes } from '../data/sampleCafes';

export class CafeService {
  constructor() {
    this.cafesCollection = collection(db, 'cafes');
  }

  async addCafe(cafeData) {
    try {
      const docRef = await addDoc(this.cafesCollection, cafeData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding cafe:', error);
      throw error;
    }
  }

  async getCafes(searchQuery = '', filters = []) {
    try {
      console.log('Checking if cafes exist in database...');
      const initialQuerySnapshot = await getDocs(this.cafesCollection);
      
      if (initialQuerySnapshot.empty) {
        console.log('No cafes found in database, adding sample cafes...');
        console.log('Sample cafes data:', sampleCafes);
        
        for (const cafe of sampleCafes) {
          const cafeData = {
            ...cafe,
            rating: parseFloat(cafe.rating),
            upvotes: parseInt(cafe.upvotes),
            downvotes: parseInt(cafe.downvotes),
            createdAt: cafe.createdAt,
            updatedAt: cafe.updatedAt
          };
          console.log('Adding cafe:', cafeData.name);
          const docRef = await addDoc(this.cafesCollection, cafeData);
          console.log(`Successfully added cafe ${cafeData.name} with ID: ${docRef.id}`);
        }
        console.log('All sample cafes added successfully!');
      } else {
        console.log('Cafes already exist in database');
      }

      // Build query based on search and filters
      let q = query(this.cafesCollection);
      
      if (searchQuery) {
        q = query(q, where('address', '>=', searchQuery), where('address', '<=', searchQuery + '\uf8ff'));
      }

      if (filters.includes('popular')) {
        q = query(q, where('rating', '>=', 4.5));
      }

      if (filters.includes('wifi')) {
        q = query(q, where('wifiQuality', '==', 'excellent'));
      }

      if (filters.includes('outlets')) {
        q = query(q, where('powerOutlets', '==', 'plentiful'));
      }

      const querySnapshot = await getDocs(q);
      const cafes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return cafes;
    } catch (error) {
      console.error('Error getting cafes:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name
      });
      throw error;
    }
  }

  async updateCafeVote(cafeId, voteType) {
    try {
      const cafeRef = doc(db, 'cafes', cafeId);
      const cafeDoc = await getDocs(cafeRef);
      const cafeData = cafeDoc.data();
      
      const cafe = new Cafe(cafeData);
      cafe.updateVote(voteType);
      
      await updateDoc(cafeRef, {
        upvotes: cafe.upvotes,
        downvotes: cafe.downvotes,
        rating: cafe.rating,
        updatedAt: cafe.updatedAt
      });
    } catch (error) {
      console.error('Error updating cafe vote:', error);
      throw error;
    }
  }
}

export const cafeService = new CafeService();
