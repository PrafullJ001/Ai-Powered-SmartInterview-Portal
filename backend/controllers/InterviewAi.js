import dotenv from "dotenv";
dotenv.config();

import Interview from "../models/Interview.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL: GEMINI_API_KEY is NULL.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//  Correct Gemini model
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});


export const generateQuestions = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "generateQuestions is disabled. Static questions are used."
    });
};


// SAVE INTERVIEW + FEEDBACK

export const saveInterview = async (req, res) => {
    try {
        console.log("🔥 save-interview endpoint hit");

        const { userId, role, questions } = req.body;

        if (!userId || !role || !questions) {
            return res.status(400).json({
                error: "Missing userId, role or questions"
            });
        }

        const feedbacks = [];

        // AI FEEDBACK LOOP
        
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
                // ⭐ Correct SDK usage for gemini-2.5-flash
                const result = await model.generateContent(prompt);

                // ⭐ Correct output extraction
                aiText = result.response.text().trim();
            } catch (error) {
                console.error("❌ GEMINI ERROR:", error);
            }

            feedbacks.push({
                question: qa.question,
                answer: qa.answer,
                aiFeedback: aiText, //  This matches your DB field
            });
        }

 
        // SAVE TO MONGODB
        
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


// FETCH INTERVIEW RESULTS

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




