import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  const errorMessage = `Missing Firebase environment variables: ${missingEnvVars.join(', ')}`;
  document.body.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">
    <h1>Firebase Error</h1>
    <p>${errorMessage}</p>
    <p>Please check your environment variables and reload.</p>
  </div>`;
  throw new Error(errorMessage);
}

let app, auth, db, googleProvider, analytics;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  analytics = getAnalytics(app);
} catch (error) {
  const errorMessage = `Firebase initialization failed: ${error.message}`;
  document.body.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">
    <h1>Firebase Error</h1>
    <p>${errorMessage}</p>
    <p>Please check your Firebase configuration and reload.</p>
  </div>`;
  throw error;
}

export { auth, db, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, collection, doc, setDoc, getDocs, query, where, analytics };