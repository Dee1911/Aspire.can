
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
  getDoc,
} from 'firebase/firestore';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export interface Application {
  id: string;
  name: string;
  deadline: string;
  category: 'Application' | 'Standardized Test' | 'Personal';
  type?: 'Reach' | 'Target' | 'Safety';
  tasks?: Task[];
  notes?: string;
}

export type ApplicationData = Omit<Application, 'id'>;

// Function to get a single application with all details
export const getApplication = async (userId: string, applicationId: string): Promise<Application | null> => {
    const appRef = doc(db, `users/${userId}/applications`, applicationId);
    const appSnap = await getDoc(appRef);

    if (!appSnap.exists()) {
        return null;
    }

    const appData = appSnap.data() as ApplicationData;
    
    // In a real-world scenario with many tasks/notes, you might paginate these.
    // For this app's scale, fetching them all is acceptable.
    const tasksQuery = query(collection(db, `users/${userId}/applications/${applicationId}/tasks`));
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));

    const notesRef = doc(db, `users/${userId}/applications/${applicationId}/notes/content`);
    const notesSnap = await getDoc(notesRef);
    const notes = notesSnap.exists() ? notesSnap.data().text : '';

    return {
        id: appSnap.id,
        ...appData,
        tasks,
        notes,
    };
};


// Function to get all applications for a user (summary view)
export const getApplications = async (userId: string): Promise<Application[]> => {
  const appsQuery = query(collection(db, `users/${userId}/applications`));
  const appsSnapshot = await getDocs(appsQuery);
  const applications: Application[] = [];
  
  appsSnapshot.docs.forEach(doc => {
    applications.push({ id: doc.id, ...doc.data() } as Application);
  });
  
  return applications.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};


// Function to add a new application for a user
export const addApplication = async (userId: string, application: ApplicationData): Promise<string> => {
    const { tasks, notes, ...appCoreData } = application;
    const newAppRef = await addDoc(collection(db, `users/${userId}/applications`), appCoreData);
    
    const batch = writeBatch(db);
    
    // Add tasks as a subcollection
    if (tasks && tasks.length > 0) {
        const tasksRef = collection(db, `users/${userId}/applications/${newAppRef.id}/tasks`);
        tasks.forEach(task => {
            const taskRef = doc(tasksRef);
            batch.set(taskRef, task);
        });
    }

    // Add notes as a subcollection
    const notesRef = doc(db, `users/${userId}/applications/${newAppRef.id}/notes/content`);
    batch.set(notesRef, { text: notes || '' });
    
    await batch.commit();

    return newAppRef.id;
};


// Function to update an application
export const updateApplication = async (userId: string, applicationId: string, data: Partial<ApplicationData>) => {
  const { tasks, notes, ...appCoreData } = data;
  const appRef = doc(db, `users/${userId}/applications`, applicationId);

  const batch = writeBatch(db);

  // Update the core application document if there's data for it
  if (Object.keys(appCoreData).length > 0) {
    batch.update(appRef, appCoreData);
  }
  
  // Overwrite the entire tasks subcollection
  if (tasks !== undefined) {
    const tasksCollectionRef = collection(db, `users/${userId}/applications/${applicationId}/tasks`);
    // First, delete existing tasks
    const existingTasksSnapshot = await getDocs(tasksCollectionRef);
    existingTasksSnapshot.forEach(doc => batch.delete(doc.ref));
    // Then, add the new tasks
    tasks.forEach(task => {
        const taskRef = doc(tasksCollectionRef, task.id);
        batch.set(taskRef, task);
    });
  }

  // Update notes
  if (notes !== undefined) {
    const notesRef = doc(db, `users/${userId}/applications/${applicationId}/notes/content`);
    batch.set(notesRef, { text: notes }, { merge: true });
  }

  await batch.commit();
};


// Function to delete an application
export const deleteApplication = async (userId: string, applicationId: string) => {
  // This would need to be a more complex recursive delete for subcollections in production
  // For now, we just delete the main document
  const appRef = doc(db, `users/${userId}/applications`, applicationId);
  await deleteDoc(appRef);
};
