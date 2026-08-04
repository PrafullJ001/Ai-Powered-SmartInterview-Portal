import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Volume2, ChevronLeft, ChevronRight, 
  AlertCircle, Loader2, Clock 
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
  
  // --- STATES ---
  const questions = questionsData[currentRole] || questionsData.frontend;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(""));
  const [showValidation, setShowValidation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const recognitionRef = useRef(null);
  const MIN_WORDS = 10;

  // --- SETUP ---
  useEffect(() => {
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

  // --- SUBMISSION LOGIC ---
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
    <div className="min-vh-100 d-flex flex-column ui-bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(248, 250, 252, 0.9)", backdropFilter: "blur(12px)", zIndex: 9999 }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-5 rounded-4 border-light bg-white shadow-lg" style={{ maxWidth: '400px' }}>
              <Loader2 size={64} className="text-indigo animate-spin mb-4 mx-auto" />
              <h3 className="fw-black tracking-tighter text-dark">Analyzing Performance</h3>
              <p className="text-secondary small">Evaluating technical depth and communication patterns...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER (Matches Role Selection) --- */}
      <header className="border-bottom py-3 sticky-top bg-white shadow-sm z-2">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-indigo p-1 rounded-2 text-white"><Clock size={16} /></div>
            <span className="fw-bold small tracking-tight text-dark">Technical Assessment</span>
          </div>
          <div className="badge rounded-pill bg-indigo-soft text-indigo border border-indigo px-3 py-2 fw-bold small">
            {(currentRole || "General").toUpperCase()} TRACK
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container flex-grow-1 py-5">
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          
          {/* Progress Bar */}
          <div className="mb-5 px-2">
            <div className="d-flex justify-content-between align-items-end mb-2">
              <span className="small fw-black text-muted text-uppercase tracking-widest">Question {currentQuestion + 1} / {questions.length}</span>
              <span className="fw-bold text-indigo small">{Math.round(progress)}%</span>
            </div>
            <div className="progress rounded-pill" style={{ height: "6px", backgroundColor: "#e2e8f0" }}>
              <motion.div className="progress-bar bg-gradient-primary rounded-pill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Q&A Section */}
          <motion.div key={currentQuestion} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h2 className="fw-black tracking-tighter lh-base pe-5 text-dark">{questions[currentQuestion].question}</h2>
              <button 
                onClick={speakQuestion} 
                className={`btn rounded-circle p-3 shadow-sm border transition-all ${isSpeaking ? 'bg-gradient-primary border-0 text-white' : 'bg-white text-dark hover-lift'}`}
              >
                <Volume2 size={24} />
              </button>
            </div>

            <textarea
              className="form-control border-0 bg-white rounded-4 p-4 fs-5 mb-4 shadow-sm"
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
              <button 
                onClick={toggleRecording} 
                className={`btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 border-0 shadow-sm transition-all ${isRecording ? 'btn-danger pulse-red' : 'bg-white text-dark hover-lift'}`}
              >
                {isRecording ? "🔴 Listening..." : <><Mic size={18} className="text-indigo" /> Voice Input</>}
              </button>
              
              <div className={`fw-bold small px-3 py-1 rounded-pill border ${getWordCount(answers[currentQuestion]) < MIN_WORDS ? 'text-danger bg-danger bg-opacity-10 border-danger' : 'text-emerald bg-emerald-soft border-emerald'}`}>
                 {getWordCount(answers[currentQuestion])} / {MIN_WORDS} words
              </div>
            </div>

            <AnimatePresence>
              {showValidation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="alert alert-danger border-0 rounded-4 fw-bold small d-flex align-items-center gap-2 mt-4 shadow-sm">
                  <AlertCircle size={16} /> Minimum {MIN_WORDS} words required for evaluation.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Actions */}
            <div className="d-flex justify-content-between pt-4 mt-4 border-top">
              <button 
                onClick={() => setCurrentQuestion(c => c - 1)} 
                disabled={currentQuestion === 0} 
                className="btn btn-link text-secondary text-decoration-none fw-bold small opacity-75 hover-opacity-100 transition-all"
              >
                <ChevronLeft size={18} /> Previous
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button onClick={handleSubmit} className="btn bg-dark text-white rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 btn-hover-lift border-0">
                  Complete Assessment
                </button>
              ) : (
                <button onClick={handleNext} className="btn bg-dark text-white rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center gap-2 btn-hover-lift border-0">
                  Next Question <ChevronRight size={18} />
                </button>
              )}
            </div>
            
          </motion.div>
        </div>
      </main>

      {/* --- GLOBAL STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        
        :root {
          --indigo-600: #4f46e5;
          --indigo-100: #e0e7ff;
          --emerald-500: #10b981;
          --slate-900: #0f172a;
        }

        .ui-bg-light { background-color: #f8fafc; }
        
        .fw-black { font-weight: 900 !important; }
        .tracking-tight { letter-spacing: -0.02em; }
        .tracking-tighter { letter-spacing: -0.04em; }
        .tracking-widest { letter-spacing: 0.1em; }

        .text-indigo { color: var(--indigo-600) !important; }
        .bg-indigo { background-color: var(--indigo-600) !important; }
        .border-indigo { border-color: var(--indigo-600) !important; }
        .bg-indigo-soft { background-color: rgba(79, 70, 229, 0.08) !important; }
        
        .text-emerald { color: var(--emerald-500) !important; }
        .border-emerald { border-color: var(--emerald-500) !important; }
        .bg-emerald-soft { background-color: rgba(16, 185, 129, 0.08) !important; }
        
        .bg-gradient-primary { background: linear-gradient(135deg, var(--indigo-600) 0%, #7c3aed 100%); }

        .transition-all { transition: all 0.25s ease; }
        
        .hover-lift:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 10px 25px rgba(0,0,0,.05)!important; 
        }
        
        .btn-hover-lift:hover:not(:disabled) { 
          transform: translateY(-3px); 
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.25)!important; 
        }

        .hover-opacity-100:hover { opacity: 1 !important; }

        .animate-spin { animation: spin 1.2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .pulse-red { animation: pulseRed 1.5s infinite; }
        @keyframes pulseRed {
          0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
        }

        textarea:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--indigo-100) !important;
        }
      `}</style>
    </div>
  );
}