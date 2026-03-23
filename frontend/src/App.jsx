import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import QAPage_temp from "./pages/QAPage_temp";
import ResultPage from "./pages/ResultPage";
import { getAIResults, getInitialQuestions } from "./api/ai";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [selectedRole, setSelectedRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [aiResults, setAIResults] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // 🔥 Track Firebase Login State
  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
  }, []);

  // 🔥 Role Selection (LOAD QUESTIONS from frontend)
  const handleRoleSelect = async (roleId) => {
    setSelectedRole(roleId);

    const qList = await getInitialQuestions(roleId);
    setQuestions(qList);

    navigate("/questions");
  };
// App.js

// 🔥 Submit Answers → Backend AI
const handleComplete = async (userAnswers) => {
    setAnswers(userAnswers);

    if (!user) {
        alert("Please sign in first.");
        navigate("/home");
        return;
    }
    
    // --- 1. Navigate Immediately ---
    // We navigate to the results page first to give the user immediate feedback.
    // The ResultsPage will show the answers and selected role immediately.
    navigate("/result"); 

    try {
        // 2. ATTEMPT to get AI feedback while the user is viewing the ResultPage
        const results = await getAIResults(user.uid, selectedRole, userAnswers);
        
        // 3. SUCCESS: Update the state with the results
        setAIResults(results);
        
        // Note: Because state is updated, the ResultPage will automatically re-render
        // when the data (aiResults) becomes available.

    } catch (err) {
        console.error("Error fetching AI feedback:", err);

        // 4. FAILURE: Set an empty array or null to avoid app crash
        // and notify the user that feedback is unavailable.
        setAIResults([]); // Set to empty array so ResultPage doesn't crash
        
        const errorMessage = err.message || "An unknown server error occurred.";
        
        // Use a less intrusive notification (like a console log or a toast/banner) 
        // that the user may not even see if the navigation is fast.
        alert(`Note: Failed to load detailed AI feedback. Details: ${errorMessage}`);
    }
};
  return (
    <>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />

          <Route 
              path="/home" 
               element={<Home onGetStarted={() => navigate("/roles")} />} 
          />


          <Route
            path="/roles"
            element={<RoleSelection onSelectRole={handleRoleSelect} />}
          />

        <Route
  path="/questions"
  element={
    <QAPage_temp
      role={selectedRole}
      questions={questions}
      onComplete={handleComplete}
            />
          }
        />

          <Route
            path="/result"
            element={
              <ResultPage
                answers={answers}
                role={selectedRole}
                total={answers.length}
                aiResults={aiResults}
                questions={questions}  
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

