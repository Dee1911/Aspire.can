/**
 * @fileOverview This file provides functions for managing user-specific deadlines
 * in Firestore. It allows for adding, retrieving, and deleting deadlines, which
 * are used to populate the user's calendar.
 */

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

/**
 * Represents a single deadline item.
 */
export interface Deadline {
  id: string;
  date: string; // Stored in YYYY-MM-DD format.
  name: string;
  type: 'Program' | 'Scholarship' | 'Task';
  sourceId?: string; // Optional foreign key to link back to an application or scholarship.
}

/**
 * The data required to create a new deadline. Omits the `id` which is auto-generated.
 */
export type DeadlineData = Omit<Deadline, 'id'>;

/**
 * Fetches all deadlines for a given user from Firestore.
 *
 * @param userId The unique ID of the user.
 * @returns A promise that resolves to an array of Deadline objects.
 */
export const getDeadlines = async (userId: string): Promise<Deadline[]> => {
  const q = query(collection(db, `users/${userId}/deadlines`));
  const querySnapshot = await getDocs(q);
  const deadlines: Deadline[] = [];
  querySnapshot.forEach((doc) => {
    deadlines.push({ id: doc.id, ...doc.data() } as Deadline);
  });
  return deadlines;
};

/**
 * Adds a new deadline to a user's collection in Firestore.
 *
 * @param userId The unique ID of the user.
 * @param deadline The deadline data to add.
 * @returns A promise that resolves with the ID of the newly created deadline document.
 */
export const addDeadline = async (userId: string, deadline: DeadlineData): Promise<string> => {
  const docRef = await addDoc(collection(db, `users/${userId}/deadlines`), deadline);
  return docRef.id;
};

/**
 * Deletes a deadline from a user's collection in Firestore.
 * Can delete by the deadline's own document ID or by a `sourceId`
 * (e.g., deleting a calendar event when the source application is deleted).
 *
 * @param userId The unique ID of the user.
 * @param id The ID to delete by (either a document ID or a sourceId).
 * @param bySourceId If true, `id` is treated as a `sourceId` to find and delete matching deadlines.
 * @returns A promise that resolves when the delete operation is complete.
 */
export const deleteDeadline = async (userId:string, id: string, bySourceId: boolean = false): Promise<void> => {
  const deadlinesRef = collection(db, `users/${userId}/deadlines`);
  if (bySourceId) {
    // Query for deadlines matching the sourceId and delete them in a batch.
    const q = query(deadlinesRef, where("sourceId", "==", id));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
  } else {
    // Delete a single deadline by its document ID.
    const deadlineRef = doc(db, `users/${userId}/deadlines`, id);
    await deleteDoc(deadlineRef);
  }
};
