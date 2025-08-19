import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface ExtracurricularStory {
  id: string;
  name?: string;
  role?: string;
  impact?: string;
  skills?: string;
  story?: string;
}

export interface StoryBuilderData {
  personalStory?: string;
  ecs?: ExtracurricularStory[];
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
    const data = docSnap.data() as StoryBuilderData;
    // Ensure ecs is an array
    if (!Array.isArray(data.ecs)) {
      data.ecs = [];
    }
    return data;
  } else {
    // Return a default structure if no data exists
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

// Function to save story builder data for a user
export const saveStoryBuilderData = async (userId: string, data: StoryBuilderData) => {
  const docRef = doc(db, `users/${userId}/storyBuilder/data`);
  await setDoc(docRef, data, { merge: true });
};
