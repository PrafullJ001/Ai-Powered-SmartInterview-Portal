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
    // gemini-2.5-flash is being phased out early (404s reported July 2026,
    // ahead of its official Oct 16 2026 shutdown). Pinned to a current
    // GA model instead of the "gemini-flash-latest" alias so behavior
    // doesn't silently shift if Google swaps the alias target later.
    model: "gemini-3.5-flash-lite",
    generationConfig: {
        // JSON mode: forces Gemini to return valid JSON, not prose,
        // which is what makes single-prompt batching safe to parse.
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
    },
});


export const generateQuestions = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "generateQuestions is disabled. Static questions are used."
    });
};


// Small retry helper — only retries on transient errors (503 / 429),
// not on real request problems (400, auth, etc).
const withRetry = async (fn, retries = 3, delayMs = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const status = err?.status;
            const retriable = status === 503 || status === 429;
            if (!retriable || attempt === retries) throw err;
            console.warn(`⚠️ Gemini ${status}, retrying (${attempt}/${retries - 1})...`);
            await new Promise((r) => setTimeout(r, delayMs * attempt));
        }
    }
};


// Builds one single prompt covering every question, and asks Gemini
// to return a strict JSON array so per-question feedback can be
// mapped back out safely.
const buildBatchPrompt = (questions) => {
    const qaBlock = questions
        .map((qa, i) => `${i + 1}. Question: ${qa.question}\n   Candidate Answer: ${qa.answer}`)
        .join("\n\n");

    return `
You are an expert interviewer evaluating a candidate's mock interview answers.

Below are ${questions.length} question/answer pairs. Evaluate EACH ONE independently.

${qaBlock}

Respond ONLY with valid JSON, no markdown, no extra text, in exactly this shape:
{
  "summary": "4-5 sentence overall performance summary across all answers",
  "results": [
    {
      "question": "<exact question text repeated back>",
      "quality": "Good | Average | Poor",
      "missing": "what's missing from the answer",
      "improve": "how to improve"
    }
  ]
}

The "results" array must contain exactly ${questions.length} items, in the same order as the questions above.
`;
};

// Formats one parsed result item back into the same 3-point text
// format the frontend's renderStructuredFeedback() already parses
// (it looks for "quality"/"strength", "missing"/"weakness",
// "improve"/"suggestion" keywords line by line).
const formatFeedbackText = (item) => {
    if (!item) return "No AI feedback generated.";
    return [
        `Quality: ${item.quality ?? "N/A"}`,
        `Missing: ${item.missing ?? "N/A"}`,
        `Improve: ${item.improve ?? "N/A"}`,
    ].join("\n");
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

        let feedbacks = [];
        let summary = "Summary feedback placeholder.";

        try {
            const prompt = buildBatchPrompt(questions);

            const result = await withRetry(() => model.generateContent(prompt));
            const rawText = result.response.text().trim();

            const parsed = JSON.parse(rawText);
            const results = Array.isArray(parsed?.results) ? parsed.results : [];
            summary = parsed?.summary || summary;

            feedbacks = questions.map((qa, i) => {
                // Match by index first (model was told to preserve order),
                // fall back to matching by question text if it didn't.
                const match =
                    results[i]?.question === qa.question
                        ? results[i]
                        : results.find((r) => r.question === qa.question) || results[i];

                return {
                    question: qa.question,
                    answer: qa.answer,
                    aiFeedback: formatFeedbackText(match),
                };
            });
        } catch (error) {
            console.error("❌ GEMINI ERROR:", error);

            // Safe fallback: still save the interview even if Gemini
            // failed or returned bad JSON, just without feedback.
            feedbacks = questions.map((qa) => ({
                question: qa.question,
                answer: qa.answer,
                aiFeedback: "No AI feedback generated.",
            }));
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
            summary,
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