
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfile {
  grade: string;
  average: string;
  courses: string;
  dreamPrograms: string;
  onboardingComplete: boolean;
}

export const saveUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, profileData, { merge: true });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    // To support the new, more efficient query in applications.ts, a user doc must exist.
    // Create it if it doesn't.
    await setDoc(docRef, { onboardingComplete: false });
    const newDocSnap = await getDoc(docRef);
    return newDocSnap.data() as UserProfile;
  }
};
