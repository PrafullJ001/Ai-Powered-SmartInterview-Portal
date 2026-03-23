// backend/models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // Unique ID provided by Firebase, used for primary identification
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Export the model for use in server.js
export default mongoose.model('User', UserSchema);