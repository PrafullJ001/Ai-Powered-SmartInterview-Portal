import dotenv from "dotenv";
dotenv.config();

import Interview from "../models/Interview.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ========================
// ✅ GEMINI INITIALIZATION
// ========================
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL: GEMINI_API_KEY is NULL.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Use stable model
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

// ========================
// GENERATE QUESTIONS (DISABLED)
// ========================
export const generateQuestions = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "generateQuestions is disabled. Static questions are used."
    });
};

// ========================
// SAVE INTERVIEW + AI FEEDBACK
// ========================
export const saveInterview = async (req, res) => {
    try {
        console.log("🔥 save-interview endpoint hit");

        const { userId, role, questions } = req.body;

        // ✅ Validation
        if (!userId || !role || !questions) {
            return res.status(400).json({
                error: "Missing userId, role or questions"
            });
        }

        console.log("📥 Questions received:", questions);

        const feedbacks = [];

        // ========================
        // 🔥 AI FEEDBACK LOOP
        // ========================
        for (const qa of questions) {
            const prompt = `
You are an expert interviewer.
Evaluate the candidate's answer briefly.

Question: ${qa.question}
Candidate Answer: ${qa.answer}

Give feedback in 3 points:
1. Quality (Good / Average / Poor)
2. Missing points
3. How to improve
`;

            let aiText = "No AI feedback generated.";

            try {
                console.log("🚀 Sending prompt to Gemini...");
                console.log(prompt);

                const result = await model.generateContent(prompt);

                // ✅ FIXED RESPONSE EXTRACTION
                const response = await result.response;
                const text = response.text();

                console.log("🧠 Gemini Response:", text);

                if (text && text.trim() !== "") {
                    aiText = text.trim();
                } else {
                    aiText = "AI returned empty response";
                }

            } catch (error) {
                console.error("❌ GEMINI ERROR:", error.message);
                aiText = "AI failed to generate feedback.";
            }

            feedbacks.push({
                question: qa.question,
                answer: qa.answer,
                aiFeedback: aiText,
            });
        }

        // ========================
        // 💾 SAVE TO MONGODB
        // ========================
        const interview = await Interview.create({
            userId,
            role,
            questions: feedbacks,
        });

        console.log("💾 Interview Saved Successfully.");

        return res.status(200).json({
            success: true,
            interviewId: interview._id,
            interview,
        });

    } catch (err) {
        console.error("❌ Error saving interview:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

// ========================
// FETCH INTERVIEW RESULTS
// ========================
export const getInterviewResults = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        return res.status(200).json({
            success: true,
            interview
        });

    } catch (error) {
        console.error("❌ Error fetching interview:", error);
        return res.status(500).json({
            error: error.message
        });
    }
};
