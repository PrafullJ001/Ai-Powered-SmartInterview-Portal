// import React, { useState, useEffect } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import RoleSelection from "./pages/RoleSelection";
// import QAPage_temp from "./pages/QAPage_temp";
// import ResultPage from "./pages/ResultPage";
// import { getAIResults, getInitialQuestions } from "./api/ai";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// export default function App() {
//   const [selectedRole, setSelectedRole] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [aiResults, setAIResults] = useState(null);
//   const [user, setUser] = useState(null);

//   const navigate = useNavigate();

//   // 🔥 Track Firebase Login State
//   useEffect(() => {
//     const auth = getAuth();
//     return onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null);
//     });
//   }, []);

//   // 🔥 Role Selection (LOAD QUESTIONS from frontend)
//   const handleRoleSelect = async (roleId) => {
//     setSelectedRole(roleId);

//     const qList = await getInitialQuestions(roleId);
//     setQuestions(qList);

//     navigate("/questions");
//   };

//   // 🔥 Submit Answers → Backend AI
//   const handleComplete = async (userAnswers) => {
//     setAnswers(userAnswers);

//     if (!user) {
//       alert("Please sign in first.");
//       navigate("/home");
//       return;
//     }

//     try {
//       const results = await getAIResults(user.uid, selectedRole, userAnswers);
//       setAIResults(results);
//       navigate("/result");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to get AI feedback.");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container my-4">
//         <Routes>
//           <Route path="/" element={<Navigate to="/home" />} />

//           <Route 
//             path="/home" 
//             element={<Home onGetStarted={() => navigate("/roles")} />} 
//            />


//           <Route
//             path="/roles"
//             element={<RoleSelection onSelectRole={handleRoleSelect} />}
//           />

//           <Route
//             path="/questions"
//             element={
//               <QAPage_temp
//                 questions={questions}
//                 onComplete={handleComplete}
//               />
//             }
//           />

//           <Route
//             path="/result"
//             element={
//               <ResultPage
//                 answers={answers}
//                 role={selectedRole}
//                 total={answers.length}
//                 aiResults={aiResults}
//               />
//             }
//           />
//         </Routes>
//       </div>
//     </>
//   );
// }



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

  // 🔥 Role Selection → Load Questions
  const handleRoleSelect = async (roleId) => {
    setSelectedRole(roleId);

    const qList = await getInitialQuestions(roleId);
    setQuestions(qList);

    navigate("/questions");
  };

  // 🔥 Submit Answers → Backend AI
  const handleComplete = async (userAnswers, questionList) => {
    setAnswers(userAnswers);

    if (!user) {
      alert("Please sign in first.");
      navigate("/home");
      return;
    }

    try {
      // 🚀 IMPORTANT: Send answers + full question list
      const results = await getAIResults(
        user.uid,
        selectedRole,
        userAnswers,
        questionList
      );

      setAIResults(results);
      navigate("/result");
    } catch (err) {
      console.error(err);
      alert("Failed to get AI feedback.");
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
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}
