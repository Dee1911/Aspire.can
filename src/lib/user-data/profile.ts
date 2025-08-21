/**
 * @fileOverview This file manages user profile data in Firestore, handling
 * the creation, retrieval, and updating of user-specific information,
 * particularly related to the onboarding process.
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Defines the structure of a user's profile, capturing key information
 * from the onboarding process.
 */
export interface UserProfile {
  grade: string;
  average: string;
  courses: string;
  dreamPrograms: string;
  onboardingComplete: boolean;
}

/**
 * Saves or merges user profile data into Firestore.
 * This function uses { merge: true } to allow for partial updates,
 * such as updating only the onboarding status without affecting other profile fields.
 *
 * @param userId - The unique identifier for the user.
 * @param profileData - A partial or complete UserProfile object to save.
 * @returns A promise that resolves when the data has been successfully saved.
 */
export const saveUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, profileData, { merge: true });
};

/**
 * Retrieves a user's profile from Firestore.
 * If the user document does not exist, it creates a default one with
 * `onboardingComplete: false`. This ensures that a user document always
 * exists for every authenticated user, which is crucial for other parts of the app.
 *
 * @param userId - The unique identifier for the user.
 * @returns A promise that resolves to the UserProfile object or null if retrieval fails unexpectedly.
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    // To support efficient queries, a user document must always exist.
    // Create a default one if it's missing.
    await setDoc(docRef, { onboardingComplete: false });
    const newDocSnap = await getDoc(docRef);
    return newDocSnap.data() as UserProfile;
  }
};
