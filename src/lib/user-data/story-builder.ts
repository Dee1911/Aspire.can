import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface StoryBuilderData {
  personalStory?: string;
  ecs?: string;
  achievements?: string;
  grades?: string;
  struggles?: string;
  skills?: string;
}

// Function to get story builder data for a user
export const getStoryBuilderData = async (userId: string): Promise<StoryBuilderData | null> => {
  const docRef = doc(db, `users/${userId}/storyBuilder/data`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as StoryBuilderData;
  } else {
    return null;
  }
};

// Function to save story builder data for a user
export const saveStoryBuilderData = async (userId: string, data: StoryBuilderData) => {
  const docRef = doc(db, `users/${userId}/storyBuilder/data`);
  await setDoc(docRef, data, { merge: true });
};
