
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
  collectionGroup,
  where,
} from 'firebase/firestore';

export interface ApplicationTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Application {
  id: string;
  name: string;
  deadline: string;
  type: 'Reach' | 'Target' | 'Safety';
  progress: 'Not Started' | 'In Progress' | 'Applied' | 'Completed';
  notes?: string;
  tasks?: ApplicationTask[];
}

export type ApplicationData = Omit<Application, 'id' | 'tasks'>;
export type ApplicationTaskData = Omit<ApplicationTask, 'id'>;


// Function to get all applications for a user, including their tasks
export const getApplications = async (userId: string): Promise<Application[]> => {
  const appsQuery = query(collection(db, `users/${userId}/applications`));
  const appsSnapshot = await getDocs(appsQuery);

  const applications = await Promise.all(
    appsSnapshot.docs.map(async (appDoc) => {
      const application: Application = { id: appDoc.id, ...appDoc.data() } as Application;
      
      const tasksQuery = query(collection(db, `users/${userId}/applications/${appDoc.id}/tasks`));
      const tasksSnapshot = await getDocs(tasksQuery);
      application.tasks = tasksSnapshot.docs.map(taskDoc => ({ id: taskDoc.id, ...taskDoc.data() } as ApplicationTask));
      
      return application;
    })
  );
  
  return applications.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};


// Function to add a new application for a user, including default tasks
export const addApplication = async (userId: string, application: ApplicationData): Promise<string> => {
    const batch = writeBatch(db);

    const newAppRef = doc(collection(db, `users/${userId}/applications`));
    batch.set(newAppRef, application);

    const defaultTasks = [
        { text: 'Complete Supplementary Application', completed: false },
        { text: 'Request Reference Letters', completed: false },
        { text: 'Submit Portfolio (if applicable)', completed: false },
        { text: 'Pay Application Fee', completed: false },
    ];

    defaultTasks.forEach(task => {
        const taskRef = doc(collection(newAppRef, 'tasks'));
        batch.set(taskRef, task);
    });

    await batch.commit();
    return newAppRef.id;
};


// Function to update an application (e.g., progress, notes)
export const updateApplication = async (userId: string, applicationId: string, data: Partial<ApplicationData>) => {
  const appRef = doc(db, `users/${userId}/applications`, applicationId);
  // We should not be trying to update tasks with this function.
  const { tasks, ...updateData } = data as any;
  await updateDoc(appRef, updateData);
};


// Function to delete an application
export const deleteApplication = async (userId: string, applicationId: string) => {
  const appRef = doc(db, `users/${userId}/applications`, applicationId);
  await deleteDoc(appRef);
};


// --- Task-specific functions ---

// Function to add a new task to an application
export const addTaskToApplication = async (userId: string, applicationId: string, task: ApplicationTaskData): Promise<string> => {
    const tasksCollectionRef = collection(db, `users/${userId}/applications/${applicationId}/tasks`);
    const docRef = await addDoc(tasksCollectionRef, task);
    return docRef.id;
};

// Function to update a task in an application
export const updateApplicationTask = async (userId: string, applicationId: string, taskId: string, data: Partial<ApplicationTaskData>) => {
    const taskRef = doc(db, `users/${userId}/applications/${applicationId}/tasks`, taskId);
    await updateDoc(taskRef, data);
};

// Function to delete a task from an application
export const deleteApplicationTask = async (userId: string, applicationId: string, taskId: string) => {
    const taskRef = doc(db, `users/${userId}/applications/${applicationId}/tasks`, taskId);
    await deleteDoc(taskRef);
};
