/**
 * @fileOverview This file contains functions for interacting with the user's
 * Story Builder data in Firestore. It provides methods to get and save the
 * complete narrative, which includes personal stories, extracurriculars,
 * achievements, and more.
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Defines the structure for a single extracurricular activity within the Story Builder.
 */
export interface ExtracurricularStory {
  id: string;
  name?: string;
  role?: string;
  impact?: string;
  skills?: string;
  story?: string;
}

/**
 * Defines the complete data structure for a user's Story Builder narrative.
 */
export interface StoryBuilderData {
  personalStory?: string;
  ecs?: ExtracurricularStory[];
  achievements?: string;
  grades?: string;
  struggles?: string;
  skills?: string;
}

/**
 * Retrieves the Story Builder data for a specific user from Firestore.
 * If no data exists, it returns a default, empty structure. It also ensures
 * that the `ecs` field is always initialized as an array to prevent runtime errors.
 *
 * @param userId - The unique ID of the user whose data is to be fetched.
 * @returns A promise that resolves to the user's StoryBuilderData or a default empty object.
 */
export const getStoryBuilderData = async (userId: string): Promise<StoryBuilderData | null> => {
  const docRef = doc(db, `users/${userId}/storyBuilder/data`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as StoryBuilderData;
    // Ensure ecs is an array to prevent downstream errors.
    if (!Array.isArray(data.ecs)) {
      data.ecs = [];
    }
    return data;
  } else {
    // Return a default structure if no data exists to ensure consistency.
    return {
      personalStory: '',
      ecs: [],
      achievements: '',
      grades: '',
      struggles: '',
      skills: ''
    };
  }
};

/**
 * Saves or updates the Story Builder data for a specific user in Firestore.
 * It uses { merge: true } to allow for partial updates without overwriting the entire document.
 *
 * @param userId - The unique ID of the user whose data is to be saved.
 * @param data - The StoryBuilderData object to save.
 * @returns A promise that resolves when the save operation is complete.
 */
export const saveStoryBuilderData = async (userId: string, data: StoryBuilderData): Promise<void> => {
  const docRef = doc(db, `users/${userId}/storyBuilder/data`);
  await setDoc(docRef, data, { merge: true });
};
