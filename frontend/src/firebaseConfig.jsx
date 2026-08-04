import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID, // fixed casing
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Force localStorage-based persistence instead of IndexedDB
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Persistence setup error:", error);
});

const googleProvider = new GoogleAuthProvider();

// Uses a popup instead of a full-page redirect so it works inside
// iframes / sandboxed preview environments where signInWithRedirect
// silently hangs (top-level navigation gets blocked).
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken };
  } catch (error) {
    console.error("Google Login Error:", error);
    alert(error.message);
    throw error;
  }
};

export { auth, signInWithGoogle };