import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import admin from "./firebaseAdmin.js";     // Firebase Admin SDK config
import User from "./models/User.js";        // Mongoose User model
import aiRoutes from "./routes/aiRoutes.js"; //  Import AI Routes

// Load environment variables from .env
dotenv.config();

const app = express();

//  CORS Configuration
const FRONTEND_URL = "http://localhost:3000"; 
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ========================
// Connect MongoDB Atlas
// ========================
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


//  GOOGLE AUTH ROUTE

app.post("/api/auth/google", async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).json({ error: "ID token missing." });
  }

  try {
    // 1️⃣ Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 2️⃣ Find or create the user in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = new User({
        firebaseUid: uid,
        email: email,
        name: name || "User",
        profilePic: picture || "",
      });
      await user.save();
      console.log("🆕 New User Registered:", email);
    } else {
      console.log("👤 Existing User Logged In:", email);
    }

    // 3️⃣ Respond to frontend
    res.status(200).json({
      message: "Authentication successful.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("❌ Authentication/Database Error:", error.message);
    res.status(500).json({
      error: "Internal server error during authentication verification.",
    });
  }
});

// ========================
//  AI ROUTES REGISTRATION (IMPORTANT!)
// ========================
app.use("/api/ai", aiRoutes);   // ⭐ FIXES YOUR 404 ERROR

// ========================
//  Default Route
// ========================
app.get("/", (req, res) => {
  res.send("🚀 SmartInterview Backend is Running Successfully...");
});

// ========================
//  Start Server
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




