
// correct code for locolhost
const API_BASE_URL = "http://localhost:5000/api/ai";
// // Correct for vercel 1. Access the Vercel Environment Variable (which holds your Render URL)
//const BACKEND_URL = process.env.REACT_APP_API_URL;

// // 2. Construct the full API base URL using the variable
// // Note: We only add the '/api/ai' part here, as the NEXT_PUBLIC_BACKEND_URL should contain the full domain.
// const API_BASE_URL = `${BACKEND_URL}/api/ai`;
export const getInitialQuestions = async (role) => {
  if (!role) return [];

  try {
    // This is the static data currently used for questions
    
    return [
      { id: 1, question: "Explain your understanding of the role.", answer: "", isAnswered: false },
      { id: 2, question: "What are your technical strengths?", answer: "", isAnswered: false },
      { id: 3, question: "Describe a challenging project you worked on.", answer: "", isAnswered: false },
    ];
  } catch (error) {
    console.error("API call to get questions failed:", error);
    throw new Error(`Failed to load questions. Details: ${error.message}`);
  }
};


export const getAIResults = async (userId, role, userAnswers) => {
  try {
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
      throw new Error("userAnswers must be a non-empty array");
    }

    const questionsToSend = userAnswers.map((q) => {
      // Ensure the keys match what the backend expects (question, answer)
      return {
        question: q.question || "No question provided",
        answer: q.answer || "No answer provided",
      };
    });

    const response = await fetch(`${API_BASE_URL}/save-interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        role,
        questions: questionsToSend, // Backend receives this array
      }),
    });

    if (!response.ok) {
      let errorDetails = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails = errorData.error || errorData.message || errorDetails; 
      } catch {
        errorDetails = `HTTP error! status: ${response.status}. Could not parse error response.`;
      }
      throw new Error(errorDetails); 
    }

    const data = await response.json();

    // Store the ID for the second fetch in ResultPage
    if (data?.interviewId) {
      localStorage.setItem("interviewId", data.interviewId);
      console.log("💾 Interview ID stored:", data.interviewId);
    } else {
      console.warn("⚠️ Interview ID missing in backend response!");
    }

    return data?.interview || {};
    
  } catch (error) {
    console.error("API call to save and get feedback failed:", error);
    throw new Error(
      `Connection Error or Server Failed: ${error.message}`
    );
  }
};

// Wait until AI feedback is actually ready
export const generateAIFeedback = async (interviewId) => {
  try {
    let attempts = 0;
    const maxAttempts = 10; // waits max 25 seconds

    while (attempts < maxAttempts) {
      const res = await fetch(`${API_BASE_URL}/results/${interviewId}`);

      if (!res.ok) {
        throw new Error(`Failed: ${res.statusText}`);
      }

      const data = await res.json();
      const questions = data?.interview?.questions || [];

      // Check if AI feedback exists
      const aiReady = questions.some(q => q.aiFeedback && q.aiFeedback.trim() !== "");

      if (aiReady) {
        // AI feedback finished — return real data
        return data.interview;
      }

      // Wait 1 second and check again
      await new Promise(resolve => setTimeout(resolve, 1000));

      attempts++;
    }

    // If AI never returns response
    return {
      success: false,
      error: "AI feedback taking too long. Try again.",
      questions: []
    };

  } catch (err) {
    console.error("Error fetching AI feedback:", err);
    return { success: false, questions: [], error: err.message };
  }
};
