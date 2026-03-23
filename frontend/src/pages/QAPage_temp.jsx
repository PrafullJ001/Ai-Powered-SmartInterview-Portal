// import React, { useState, useRef, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from "react-router-dom";
// import { getAIResults } from "../api/ai";

// /** @typedef {typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition} SpeechRecognitionConstructor */

// const questionsData = {
//   frontend: [
//     { id: 1, question: "What is JSX in React?" },
//     { id: 2, question: "Explain the concept of React hooks and their benefits." },
//     { id: 3, question: "How does the Virtual DOM work in React?" },
//     { id: 4, question: "What is Flexbox used for in CSS?" },
//     { id: 5, question: "What are the benefits of using TypeScript over JavaScript?" },
//   ],
//   backend: [
//     { id: 1, question: "What is Node.js used for?" },
//     { id: 2, question: "What is the difference between SQL and NoSQL databases?" },
//     { id: 3, question: "What is a schema in MongoDB?" },
//     { id: 4, question: "Explain how JWT authentication works." },
//     { id: 5, question: "Explain how middleware works in Express.js." },
//   ],
//   datascience: [
//     { id: 1, question: "Explain the difference between supervised and unsupervised learning?" },
//     { id: 2, question: "What is feature engineering and why is it important?" },
//     { id: 3, question: "Describe the bias-variance tradeoff in machine learning." },
//     { id: 4, question: "How do you handle missing data in a dataset?" },
//     { id: 5, question: "Explain the concept of cross-validation." },
//   ],
//   aiml: [
//     { id: 1, question: "Explain how a convolutional neural network works." },
//     { id: 2, question: "What is transfer learning and when would you use it?" },
//     { id: 3, question: "Describe the vanishing gradient problem and solutions." },
//     { id: 4, question: "What is the difference between RNN and LSTM?" },
//     { id: 5, question: "Explain how attention mechanisms work in transformers." },
//   ],
//   devops: [
//     { id: 1, question: "What is CI/CD and why is it important?" },
//     { id: 2, question: "Explain the concept of Infrastructure as Code (IaC)." },
//     { id: 3, question: "What is Docker and how does containerization work?" },
//     { id: 4, question: "Explain the difference between continuous delivery and continuous deployment." },
//     { id: 5, question: "What are Kubernetes pods, deployments, and services?" },
//   ],
//   cybersecurity: [
//     { id: 1, question: "What is the difference between encryption, hashing, and salting?" },
//     { id: 2, question: "Explain what SQL injection is and how to prevent it." },
//     { id: 3, question: "What is the CIA triad in cybersecurity?" },
//     { id: 4, question: "Explain the difference between symmetric and asymmetric encryption." },
//     { id: 5, question: "What is a firewall and how does it protect a network?" },
//   ],
// };

// // --- Helper function for word count (NO CHANGE) ---
// const getWordCount = (text) => {
//   if (!text) return 0;
//   const words = text.trim().split(/\s+/);
//   return words.filter(word => word.length > 0).length;
// };

// export default function QAPage_temp({ role, onComplete }) {
//   const navigate = useNavigate();

//   // 🟢 Clear old interview data at the start
//   useEffect(() => {
//     localStorage.removeItem("tempInterviewData");
//     localStorage.removeItem("tempInterviewRole");
//     localStorage.removeItem("interviewId");
//   }, []);

//   if (!role || role === "") {
//     return (
//       <div
//         className="d-flex flex-column justify-content-center align-items-center vh-100 text-center"
//         style={{
//           background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
//         }}
//       >
//         <div className="card shadow-lg p-5 border-0">
//           <h3 className="text-danger mb-3">⚠️ Please Select The Role</h3>
//           <p className="lead text-secondary mb-4">
//             Go to the **Role Selection** page to start your interview practice.
//           </p>
//           <button
//             onClick={() => navigate("/roles")}
//             className="btn btn-primary btn-lg"
//             style={{
//               background: "linear-gradient(90deg, #2196F3, #21CBF3)",
//               border: "none",
//               transition: "all 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
//             onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
//           >
//             ⬅ Back to Role Selection
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const questions = questionsData[role] || questionsData.frontend;
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState(new Array(questions.length).fill(""));
//   const [showValidation, setShowValidation] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const recognitionRef = useRef(null);
//   const MIN_WORDS = 10; 

//   // Speech Recognition setup 
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         const newAnswers = [...answers];
//         newAnswers[currentQuestion] = (newAnswers[currentQuestion] + " " + transcript).trim();
//         setAnswers(newAnswers);
//       };

//       recognition.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//         setIsRecording(false);
//         alert(`Speech Recognition Error: ${event.error}`);
//       };

//       recognition.onend = () => {
//         if (isRecording) {
//             setIsRecording(false);
//         }
//       };
      
//       recognitionRef.current = recognition;
//     } else {
//       console.warn("Speech recognition not supported in this browser.");
//     }
//   }, [answers, currentQuestion, isRecording]);


//   const toggleRecording = () => {
//     const recognition = recognitionRef.current;
//     if (!recognition) {
//       alert("Speech recognition not supported in your browser.");
//       return;
//     }

//     if (isRecording) {
//       recognition.stop();
//       setIsRecording(false); 
//     } else {
//       try {
//         recognition.start();
//         setIsRecording(true); 
//         setShowValidation(false);
//       } catch (err) {
//         if (err.name === "InvalidStateError") {
//           recognition.stop();
//           setTimeout(() => {
//              try {
//                 recognition.start();
//                 setIsRecording(true);
//              } catch (e) {
//                 console.error("Restart failed", e);
//              }
//           }, 300);
//         } else {
//           console.error(err);
//         }
//       }
//     }
//   };

//   const speakQuestion = () => {
//     if ("speechSynthesis" in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question);
//       utterance.lang = "en-US";
//       utterance.rate = 0.9;
//       utterance.onstart = () => setIsSpeaking(true);
//       utterance.onend = () => setIsSpeaking(false);
//       utterance.onerror = () => setIsSpeaking(false);
//       window.speechSynthesis.speak(utterance);
//     } else alert("Text-to-speech is not supported in your browser.");
//   };

//   const handleAnswerChange = (value) => {
//     const newAnswers = [...answers];
//     newAnswers[currentQuestion] = value;
//     setAnswers(newAnswers);
//     setShowValidation(false);
//   };

//   const validateAnswer = () => {
//     const currentAnswer = answers[currentQuestion].trim();
//     if (currentAnswer === "") {
//       return "Please provide an answer before proceeding.";
//     }
//     if (getWordCount(currentAnswer) < MIN_WORDS) {
//       return `Answer must contain a minimum of ${MIN_WORDS} words. Current count: ${getWordCount(currentAnswer)}`;
//     }
//     return null;
//   };

//   const handleNext = () => {
//     const validationError = validateAnswer();
//     if (validationError) {
//       setShowValidation(true);
//       return;
//     }

//     if (currentQuestion < questions.length - 1) {
//       if (isRecording) recognitionRef.current?.stop();
//       setCurrentQuestion((prev) => prev + 1);
//       setShowValidation(false);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       if (isRecording) recognitionRef.current?.stop();
//       setCurrentQuestion((prev) => prev - 1);
//       setShowValidation(false);
//     }
//   };

//   const handleSubmit = async () => {
//     const validationError = validateAnswer();
//     if (validationError) {
//       setShowValidation(true);
//       return;
//     }

//     if (isRecording) recognitionRef.current?.stop();

//     if (isSubmitting) {
//         console.warn("Submission already in progress. Skipping.");
//         return;
//     }
//     setIsSubmitting(true);

//     const interviewData = questions.map((q, index) => ({
//       question: q.question,
//       answer: answers[index],
//     }));

//     const userId = "temp_user_id_12345";

//     if (!role || !userId || interviewData.length === 0) {
//       console.error("Critical submission data missing:", { userId, role, interviewDataLength: interviewData.length });
//       alert("Cannot submit: Role, User ID, or Answers are missing.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await getAIResults(userId, role, interviewData);
      
//       localStorage.setItem("tempInterviewData", JSON.stringify(interviewData));
//       localStorage.setItem("tempInterviewRole", role);

//       navigate("/result");
      
//       if (typeof onComplete === "function") {
//         onComplete(interviewData, questions.length);
//       }
      
//     } catch (error) {
//       console.error("❌ Interview submission failed. Server Error:", error.message);
//       alert(`Failed to submit interview. Please check the console. Error: ${error.message}`);
//     } finally {
//         setIsSubmitting(false);
//     }
//   };

//   const progress = ((currentQuestion + 1) / questions.length) * 100;
//   const wordCount = getWordCount(answers[currentQuestion]);
//   const validationMessage = validateAnswer();

//   return (
//     <div
//       className="min-vh-100"
//       style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #E8EAF6 100%)" }}
//     >
//       {/* 🚀 ADDED: LOADING OVERLAY */}
//       {isSubmitting && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
//           style={{
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             zIndex: 9999,
//             backdropFilter: "blur(5px)"
//           }}
//         >
//           <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem" }} role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <h3 className="mt-4 text-primary fw-bold">Generating AI Feedback...</h3>
//           <p className="text-muted lead">Please wait while we analyze your answers.</p>
//         </div>
//       )}

//       <header className="bg-white shadow-sm">
//         <div className="container py-3">
//           <h5 className="text-primary mb-0">🚀 AI-Powered SmartInterview Portal</h5>
//         </div>
//       </header>

//       <main className="container py-4">
//         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
//           <div className="mb-4">
//             <div className="d-flex justify-content-between mb-2">
//               <span>
//                 Question {currentQuestion + 1} of {questions.length}
//               </span>
//               <span className="text-primary fw-semibold">{Math.round(progress)}% Complete</span>
//             </div>
//             <div className="progress" style={{ height: "12px" }}>
//               <div
//                 className="progress-bar bg-primary"
//                 style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
//               ></div>
//             </div>
//           </div>

//           <div className="card shadow-lg border-0 mb-4">
//             <div className="card-body p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <span className="badge bg-primary px-3 py-2">
//                   {role.charAt(0).toUpperCase() + role.slice(1)}
//                 </span>
//                 <button
//                   onClick={speakQuestion}
//                   className={`btn btn-sm ${isSpeaking ? "btn-primary" : "btn-outline-primary"}`}
//                   style={{ borderRadius: "50%", transition: "all 0.3s ease" }}
//                   onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
//                   onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
//                 >
//                   🔊
//                 </button>
//               </div>

//               <h4 className="mb-4">{questions[currentQuestion].question}</h4>

//               <div className="mb-3">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <label className="form-label fw-semibold mb-0">Your Answer:</label>
//                   <button
//                     onClick={toggleRecording}
//                     className={`btn btn-sm ${isRecording ? "btn-danger pulse" : "btn-primary"}`}
//                     style={{ transition: "all 0.3s ease" }}
//                     onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
//                     onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
//                   >
//                     {isRecording ? "🔴 Recording..." : " Voice Input"}
//                   </button>
//                 </div>

//                 <textarea
//                   value={answers[currentQuestion]}
//                   onChange={(e) => handleAnswerChange(e.target.value)}
//                   placeholder="Type your answer here or use voice input..."
//                   className="form-control"
//                   rows={8}
//                   style={{ resize: "none", borderRadius: "10px", border: "1px solid #ccc", transition: "all 0.3s ease" }}
//                   onFocus={(e) => (e.target.style.boxShadow = "0 0 10px rgba(33,150,243,0.5)")}
//                   onBlur={(e) => (e.target.style.boxShadow = "none")}
//                 />

//                 <div className="d-flex justify-content-between align-items-center mt-2">
//                   <small className={`text-muted ${wordCount < MIN_WORDS ? 'text-danger' : 'text-success'}`}>
//                     Word Count: {wordCount} (Min: {MIN_WORDS})
//                   </small>
//                 </div>
                
//                 {showValidation && validationMessage && (
//                     <div className="alert alert-danger mt-2">
//                         {validationMessage}
//                     </div>
//                 )}
//               </div>

//               <div className="d-flex justify-content-between">
//                 <button
//                   onClick={handlePrevious}
//                   className="btn btn-outline-primary fw-semibold px-4 py-2"
//                   disabled={currentQuestion === 0}
//                   style={{ transition: "all 0.3s ease", opacity: currentQuestion === 0 ? 0.5 : 1 }}
//                   onMouseEnter={(e) => { if (currentQuestion !== 0) { e.target.style.transform = "scale(1.08)"; e.target.style.backgroundColor = "#2196F3"; e.target.style.color = "white"; } }}
//                   onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.backgroundColor = ""; e.target.style.color = ""; }}
//                 >
//                   ← Previous
//                 </button>

//                 {currentQuestion === questions.length - 1 ? (
//                   <button
//                     onClick={handleSubmit}
//                     className="btn btn-success fw-semibold px-4 py-2"
//                     disabled={isSubmitting}
//                     style={{ background: "linear-gradient(90deg, #43A047, #66BB6A)", border: "none", transition: "all 0.3s ease" }}
//                     onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
//                     onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
//                   >
//                     {isSubmitting ? "Submitting..." : "Submit Interview"}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleNext}
//                     className="btn btn-primary fw-semibold px-4 py-2"
//                     style={{ background: "linear-gradient(90deg, #2196F3, #21CBF3)", border: "none", transition: "all 0.3s ease" }}
//                     onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
//                     onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
//                   >
//                     Next →
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }








import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Volume2, ChevronLeft, ChevronRight, Send, 
  AlertCircle, Loader2, Clock, Sparkles 
} from "lucide-react";
import { getAIResults } from "../api/ai";

const questionsData = {
  frontend: [
    { id: 1, question: "What is JSX in React?" },
    { id: 2, question: "Explain the concept of React hooks and their benefits." },
    { id: 3, question: "How does the Virtual DOM work in React?" },
    { id: 4, question: "What is Flexbox used for in CSS?" },
    { id: 5, question: "What are the benefits of using TypeScript over JavaScript?" },
  ],
  backend: [
    { id: 1, question: "What is Node.js used for?" },
    { id: 2, question: "What is the difference between SQL and NoSQL databases?" },
    { id: 3, question: "What is a schema in MongoDB?" },
    { id: 4, question: "Explain how JWT authentication works." },
    { id: 5, question: "Explain how middleware works in Express.js." },
  ],
  datascience: [
    { id: 1, question: "Explain the difference between supervised and unsupervised learning?" },
    { id: 2, question: "What is feature engineering and why is it important?" },
    { id: 3, question: "Describe the bias-variance tradeoff in machine learning." }
  ],
  aiml: [
    { id: 1, question: "Explain how a convolutional neural network works." },
    { id: 2, question: "What is transfer learning and when would you use it?" }
  ],
  devops: [
    { id: 1, question: "What is CI/CD and why is it important?" },
    { id: 2, question: "Explain the concept of Infrastructure as Code (IaC)." }
  ],
  cybersecurity: [
    { id: 1, question: "What is the difference between encryption, hashing, and salting?" },
    { id: 2, question: "Explain what SQL injection is and how to prevent it." }
  ]
};

const getWordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

export default function QAPage_temp({ role: propRole }) {
  const navigate = useNavigate();
  
  // Determine role (Priority: Props > localStorage)
  const currentRole = propRole || localStorage.getItem("selected_interview_role");
  
  // --- 1. STATES ---
  const questions = questionsData[currentRole] || questionsData.frontend;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(""));
  const [showValidation, setShowValidation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const recognitionRef = useRef(null);
  const MIN_WORDS = 10;

  // --- 2. SETUP ---
  useEffect(() => {
    // If no role is found anywhere, send them back to selection
    if (!currentRole) {
       navigate("/roles");
       return;
    }
    localStorage.removeItem("tempInterviewData");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        }
        if (finalTranscript) {
          setAnswers(prev => {
            const newA = [...prev];
            newA[currentQuestion] = (newA[currentQuestion] + " " + finalTranscript).trim();
            return newA;
          });
        }
      };
      recognitionRef.current = recognition;
    }
  }, [currentQuestion, currentRole, navigate]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
      setShowValidation(false);
    }
  };

  const speakQuestion = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (getWordCount(answers[currentQuestion]) < MIN_WORDS) {
      setShowValidation(true);
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowValidation(false);
    }
  };

  // --- 3. SUBMISSION LOGIC ---
  const handleSubmit = async () => {
    if (getWordCount(answers[currentQuestion]) < MIN_WORDS) {
      setShowValidation(true);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const savedUserString = localStorage.getItem("smart_interview_user");
      if (!savedUserString) throw new Error("Please log in again.");

      const savedUser = JSON.parse(savedUserString);
      const userId = savedUser?._id || savedUser?.id || savedUser?.uid;

      const interviewData = questions.map((q, i) => ({ 
        question: q.question, 
        answer: answers[i] 
      }));

      // CRITICAL: Ensure role is valid
      if (!userId || !currentRole) throw new Error("Missing session data.");

      await getAIResults(userId, currentRole, interviewData);
      
      localStorage.setItem("tempInterviewData", JSON.stringify(interviewData));
      setTimeout(() => navigate("/result"), 2500);

    } catch (e) {
      console.error("Submission Error:", e.message);
      alert(`Submission Error: ${e.message}`);
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
      
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)", zIndex: 9999 }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-5 rounded-5 border bg-white shadow-2xl" style={{ maxWidth: '400px' }}>
              <Loader2 size={64} className="text-primary animate-spin mb-4 mx-auto" />
              <h3 className="fw-black tracking-tighter">Analyzing Performance</h3>
              <p className="text-secondary small">Evaluating technical depth and communication patterns...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-bottom py-3 sticky-top bg-white z-2">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-dark p-1 rounded-2 text-white"><Clock size={16} /></div>
            <span className="fw-bold small tracking-tight">Technical Assessment</span>
          </div>
          <div className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-bold small">
            {(currentRole || "General").toUpperCase()} TRACK
          </div>
        </div>
      </header>

      <main className="container flex-grow-1 py-5">
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          <div className="mb-5 px-2">
            <div className="d-flex justify-content-between align-items-end mb-2">
              <span className="small fw-black text-muted text-uppercase tracking-widest">Question {currentQuestion + 1} / {questions.length}</span>
              <span className="fw-bold text-primary small">{Math.round(progress)}%</span>
            </div>
            <div className="progress rounded-pill" style={{ height: "4px", backgroundColor: "#f1f5f9" }}>
              <motion.div className="progress-bar bg-primary rounded-pill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
            </div>
          </div>

          <motion.div key={currentQuestion} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h2 className="fw-black tracking-tighter lh-base pe-5">{questions[currentQuestion].question}</h2>
              <button onClick={speakQuestion} className={`btn rounded-circle p-3 shadow-sm border transition-all ${isSpeaking ? 'bg-primary text-white' : 'bg-white text-dark'}`}>
                <Volume2 size={24} />
              </button>
            </div>

            <textarea
              className="form-control border-0 bg-light rounded-4 p-4 fs-5 mb-4 shadow-inner"
              rows={10}
              placeholder="Start speaking or type your answer here..."
              value={answers[currentQuestion]}
              onChange={(e) => {
                const newA = [...answers];
                newA[currentQuestion] = e.target.value;
                setAnswers(newA);
                setShowValidation(false);
              }}
              style={{ minHeight: "300px", resize: "none" }}
            />
            
            <div className="d-flex align-items-center justify-content-between mt-3 px-2">
              <button onClick={toggleRecording} className={`btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 border-0 shadow-sm transition-all ${isRecording ? 'btn-danger pulse-red' : 'btn-dark'}`}>
                {isRecording ? "🔴 Listening..." : <><Mic size={18} /> Voice Input</>}
              </button>
              <div className={`fw-bold small px-3 py-1 rounded-pill border ${getWordCount(answers[currentQuestion]) < MIN_WORDS ? 'text-danger bg-danger bg-opacity-10 border-danger' : 'text-success bg-success bg-opacity-10 border-success'}`}>
                 {getWordCount(answers[currentQuestion])} / {MIN_WORDS} words
              </div>
            </div>

            <AnimatePresence>
              {showValidation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="alert alert-danger border-0 rounded-4 fw-bold small d-flex align-items-center gap-2 mt-4">
                  <AlertCircle size={16} /> Minimum {MIN_WORDS} words required for evaluation.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="d-flex justify-content-between pt-4 mt-4 border-top">
              <button onClick={() => setCurrentQuestion(c => c - 1)} disabled={currentQuestion === 0} className="btn btn-link text-dark text-decoration-none fw-bold small opacity-50 hover-opacity-100">
                <ChevronLeft size={18} /> Previous
              </button>
              {currentQuestion === questions.length - 1 ? (
                <button onClick={handleSubmit} className="btn btn-primary rounded-pill px-5 py-3 fw-black shadow-lg d-flex align-items-center gap-2">
                  Complete Assessment <Send size={18} />
                </button>
              ) : (
                <button onClick={handleNext} className="btn btn-dark rounded-pill px-5 py-3 fw-black shadow-lg d-flex align-items-center gap-2">
                  Next Question <ChevronRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        .fw-black { font-weight: 900 !important; }
        .shadow-2xl { box-shadow: 0 40px 80px rgba(0,0,0,0.1); }
        .animate-spin { animation: spin 1.2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}