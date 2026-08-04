import dotenv from "dotenv";
dotenv.config();

import Interview from "../models/Interview.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is NULL.");
}

console.log("🔑 API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    maxOutputTokens: 4096,
  },
});

// ========================
// GENERATE QUESTIONS (DISABLED)
// ========================
export const generateQuestions = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: "generateQuestions is disabled. Static questions are used.",
  });
};

// Retry helper — only retries transient errors (503 / 429)
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

// Builds ONE prompt covering every question, asks Gemini for strict JSON.
// "missing" and "improve" are now arrays so the frontend can render
// them as separate bullet points instead of one paragraph.
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
      "missing": ["3 to 4 short bullet points, each a distinct missing point from the answer"],
      "improve": ["3 short bullet points, each a distinct actionable improvement tip"]
    }
  ]
}

The "missing" and "improve" fields MUST be JSON arrays of short strings (not a single paragraph).
The "results" array must contain exactly ${questions.length} items, in the same order as the questions above.
`;
};

// Formats one parsed result item into the multi-line bullet format
// the frontend's renderStructuredFeedback() parses line by line.
const formatFeedbackText = (item) => {
  if (!item) return "No AI feedback generated.";

  const toPoints = (val) => {
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === "string" && val.trim() !== "") return [val];
    return ["N/A"];
  };

  const missingPoints = toPoints(item.missing);
  const improvePoints = toPoints(item.improve);

  return [
    `Quality: ${item.quality ?? "N/A"}`,
    `Missing:`,
    ...missingPoints.map((p) => `- ${p}`),
    `Improve:`,
    ...improvePoints.map((p) => `- ${p}`),
  ].join("\n");
};

// ========================
// SAVE INTERVIEW + AI FEEDBACK
// ========================
export const saveInterview = async (req, res) => {
  try {
    console.log("🔥 save-interview endpoint hit");

    const { userId, role, questions } = req.body;

    if (!userId || !role || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        error: "Missing or invalid userId, role, or questions",
      });
    }

    console.log("📥 Questions received:", questions);

    let feedbacks = [];
    let summary = "Summary feedback placeholder.";

    try {
      console.log("🚀 Sending to Gemini...");
      const prompt = buildBatchPrompt(questions);
      const result = await withRetry(() => model.generateContent(prompt));
      const rawText = result.response.text().trim();

      console.log("🧠 Gemini Response:", rawText);

      const parsed = JSON.parse(rawText);
      const results = Array.isArray(parsed?.results) ? parsed.results : [];
      summary = parsed?.summary || summary;

      feedbacks = questions.map((qa, i) => {
        if (!qa.answer || qa.answer.trim() === "") {
          return {
            question: qa.question,
            answer: qa.answer,
            aiFeedback: "No answer provided by candidate.",
          };
        }

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

      let fallbackMsg = "AI failed to generate feedback.";
      if (error.message?.includes("API key")) {
        fallbackMsg = "Invalid or expired API key.";
      } else if (error.message?.includes("quota")) {
        fallbackMsg = "API quota exceeded.";
      }

      feedbacks = questions.map((qa) => ({
        question: qa.question,
        answer: qa.answer,
        aiFeedback:
          qa.answer && qa.answer.trim() !== ""
            ? fallbackMsg
            : "No answer provided by candidate.",
      }));
    }

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

// ========================
// FETCH INTERVIEW RESULTS
// ========================
export const getInterviewResults = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("❌ Error fetching interview:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};