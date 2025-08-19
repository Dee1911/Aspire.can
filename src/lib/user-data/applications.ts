
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

export interface Application {
  id: string;
  name: string;
  deadline: string;
  type: 'Reach' | 'Target' | 'Safety';
}

export type ApplicationData = Omit<Application, 'id'>;


// Function to get all applications for a user
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
    const newAppRef = await addDoc(collection(db, `users/${userId}/applications`), application);
    return newAppRef.id;
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
