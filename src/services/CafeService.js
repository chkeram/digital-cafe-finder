import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Cafe } from '../models/Cafe';

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

  async getCafes() {
    try {
      console.log('Fetching cafes from Firestore...');
      const querySnapshot = await getDocs(this.cafesCollection);
      console.log('Query snapshot:', querySnapshot);
      const cafes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched cafes:', cafes);
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
