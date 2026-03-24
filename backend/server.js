import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import admin from "./firebaseAdmin.js";
import User from "./models/User.js";
import aiRoutes from "./routes/aiRoutes.js";

// Load env variables
dotenv.config();

const app = express();

// ========================
// ✅ CORS CONFIG (FIXED)
// ========================
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-powered-smart-interview-portal-x.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps / postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ========================
// ✅ MONGODB CONNECTION
// ========================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) =>
    console.error("❌ MongoDB Connection Error:", err.message)
  );

// ========================
// ✅ GOOGLE AUTH ROUTE
// ========================
app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token missing." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = new User({
        firebaseUid: uid,
        email,
        name: name || "User",
        profilePic: picture || "",
      });
      await user.save();
      console.log("🆕 New User Registered:", email);
    } else {
      console.log("👤 Existing User Logged In:", email);
    }

    res.status(200).json({
      message: "Authentication successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    res.status(500).json({
      error: "Authentication failed",
    });
  }
});

// ========================
// ✅ AI ROUTES
// ========================
app.use("/api/ai", aiRoutes);

// ========================
// ✅ HEALTH CHECK ROUTE
// ========================
app.get("/", (req, res) => {
  res.send("🚀 SmartInterview Backend Running...");
});

// ========================
// ✅ START SERVER
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
