// src/firebaseConfig.js (This file MUST be correct!)

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect} from "firebase/auth";

// Your web app's Firebase configuration (Using your actual values)
const firebaseConfig = {
    apiKey: "AIzaSyAzw-_Rk-1w86zfT1J0flxyMGWD1Q-idpE",
    authDomain: "smartinterview-2540b.firebaseapp.com",
    projectId: "smartinterview-2540b",
    storageBucket: "smartinterview-2540b.firebasestorage.app",
    messagingSenderId: "955435088764",
    appId: "1:955435088764:web:8f8422c44caf6789b842f9",
    measurementId: "G-XDB4DSKXZM"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication service
const googleProvider = new GoogleAuthProvider(); // Create Google Auth Provider

// The function you want to use in Home.jsx
const signInWithGoogle = async () => {
    try {
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        console.error("Google Login Error:", error.code, error.message);
        alert("Authentication failed.");
        throw error;
    }
};

// 🌟 THE CRITICAL FIX: Use named export for both auth and signInWithGoogle 🌟
export { auth, signInWithGoogle };
