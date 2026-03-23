
// backend/routes/aiRoutes.js
import express from "express";
import {
  generateQuestions,
  saveInterview,
  getInterviewResults,
} from "../controllers/interviewAI.js";

const router = express.Router();

// Generate interview questions
router.post("/generate-questions", generateQuestions);

// Save interview + AI feedback
router.post("/save-interview", saveInterview);

// Fetch saved interview (answers + AI feedback) by ID
router.get("/results/:id", getInterviewResults);

export default router;
