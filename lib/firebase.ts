// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkc5vnWLI6iiWGEBjT3KY_2JERziChLos",
  authDomain: "jaime-6bad7.firebaseapp.com",
  projectId: "jaime-6bad7",
  storageBucket: "jaime-6bad7.firebasestorage.app",
  messagingSenderId: "823009247698",
  appId: "1:823009247698:web:51cf7a79324cc3467d080b",
  measurementId: "G-6P8YKZ9XN8"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };

// Initialize Analytics conditionally
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}
