import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// ✅ Using ENV variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementid: process.env.REACT_APP_MEASUREMENT_ID, 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ✅ SAME LOGIC (unchanged)
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 🔥 IMPORTANT
    const idToken = await user.getIdToken();

    console.log("User Info:", user);
    console.log("Token:", idToken);

    return { user, idToken };
  } catch (error) {
    console.error("Google Login Error:", error);
    alert(error.message);
    throw error;
  }
};

export { auth, signInWithGoogle };
