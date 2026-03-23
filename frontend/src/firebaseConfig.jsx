// src/firebaseConfig.js (This file MUST be correct!)

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken(); 
        
        return { user: result.user, idToken }; 
    } catch (error) {
        console.error("Google Login Error:", error.code, error.message);
        
        let errorMessage = "Authentication failed.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Sign-in window closed. Please try again.";
        }
        alert(errorMessage);
        
        throw error; 
    }
};

// 🌟 THE CRITICAL FIX: Use named export for both auth and signInWithGoogle 🌟
export { auth, signInWithGoogle };