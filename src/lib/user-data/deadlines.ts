
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  where,
  writeBatch,
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

// Function to delete a deadline by its own ID or by its sourceId
export const deleteDeadline = async (userId: string, id: string, bySourceId: boolean = false) => {
  const deadlinesRef = collection(db, `users/${userId}/deadlines`);
  if (bySourceId) {
    // If deleting by sourceId (e.g., when an application is deleted)
    const q = query(deadlinesRef, where("sourceId", "==", id));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
  } else {
    // If deleting by the deadline's own document ID
    const deadlineRef = doc(db, `users/${userId}/deadlines`, id);
    await deleteDoc(deadlineRef);
  }
};
