/**
 * @fileOverview This file contains functions for managing user application data in Firestore.
 * It provides an efficient method to get all applications with their sub-collections (tasks, notes)
 * and functions to add, update, and delete application data.
 */

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

/**
 * Defines the structure for a single task within an application's checklist.
 */
export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

/**
 * Defines the main structure for a tracked item in the Journey Tracker.
 * This can be a university application, a standardized test, or a personal task.
 */
export interface Application {
  id:string;
  name: string;
  deadline: string;
  category: 'Application' | 'Standardized Test' | 'Personal';
  type?: 'Reach' | 'Target' | 'Safety'; // Only applicable if category is 'Application'
  tasks?: Task[];
  notes?: string;
}

/**
 * Represents the data required to create a new Application, omitting the auto-generated `id`.
 */
export type ApplicationData = Omit<Application, 'id'>;


/**
 * Fetches all applications for a user along with their associated tasks and notes.
 * This function is optimized to reduce the number of database queries by fetching all
 * application documents first, and is now the primary method for loading the dashboard.
 *
 * @param userId - The unique ID of the user.
 * @returns A promise that resolves to an array of Application objects, sorted by deadline.
 */
export const getApplicationsWithDetails = async (userId: string): Promise<Application[]> => {
    const userRef = doc(db, 'users', userId);
    
    const appsQuery = query(collection(userRef, 'applications'));
    const appsSnapshot = await getDocs(appsQuery);
    
    // Process all applications in parallel.
    const applicationPromises = appsSnapshot.docs.map(async (appDoc) => {
      const appData = { id: appDoc.id, ...appDoc.data() } as Application;
      
      const tasksQuery = query(collection(appDoc.ref, 'tasks'));
      const tasksSnapshot = await getDocs(tasksQuery);
      appData.tasks = tasksSnapshot.docs.map(taskDoc => ({ id: taskDoc.id, ...taskDoc.data() } as Task));

      const notesQuery = query(collection(appDoc.ref, 'notes'));
      const notesSnapshot = await getDocs(notesQuery);
      if (!notesSnapshot.empty) {
        // Assuming one note document per application for simplicity
        appData.notes = notesSnapshot.docs[0].data().text || '';
      } else {
        appData.notes = '';
      }

      return appData;
    });

    const allApplications = await Promise.all(applicationPromises);
    
    // Sort applications by deadline after all data has been fetched.
    return allApplications.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};


/**
 * Adds a new application and its associated sub-collections (tasks, notes) for a user.
 *
 * @param userId - The ID of the user.
 * @param application - The application data to add.
 * @returns A promise that resolves to the new application's ID.
 */
export const addApplication = async (userId: string, application: ApplicationData): Promise<string> => {
    const { tasks, notes, ...appCoreData } = application;
    const newAppRef = await addDoc(collection(db, `users/${userId}/applications`), appCoreData);
    
    const batch = writeBatch(db);
    
    // Add tasks to a sub-collection.
    if (tasks && tasks.length > 0) {
        const tasksCollectionRef = collection(newAppRef, 'tasks');
        tasks.forEach(task => {
            const taskRef = doc(tasksCollectionRef, task.id); // Use explicit ID
            batch.set(taskRef, task);
        });
    }

    // Add notes to a sub-collection.
    const notesCollectionRef = collection(newAppRef, 'notes');
    const noteRef = doc(notesCollectionRef); // Auto-generate ID for note
    batch.set(noteRef, { text: notes || '' });
    
    await batch.commit();

    return newAppRef.id;
};


/**
 * Updates an existing application, including its tasks and notes.
 *
 * @param userId - The ID of the user.
 * @param applicationId - The ID of the application to update.
 * @param data - The partial application data to update.
 */
export const updateApplication = async (userId: string, applicationId: string, data: Partial<ApplicationData>): Promise<void> => {
  const { tasks, notes, ...appCoreData } = data;
  const appRef = doc(db, `users/${userId}/applications`, applicationId);

  const batch = writeBatch(db);

  // Update the core application document if there's data for it.
  if (Object.keys(appCoreData).length > 0) {
    batch.update(appRef, appCoreData);
  }
  
  // Overwrite the tasks sub-collection if new tasks are provided.
  if (tasks !== undefined) {
    const tasksCollectionRef = collection(db, `users/${userId}/applications/${applicationId}/tasks`);
    const existingTasksSnapshot = await getDocs(tasksCollectionRef);
    existingTasksSnapshot.forEach(doc => batch.delete(doc.ref)); // Delete old tasks.
    tasks.forEach(task => { // Add new tasks.
        const taskRef = doc(tasksCollectionRef, task.id);
        batch.set(taskRef, task);
    });
  }

  // Update notes if provided.
  if (notes !== undefined) {
    const notesCollectionRef = collection(db, `users/${userId}/applications/${applicationId}/notes`);
    const notesSnapshot = await getDocs(notesCollectionRef);
    if (!notesSnapshot.empty) {
       const noteDocRef = notesSnapshot.docs[0].ref;
       batch.update(noteDocRef, { text: notes });
    } else {
        const newNoteRef = doc(notesCollectionRef);
        batch.set(newNoteRef, { text: notes });
    }
  }

  await batch.commit();
};


/**
 * Deletes an application and its associated deadline from the calendar.
 * Note: Deleting sub-collections (tasks, notes) requires a more complex
 * server-side function for full cleanup, but this handles the main document.
 *
 * @param userId - The ID of the user.
 * @param applicationId - The ID of the application to delete.
 */
export const deleteApplication = async (userId: string, applicationId: string): Promise<void> => {
  // This would need a more complex recursive delete for subcollections in production.
  // For now, we just delete the main document.
  const appRef = doc(db, `users/${userId}/applications`, applicationId);
  await deleteDoc(appRef);
  // Also delete associated calendar event.
  // This part of the logic has been moved to the component to avoid circular dependencies.
};
