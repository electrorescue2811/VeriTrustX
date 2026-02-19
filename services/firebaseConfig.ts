import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtzSr5L3hBYBnZGicKgEBwYaZiLf2fjb4",
  authDomain: "veritrustx.firebaseapp.com",
  projectId: "veritrustx",
  storageBucket: "veritrustx.firebasestorage.app",
  messagingSenderId: "889221720644",
  appId: "1:889221720644:web:a37b08e0f968ceffc1aa11",
  measurementId: "G-Z8KLQ4L2R3"
};

let db: any = null;
let analytics: any = null;
let isFirebaseInitialized = false;

try {
  // Check if firebase app is already initialized to avoid "App named '[DEFAULT]' already exists" error
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  
  db = getFirestore(app);
  
  // Analytics requires a browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  isFirebaseInitialized = true;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.warn("Firebase initialization failed. Running in MOCK mode.", error);
}

export { db, analytics, isFirebaseInitialized };