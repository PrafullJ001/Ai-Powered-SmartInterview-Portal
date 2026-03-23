// import React, { useEffect, useState } from "react";
// import { generateAIFeedback } from "../api/ai"; 
// import { useLocation, useNavigate } from "react-router-dom"; 

// export default function ResultPage() {
//   const navigate = useNavigate();
//   const location = useLocation(); 

//   const [interviewData, setInterviewData] = useState([]);
//   const [role, setRole] = useState("");
//   const [overallFeedback, setOverallFeedback] = useState(""); 
//   const [loading, setLoading] = useState(false);
//   const [idError, setIdError] = useState("");
//   const [hasFetched, setHasFetched] = useState(false); 
//   const [isGeneratingClicked, setIsGeneratingClicked] = useState(false); 

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("tempInterviewData") || "[]");
//     const savedRole = localStorage.getItem("tempInterviewRole") || "";
//     setInterviewData(data);
//     setRole(savedRole);

//     // Note: We keep data in state, but clear storage so a refresh doesn't trigger logic again
//     localStorage.removeItem("tempInterviewData");
//     localStorage.removeItem("tempInterviewRole");
//   }, []);
  
//   const handleGenerateFeedback = async () => {
//     // FIX 1: Prevent double hit if already loading or already fetched
//     if (loading || hasFetched) return;

//     const interviewId = localStorage.getItem("interviewId");

//     if (!interviewId) {
//       setIdError("❌ Interview ID not found! Cannot generate AI feedback.");
//       return;
//     }

//     try {
//       setIsGeneratingClicked(true);       
//       setLoading(true);
//       setIdError(""); 
      
//       // FIX 2: This should be your SINGLE backend call that sends the 
//       // entire interview to Gemini in one prompt.
//       const res = await generateAIFeedback(interviewId);
      
//       const feedbackArray = res?.questions; 
//       const summary = res?.summary || "Summary feedback placeholder."; 

//       if (feedbackArray && Array.isArray(feedbackArray)) {
//         const updatedInterviewData = interviewData.map(qaItem => {
//           const feedbackItem = feedbackArray.find(
//             fb => fb.question === qaItem.question
//           );

//           return {
//             ...qaItem,
//             feedback: feedbackItem?.aiFeedback || "",
//           };
//         });

//         setInterviewData(updatedInterviewData);
//         setHasFetched(true); // Marks it as done to prevent re-clicks
//         setOverallFeedback(summary);
//       } else {
//         console.error("Server response structure problem:", res);
//         setIdError("⚠️ Feedback data structure missing in the server response.");
//       }

//     } catch (err) {
//       setOverallFeedback("Error generating feedback.");
//       setIdError(`Feedback Error: ${err.message}`);
//       console.error("Feedback error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStructuredFeedback = (text) => {
//     if (!text) return <span className="text-muted fst-italic">No feedback generated yet.</span>;

//     const sections = { quality: [], missing: [], improve: [], general: [] };
//     let currentSection = 'general';
    
//     text.split('\n').forEach(line => {
//         const lower = line.toLowerCase();
//         if (lower.includes('quality') || lower.includes('strength')) currentSection = 'quality';
//         else if (lower.includes('missing') || lower.includes('weakness')) currentSection = 'missing';
//         else if (lower.includes('improve') || lower.includes('suggestion')) currentSection = 'improve';
//         sections[currentSection].push(line);
//     });

//     if (sections.quality.length === 0 && sections.missing.length === 0 && sections.improve.length === 0) {
//         return (
//             <div className="p-4 bg-white rounded-3 border-start border-5 border-primary shadow-sm">
//                  <h5 className="fw-bold text-primary mb-3">GENERAL ANALYSIS</h5>
//                  {text.split('\n').map((line, i) => (
//                     <div key={i} className="mb-1">{line}</div>
//                  ))}
//             </div>
//         );
//     }

//     return (
//         <div className="d-flex flex-column gap-4">
//             {sections.quality.length > 0 && (
//                 <div className="p-4 bg-success bg-opacity-10 rounded-3 border-start border-5 border-success">
//                     <h4 className="fw-bold text-success text-uppercase mb-3 d-flex align-items-center">
//                         <span className="fs-3 me-2">✅</span> 1. Quality & Strengths
//                     </h4>
//                     {sections.quality.map((line, i) => <div key={i} className="text-dark fw-medium mb-1 fs-5">{line.replace(/quality:|strength:/i, '')}</div>)}
//                 </div>
//             )}
//             {sections.missing.length > 0 && (
//                 <div className="p-4 bg-warning bg-opacity-10 rounded-3 border-start border-5 border-warning">
//                     <h4 className="fw-bold text-dark text-uppercase mb-3 d-flex align-items-center">
//                         <span className="fs-3 me-2">✅</span> 2. Missing Points
//                     </h4>
//                     {sections.missing.map((line, i) => <div key={i} className="text-dark fw-medium mb-1 fs-5">{line.replace(/missing:|weakness:/i, '')}</div>)}
//                 </div>
//             )}
//             {sections.improve.length > 0 && (
//                 <div className="p-4 bg-info bg-opacity-10 rounded-3 border-start border-5 border-info">
//                     <h4 className="fw-bold text-primary text-uppercase mb-3 d-flex align-items-center">
//                         <span className="fs-3 me-2">✅</span> 3. How to Improve
//                     </h4>
//                     {sections.improve.map((line, i) => <div key={i} className="text-dark fw-medium mb-1 fs-5">{line.replace(/improve:|suggestion:/i, '')}</div>)}
//                 </div>
//             )}
//             {sections.general.length > 0 && (
//                  <div className="p-3 bg-light rounded text-muted small">
//                     <strong>Other Notes:</strong> {sections.general.join(' ')}
//                  </div>
//             )}
//         </div>
//     );
//   };

//   if (!interviewData.length) {
//     return (
//       <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
//         <div className="card shadow border-0 p-5 text-center" style={{ maxWidth: '500px' }}>
//           <h3 className="text-danger mb-3">⚠️ Interview Data Missing</h3>
//           <p className="text-muted">Please complete the interview to view results.</p>
//           <button onClick={() => navigate("/roles")} className="btn btn-primary rounded-pill px-4 mt-3">⬅ Back to Role Selection</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-vh-100 d-flex flex-column py-5 px-3" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #f8f9fa 100%)", animation: "gradientMove 8s ease infinite alternate", backgroundSize: "200% 200%" }}>
//       <style>{`@keyframes gradientMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }`}</style>
//       <div className="container-fluid flex-grow-1" style={{ maxWidth: "1000px" }}>
//         <div className="text-center mb-5">
//           <h1 className="fw-bold text-dark mb-2 display-5">📊 Interview Analysis Dashboard</h1>
//           <span className="badge bg-white text-dark border border-2 px-4 py-2 rounded-pill shadow-sm fs-6 mt-2">ROLE: {role.toUpperCase()}</span>

//           <div className="mt-4">
//             <button
//               className={`btn btn-lg rounded-pill px-5 py-3 fw-bold text-white shadow`}
//               style={{
//                 background: hasFetched ? "linear-gradient(90deg, #198754, #20c997)" : "linear-gradient(90deg, #0d6efd, #0dcaf0)",
//                 border: "none",
//                 transition: "transform 0.2s",
//                 opacity: (loading || hasFetched) ? 0.8 : 1,
//                 cursor: (loading || hasFetched) ? "not-allowed" : "pointer"
//               }}
//               onClick={handleGenerateFeedback}
//               disabled={loading || hasFetched} 
//             >
//               {loading ? <><span className="spinner-border spinner-border-sm me-2"></span> Generating Analysis...</> : hasFetched ? " Analysis Complete" : " Display AI Feedback"}
//             </button>
//           </div>
//           {idError && <div className="alert alert-danger mt-3 d-inline-block shadow-sm">{idError}</div>}
//         </div>

//         {overallFeedback && overallFeedback !== "Summary feedback placeholder." && (
//           <div className="card border-0 shadow mb-5 rounded-4 overflow-hidden">
//             <div className="card-header bg-dark text-white border-bottom-0 pt-4 px-5">
//               <div className="d-flex align-items-center"><span className="fs-2 me-3">🧠</span><h3 className="fw-bold mb-0">AI Executive Summary</h3></div>
//             </div>
//             <div className="card-body px-5 pb-5 bg-white"><p className="mb-0 text-dark lh-lg fs-5">{overallFeedback}</p></div>
//           </div>
//         )}

//         {interviewData.map((item, idx) => (
//           <div key={idx} className="card border-0 shadow mb-5 rounded-4 overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
//             <div className="card-header bg-white border-bottom p-4">
//               <h4 className="fw-bold text-dark mb-0 d-flex align-items-start">
//                 <span className="badge bg-primary rounded-circle p-3 me-3 fs-5 mt-1">Q{idx + 1}</span>
//                 <span style={{ lineHeight: '1.4' }}>{item.question}</span>
//               </h4>
//             </div>
//             <div className="card-body p-4">
//               <div className="mb-5">
//                 <h6 className="text-uppercase fw-bold text-secondary mb-3 ps-1" style={{ letterSpacing: '1px' }}>👤 Your Answer</h6>
//                 <div className="p-4 bg-light rounded-3 border shadow-sm"><p className="mb-0 text-dark fw-medium fs-5" style={{ lineHeight: '1.6' }}>{item.answer || <span className="text-muted fst-italic">No answer recorded...</span>}</p></div>
//               </div>
//               <div>
//                 <h6 className="text-uppercase fw-bold text-primary mb-3 ps-1" style={{ letterSpacing: '1px' }}>🤖 AI Analysis</h6>
//                 <div className="bg-white rounded-3">
//                   {loading && isGeneratingClicked ? (
//                     <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
//                       <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
//                       <h5 className="fw-bold">Analyzing quality, missing points, and improvements...</h5>
//                     </div>
//                   ) : hasFetched ? renderStructuredFeedback(item.feedback) : (
//                     <div className="text-center py-5 bg-light rounded-3 border border-dashed">
//                       <h5 className="text-muted fw-bold mb-1">Feedback Pending</h5>
//                       <small className="text-muted">Click the "Display AI Feedback" button above to analyze.</small>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="text-center mt-5 mb-5">
//           <button className="btn btn-outline-primary btn-lg rounded-pill px-5 fw-bold border-2" onClick={() => navigate("/roles")}>Start New Interview</button>
//         </div>
//       </div>
//     </div>
//   );
// }












import React, { useEffect, useState } from "react";
import { generateAIFeedback } from "../api/ai"; 
import { useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  BrainCircuit, 
  User, 
  MessageSquare, 
  Sparkles, 
  ChevronLeft,
  Loader2,
  Trophy,
  Target
} from "lucide-react";

export default function ResultPage() {
  const navigate = useNavigate();

  const [interviewData, setInterviewData] = useState([]);
  const [role, setRole] = useState("");
  const [overallFeedback, setOverallFeedback] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [idError, setIdError] = useState("");
  const [hasFetched, setHasFetched] = useState(false); 
  const [isGeneratingClicked, setIsGeneratingClicked] = useState(false); 

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tempInterviewData") || "[]");
    const savedRole = localStorage.getItem("tempInterviewRole") || "General";
    setInterviewData(data);
    setRole(savedRole);

    localStorage.removeItem("tempInterviewData");
    localStorage.removeItem("tempInterviewRole");
  }, []);
  
  const handleGenerateFeedback = async () => {
    if (loading || hasFetched) return;
    const interviewId = localStorage.getItem("interviewId");

    if (!interviewId) {
      setIdError("❌ Interview ID not found! Cannot generate AI feedback.");
      return;
    }

    try {
      setIsGeneratingClicked(true);       
      setLoading(true);
      setIdError(""); 
      
      const res = await generateAIFeedback(interviewId);
      const feedbackArray = res?.questions; 
      const summary = res?.summary || "Summary feedback placeholder."; 

      if (feedbackArray && Array.isArray(feedbackArray)) {
        const updatedInterviewData = interviewData.map(qaItem => {
          const feedbackItem = feedbackArray.find(
            fb => fb.question === qaItem.question
          );
          return {
            ...qaItem,
            feedback: feedbackItem?.aiFeedback || "",
          };
        });

        setInterviewData(updatedInterviewData);
        setHasFetched(true);
        setOverallFeedback(summary);
      } else {
        setIdError("⚠️ Feedback data structure missing in the server response.");
      }
    } catch (err) {
      setOverallFeedback("Error generating feedback.");
      setIdError(`Feedback Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStructuredFeedback = (text) => {
    if (!text) return <span className="text-muted fst-italic">No feedback generated yet.</span>;

    const sections = { quality: [], missing: [], improve: [], general: [] };
    let currentSection = 'general';
    
    text.split('\n').forEach(line => {
        const lower = line.toLowerCase();
        if (lower.includes('quality') || lower.includes('strength')) currentSection = 'quality';
        else if (lower.includes('missing') || lower.includes('weakness')) currentSection = 'missing';
        else if (lower.includes('improve') || lower.includes('suggestion')) currentSection = 'improve';
        sections[currentSection].push(line);
    });

    return (
        <div className="d-flex flex-column gap-3">
            {sections.quality.length > 0 && (
                <div className="p-3 rounded-4 border-start border-4 border-success bg-success bg-opacity-10">
                    <h6 className="fw-black text-success text-uppercase small mb-2 d-flex align-items-center gap-2">
                        <Trophy size={16} /> Strengths
                    </h6>
                    {sections.quality.map((line, i) => <div key={i} className="text-dark small fw-medium">{line.replace(/quality:|strength:/i, '')}</div>)}
                </div>
            )}
            {sections.missing.length > 0 && (
                <div className="p-3 rounded-4 border-start border-4 border-warning bg-warning bg-opacity-10">
                    <h6 className="fw-black text-dark text-uppercase small mb-2 d-flex align-items-center gap-2">
                        <Target size={16} /> Knowledge Gaps
                    </h6>
                    {sections.missing.map((line, i) => <div key={i} className="text-dark small fw-medium">{line.replace(/missing:|weakness:/i, '')}</div>)}
                </div>
            )}
            {sections.improve.length > 0 && (
                <div className="p-3 rounded-4 border-start border-4 border-primary bg-primary bg-opacity-10">
                    <h6 className="fw-black text-primary text-uppercase small mb-2 d-flex align-items-center gap-2">
                        <Lightbulb size={16} /> Improvement Plan
                    </h6>
                    {sections.improve.map((line, i) => <div key={i} className="text-dark small fw-medium">{line.replace(/improve:|suggestion:/i, '')}</div>)}
                </div>
            )}
            {sections.general.length > 0 && (
                 <div className="p-3 bg-light rounded-4 text-muted small border">
                    {sections.general.join(' ')}
                 </div>
            )}
        </div>
    );
  };

  if (!interviewData.length) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <AlertCircle size={48} className="text-muted mb-3" />
          <h4 className="fw-black">Interview Data Missing</h4>
          <button onClick={() => navigate("/roles")} className="btn btn-dark rounded-pill px-4 mt-3">Back to Tracks</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-white d-flex flex-column" style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a" }}>
      
      {/* --- PREMIUM HEADER --- */}
      <header className="border-bottom py-5 bg-light bg-opacity-50">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge rounded-pill bg-white border text-primary px-3 py-2 mb-3 shadow-sm fw-bold">
              <Sparkles size={14} className="me-2" /> AI Evaluation Report
            </span>
            <h1 className="display-4 fw-black tracking-tighter mb-2">Performance <span className="text-primary">Insights.</span></h1>
            <p className="text-secondary lead mb-4">Domain: <span className="fw-bold text-dark">{role.toUpperCase()}</span></p>

            <button
              onClick={handleGenerateFeedback}
              disabled={loading || hasFetched} 
              className={`btn btn-lg rounded-pill px-5 py-3 fw-black shadow-lg transition-all ${hasFetched ? 'btn-success' : 'btn-primary'}`}
              style={{ minWidth: '280px' }}
            >
              {loading ? <><Loader2 size={20} className="animate-spin me-2" /> Processing...</> : hasFetched ? <><CheckCircle2 size={20} className="me-2" /> Feedback Generated</> : "Reveal AI Feedback"}
            </button>
            
            {idError && <div className="alert alert-danger border-0 rounded-4 shadow-sm mt-4 d-inline-flex align-items-center gap-2 mx-auto"><AlertCircle size={18} /> {idError}</div>}
          </motion.div>
        </div>
      </header>

      <main className="container flex-grow-1 py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* EXECUTIVE SUMMARY */}
            <AnimatePresence>
              {overallFeedback && overallFeedback !== "Summary feedback placeholder." && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card border-0 shadow-sm rounded-5 bg-dark text-white p-5 mb-5 overflow-hidden position-relative">
                   <div className="position-absolute top-0 end-0 p-5 opacity-10"><BrainCircuit size={150} /></div>
                   <div className="position-relative z-1">
                      <h3 className="fw-black mb-3 d-flex align-items-center gap-3 text-primary">
                        <Sparkles size={24} /> Executive Summary
                      </h3>
                      <p className="lead opacity-75 mb-0" style={{ lineHeight: 1.8 }}>{overallFeedback}</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Q&A BLOCKS */}
            <div className="d-grid gap-5">
              {interviewData.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-0">
                  <div className="d-flex align-items-center gap-3 mb-4">
                     <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow" style={{ width: '40px', height: '40px' }}>{idx + 1}</div>
                     <h4 className="fw-bold m-0 tracking-tight">{item.question}</h4>
                  </div>

                  <div className="row g-4">
                    {/* CANDIDATE SIDE */}
                    <div className="col-md-6">
                       <div className="h-100 p-4 rounded-4 border bg-light bg-opacity-40">
                          <h6 className="text-uppercase small fw-black text-muted mb-3 d-flex align-items-center gap-2">
                             <User size={14} /> Your Response
                          </h6>
                          <p className="mb-0 text-dark opacity-75 fw-medium small" style={{ lineHeight: 1.6 }}>{item.answer || "No recording found."}</p>
                       </div>
                    </div>

                    {/* AI SIDE */}
                    <div className="col-md-6">
                       <div className="h-100 p-4 rounded-4 border bg-white shadow-sm position-relative overflow-hidden">
                          <h6 className="text-uppercase small fw-black text-primary mb-3 d-flex align-items-center gap-2">
                             <MessageSquare size={14} /> Gemini Analysis
                          </h6>
                          {loading && isGeneratingClicked ? (
                            <div className="text-center py-5">
                               <Loader2 className="animate-spin text-primary opacity-50 mb-2" size={32} />
                               <div className="text-muted small fw-bold">Evaluating Logic...</div>
                            </div>
                          ) : hasFetched ? (
                            renderStructuredFeedback(item.feedback)
                          ) : (
                            <div className="text-center py-5 text-muted small border-dashed border-2 rounded-4">
                               Click display button to reveal insights
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ACTION FOOTER */}
            <div className="text-center mt-5 pt-5 pb-5">
               <button onClick={() => navigate("/roles")} className="btn btn-outline-dark rounded-pill px-5 py-3 fw-black d-flex align-items-center gap-2 mx-auto transition-all hover-up">
                  <ChevronLeft size={20} /> Start New Assessment
               </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-top text-center text-muted small mt-auto">
        © 2026 SmartInterview Professional • High-Fidelity Performance Metrics
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        .fw-black { font-weight: 900 !important; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .border-dashed { border-style: dashed !important; }
        .hover-up:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
}