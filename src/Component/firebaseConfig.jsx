import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBom0Cdl5cL3Jpl6sZyF2ulEJr4JGY4fB0",
  authDomain: "otaku-centre.firebaseapp.com",
  projectId: "otaku-centre",
  storageBucket: "otaku-centre.appspot.com",
  messagingSenderId: "916943582550",
  appId: "1:916943582550:web:1a15705302d68d607192f7",
  measurementId: "G-F4HECV79KY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  db,
  storage,
};
