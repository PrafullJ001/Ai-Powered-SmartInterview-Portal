import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzw-_Rk-1w86zfT1J0flxyMGWD1Q-idpE",
    authDomain: "smartinterview-2540b.firebaseapp.com",
    projectId: "smartinterview-2540b",
    storageBucket: "smartinterview-2540b.firebasestorage.app",
    messagingSenderId: "955435088764",
    appId: "1:955435088764:web:8f8422c44caf6789b842f9",
    measurementId: "G-XDB4DSKXZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();

// ✅ FINAL FIXED FUNCTION
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);

        const user = result.user;

        // 🔥 IMPORTANT: GET ID TOKEN
        const idToken = await user.getIdToken();

        console.log("Logged in:", user.email);
        console.log("ID Token received successfully");

       

        // ✅ RETURN BOTH
        return { user, idToken };

    } catch (error) {
        console.error("Google Login Error:", error);
        alert("Authentication failed");
        throw error;
    }
};

// Export
export { auth, signInWithGoogle };