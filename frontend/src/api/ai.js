// ✅ Correct for CRA (React Scripts)
const API_BASE_URL =
  process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api/ai`
    : "http://localhost:5000/api/ai";

// ========================
// QUESTIONS (STATIC OK)
// ========================
export const getInitialQuestions = async (role) => {
  if (!role) return [];

  return [
    { id: 1, question: "Explain your understanding of the role.", answer: "", isAnswered: false },
    { id: 2, question: "What are your technical strengths?", answer: "", isAnswered: false },
    { id: 3, question: "Describe a challenging project you worked on.", answer: "", isAnswered: false },
  ];
};

// ========================
// SAVE INTERVIEW + AI
// ========================
export const getAIResults = async (userId, role, userAnswers) => {
  try {
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
      throw new Error("userAnswers must be a non-empty array");
    }

    const questionsToSend = userAnswers.map((q) => ({
      question: q.question || "No question provided",
      answer: q.answer || "No answer provided",
    }));

    const response = await fetch(`${API_BASE_URL}/save-interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        role,
        questions: questionsToSend,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data?.interviewId) {
      localStorage.setItem("interviewId", data.interviewId);
      console.log("💾 Interview ID stored:", data.interviewId);
    }

    return data?.interview || {};
  } catch (error) {
    console.error("❌ Save interview error:", error);
    throw new Error(`Server Error: ${error.message}`);
  }
};

// ========================
// FETCH AI FEEDBACK
// ========================
export const generateAIFeedback = async (interviewId) => {
  try {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const res = await fetch(`${API_BASE_URL}/results/${interviewId}`);

      if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
      }

      const data = await res.json();
      const questions = data?.interview?.questions || [];

      const aiReady = questions.some(
        (q) => q.aiFeedback && q.aiFeedback.trim() !== ""
      );

      if (aiReady) {
        return data.interview;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    return {
      success: false,
      error: "AI feedback taking too long",
      questions: [],
    };
  } catch (err) {
    console.error("❌ AI feedback error:", err);
    return { success: false, questions: [], error: err.message };
  }
};