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
  Target,
  Bot,
  Quote
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

    localStorage.removeItem("tempInterviewData"); 
    localStorage.removeItem("tempInterviewRole");

    setInterviewData(data);
    setRole(savedRole);  
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
                <div className="d-flex gap-3 p-3 rounded-4 bg-white border feedback-row">
                    <div className="feedback-icon-chip bg-emerald-soft text-emerald">
                        <Trophy size={16} />
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="fw-black text-emerald text-uppercase small mb-1">Strengths</h6>
                        {sections.quality.map((line, i) => <div key={i} className="text-dark small fw-medium opacity-75">{line.replace(/quality:|strength:/i, '')}</div>)}
                    </div>
                </div>
            )}
            {sections.missing.length > 0 && (
                <div className="d-flex gap-3 p-3 rounded-4 bg-white border feedback-row">
                    <div className="feedback-icon-chip bg-warning bg-opacity-10 text-warning-emphasis">
                        <Target size={16} />
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="fw-black text-dark text-uppercase small mb-1">Knowledge Gaps</h6>
                        {sections.missing.map((line, i) => <div key={i} className="text-dark small fw-medium opacity-75">{line.replace(/missing:|weakness:/i, '')}</div>)}
                    </div>
                </div>
            )}
            {sections.improve.length > 0 && (
                <div className="d-flex gap-3 p-3 rounded-4 bg-white border feedback-row">
                    <div className="feedback-icon-chip bg-indigo-soft text-indigo">
                        <Lightbulb size={16} />
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="fw-black text-indigo text-uppercase small mb-1">Improvement Plan</h6>
                        {sections.improve.map((line, i) => <div key={i} className="text-dark small fw-medium opacity-75">{line.replace(/improve:|suggestion:/i, '')}</div>)}
                    </div>
                </div>
            )}
            {sections.general.length > 0 && (
                 <div className="p-3 ui-bg-light rounded-4 text-muted small border">
                    {sections.general.join(' ')}
                 </div>
            )}
        </div>
    );
  };

  if (!interviewData.length) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center ui-bg-light">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <AlertCircle size={48} className="text-muted mb-3" />
          <h4 className="fw-black text-dark">Interview Data Missing</h4>
          <button onClick={() => navigate("/roles")} className="btn bg-slate text-white rounded-pill px-4 mt-3 hover-up">Back to Tracks</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 ui-bg-light d-flex flex-column" style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a" }}>
      
      {/* --- PREMIUM HEADER --- */}
      <header className="border-bottom py-5 bg-white shadow-sm z-2">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge rounded-pill bg-indigo-soft border border-indigo text-indigo px-3 py-2 mb-3 shadow-sm fw-bold">
              <Sparkles size={14} className="me-2" /> AI Evaluation Report
            </span>
            <h1 className="display-4 fw-black tracking-tighter mb-2 text-dark">Performance <span className="text-indigo">Insights.</span></h1>
            <p className="text-secondary lead mb-4">Domain: <span className="fw-bold text-dark">{role.toUpperCase()}</span></p>

            <button
              onClick={handleGenerateFeedback}
              disabled={loading || hasFetched} 
              className={`btn btn-lg rounded-pill px-5 py-3 fw-black shadow-lg transition-all btn-hover-lift border-0 ${hasFetched ? 'bg-emerald text-white' : 'bg-gradient-primary text-white'}`}
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
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card border-0 shadow-sm rounded-5 bg-slate text-white p-5 mb-5 overflow-hidden position-relative">
                   <div className="position-absolute top-0 end-0 p-5 opacity-10"><BrainCircuit size={150} /></div>
                   <div className="position-relative z-1">
                      <h3 className="fw-black mb-3 d-flex align-items-center gap-3" style={{ color: "var(--indigo-100)" }}>
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
                     <div className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow" style={{ width: '40px', height: '40px' }}>{idx + 1}</div>
                     <h4 className="fw-bold m-0 tracking-tight text-dark">{item.question}</h4>
                  </div>

                  <div className="qa-panel rounded-4 border shadow-sm overflow-hidden">

                    {/* CANDIDATE ROW */}
                    <div className="qa-row d-flex gap-3 p-4">
                      <div className="qa-avatar qa-avatar-user flex-shrink-0">
                        <User size={16} />
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-uppercase small fw-black text-muted">Your Response</span>
                        </div>
                        <p className="mb-0 text-dark opacity-75 fw-medium small" style={{ lineHeight: 1.6 }}>
                          {item.answer || "No recording found."}
                        </p>
                      </div>
                    </div>

                    <div className="qa-divider"></div>

                    {/* AI ROW */}
                    <div className="qa-row qa-row-ai d-flex gap-3 p-4">
                      <div className="qa-avatar qa-avatar-ai flex-shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-uppercase small fw-black text-indigo d-flex align-items-center gap-2">
                            <MessageSquare size={13} /> Gemini Analysis
                          </span>
                        </div>

                        {loading && isGeneratingClicked ? (
                          <div className="text-center py-4">
                             <Loader2 className="animate-spin text-indigo opacity-50 mb-2 mx-auto" size={28} />
                             <div className="text-muted small fw-bold">Evaluating logic...</div>
                          </div>
                        ) : hasFetched ? (
                          renderStructuredFeedback(item.feedback)
                        ) : (
                          <div className="qa-empty d-flex align-items-center gap-2 py-4 px-3 text-muted small">
                             <Quote size={16} className="text-indigo opacity-50" />
                             Click "Reveal AI Feedback" above to see insights for this answer.
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
               <button onClick={() => navigate("/roles")} className="btn bg-white border border-secondary-subtle text-dark rounded-pill px-5 py-3 fw-black d-flex align-items-center gap-2 mx-auto transition-all hover-up shadow-sm">
                  <ChevronLeft size={20} /> Start New Assessment
               </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-top text-center text-muted small mt-auto bg-white">
        © 2026 SmartInterview Professional • High-Fidelity Performance Metrics
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        
        :root {
          --indigo-600: #4f46e5;
          --indigo-100: #e0e7ff;
          --emerald-500: #10b981;
          --slate-900: #0f172a;
        }

        .ui-bg-light { background-color: #f8fafc; }
        .text-indigo { color: var(--indigo-600) !important; }
        .bg-indigo { background-color: var(--indigo-600) !important; }
        .border-indigo { border-color: var(--indigo-600) !important; }
        .bg-indigo-soft { background-color: rgba(79, 70, 229, 0.08) !important; }
        
        .text-emerald { color: var(--emerald-500) !important; }
        .bg-emerald { background-color: var(--emerald-500) !important; }
        .border-emerald { border-color: var(--emerald-500) !important; }
        .bg-emerald-soft { background-color: rgba(16, 185, 129, 0.08) !important; }
        
        .bg-slate { background-color: var(--slate-900) !important; }
        .bg-gradient-primary { background: linear-gradient(135deg, var(--indigo-600) 0%, #7c3aed 100%); }

        .fw-black { font-weight: 900 !important; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .transition-all { transition: all 0.25s ease; }
        .hover-up:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .btn-hover-lift:hover:not(:disabled) { 
          transform: translateY(-3px); 
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.25)!important; 
        }

        /* --- modern Q&A panel --- */
        .qa-panel { background: #ffffff; transition: box-shadow .15s ease, transform .15s ease; }
        .qa-panel:hover { box-shadow: 0 10px 30px rgba(15,23,42,0.06); }
        .qa-row { background: #ffffff; }
        .qa-row-ai { background: rgba(79, 70, 229, 0.02); }
        .qa-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(15,23,42,0.06) 15%, rgba(15,23,42,0.06) 85%, transparent); }
        .qa-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .qa-avatar-user { background: #e2e8f0; color: #334155; }
        .qa-avatar-ai { background: var(--indigo-100); color: var(--indigo-600); }
        .qa-empty {
          border: 1px dashed rgba(79, 70, 229, 0.2);
          border-radius: 1rem;
          background: rgba(79, 70, 229, 0.02);
        }
        .feedback-row { transition: box-shadow .15s ease; }
        .feedback-row:hover { box-shadow: 0 6px 16px rgba(15,23,42,0.05); }
        .feedback-icon-chip {
          width: 32px; height: 32px; min-width: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>
    </div>
  );
}