import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

export interface Application {
  id: string;
  name: string;
  deadline: string;
  type: 'Reach' | 'Target' | 'Safety';
  progress: 'Not Started' | 'In Progress' | 'Applied' | 'Completed';
}

export type ApplicationData = Omit<Application, 'id'>;


// Function to get all applications for a user
export const getApplications = async (userId: string): Promise<Application[]> => {
  const q = query(collection(db, `users/${userId}/applications`));
  const querySnapshot = await getDocs(q);
  const applications: Application[] = [];
  querySnapshot.forEach((doc) => {
    applications.push({ id: doc.id, ...doc.data() } as Application);
  });
  return applications;
};

// Function to add a new application for a user
export const addApplication = async (userId: string, application: ApplicationData): Promise<string> => {
  const docRef = await addDoc(collection(db, `users/${userId}/applications`), application);
  return docRef.id;
};

// Function to update an application
export const updateApplication = async (userId: string, applicationId: string, data: Partial<ApplicationData>) => {
  const appRef = doc(db, `users/${userId}/applications`, applicationId);
  await updateDoc(appRef, data);
};

// Function to delete an application
export const deleteApplication = async (userId: string, applicationId: string) => {
  const appRef = doc(db, `users/${userId}/applications`, applicationId);
  await deleteDoc(appRef);
};
