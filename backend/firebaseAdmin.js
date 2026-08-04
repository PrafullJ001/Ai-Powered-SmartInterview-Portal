import admin from 'firebase-admin';
import { createRequire } from 'module'; 

const require = createRequire(import.meta.url);

// --- START: Render/Deployment Logic ---

// Get the JSON string from Render's environment variable
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

let serviceAccount;

if (serviceAccountJson) {
    // 1. If running on Render, parse the secure JSON string
    try {
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log("🔑 Initializing Firebase with secure ENV variable.");
    } catch (e) {
        console.error("❌ ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON from environment variable.", e);
        // This will allow the catch block below to fire
    }
} else {
    // 2. If running locally (serviceAccountJson is undefined), load the local file
    try {
        serviceAccount = require('./serviceAccountKey.json');
        console.log("🔑 Initializing Firebase with local serviceAccountKey.json file.");
    } catch (e) {
        console.error("❌ ERROR: serviceAccountKey.json file not found locally.", e);
    }
}

// --- END: Render/Deployment Logic ---

// Initialize Firebase Admin SDK
try {
    if (serviceAccount && !admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("🔥 Firebase Admin SDK Initialized Successfully.");
    } else if (!serviceAccount) {
        console.error("❌ Firebase Admin SDK Initialization Error: No service account credentials loaded.");
    }
} catch (error) {
    console.error("❌ Firebase Admin SDK Initialization Error:", error);
}

export default admin;