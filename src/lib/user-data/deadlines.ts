import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export interface Deadline {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: 'Program' | 'Scholarship' | 'Task';
  sourceId?: string; // Optional: To link back to an application or scholarship
}

export type DeadlineData = Omit<Deadline, 'id'>;

// Function to get all deadlines for a user
export const getDeadlines = async (userId: string): Promise<Deadline[]> => {
  const q = query(collection(db, `users/${userId}/deadlines`));
  const querySnapshot = await getDocs(q);
  const deadlines: Deadline[] = [];
  querySnapshot.forEach((doc) => {
    deadlines.push({ id: doc.id, ...doc.data() } as Deadline);
  });
  return deadlines;
};

// Function to add a new deadline for a user
export const addDeadline = async (userId: string, deadline: DeadlineData): Promise<string> => {
  const docRef = await addDoc(collection(db, `users/${userId}/deadlines`), deadline);
  return docRef.id;
};

// Function to delete a deadline
export const deleteDeadline = async (userId: string, deadlineId: string) => {
  const deadlineRef = doc(db, `users/${userId}/deadlines`, deadlineId);
  await deleteDoc(deadlineRef);
};
