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

console.log("🔑 API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        if (!userId || !role || !questions || !Array.isArray(questions)) {
            return res.status(400).json({
                error: "Missing or invalid userId, role, or questions"
            });
        }

        console.log("📥 Questions received:", questions);

        const feedbacks = [];

        // ========================
        // 🔥 AI FEEDBACK LOOP
        // ========================
        for (const qa of questions) {

            // Skip empty answers
            if (!qa.answer || qa.answer.trim() === "") {
                feedbacks.push({
                    question: qa.question,
                    answer: qa.answer,
                    aiFeedback: "No answer provided by candidate."
                });
                continue;
            }

            const prompt = `
You are a strict technical interviewer.

Question: ${qa.question}
Candidate Answer: ${qa.answer}

Give structured feedback:

1. Quality: (Good / Average / Poor)
2. Missing Points:
- point 1
- point 2
3. Improvement:
- step 1
- step 2
`;

            let aiText = "No AI feedback generated.";

            try {
                console.log("🚀 Sending to Gemini...");

                const result = await model.generateContent({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                });

                const text = result.response.text();

                console.log("🧠 Gemini Response:", text);

                if (text && text.trim() !== "") {
                    aiText = text.trim();
                } else {
                    aiText = "AI returned empty response";
                }

            } catch (error) {
                console.error("❌ GEMINI ERROR FULL:", error);

                // Better debugging
                if (error.message.includes("API key")) {
                    aiText = "Invalid or expired API key.";
                } else if (error.message.includes("quota")) {
                    aiText = "API quota exceeded.";
                } else {
                    aiText = "AI failed to generate feedback.";
                }
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
