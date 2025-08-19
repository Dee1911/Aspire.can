
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'aspire-5lyy4',
  appId: '1:792010934965:web:5dd56a2c334dee26bdccfc',
  storageBucket: 'aspire-5lyy4.appspot.com',
  apiKey: 'AIzaSyCKcHxTbVSGZK0mQ8YtKbSAu2_2BwvLLbQ',
  authDomain: 'aspire-5lyy4.firebaseapp.com',
  messagingSenderId: '792010934965',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
