import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  LogIn, LogOut, CheckCircle2, Cpu, AlertCircle, Loader2, 
  UserCircle2, Sparkles, Terminal, ChevronRight, Globe, Code2, ShieldCheck, Zap,
  MessagesSquare, BarChart4, Target
} from "lucide-react";
import { signInWithGoogle } from "../firebaseConfig"; 

export default function Home({ onGetStarted }) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [statusPopup, setStatusPopup] = useState(null); 

  useEffect(() => {
    const savedUser = localStorage.getItem("smart_interview_user");
    if (savedUser) setUserData(JSON.parse(savedUser));
  }, []);

  const handleGoogleAuth = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);

    try {
  const { user, idToken } = await signInWithGoogle();
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  const backendResponse = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  

      if (!backendResponse.ok) throw new Error("Auth failed");
      const data = await backendResponse.json();
      
      setUserData(data.user);
      localStorage.setItem("smart_interview_user", JSON.stringify(data.user));

      setStatusPopup('login');
      setTimeout(() => {
        setStatusPopup(null);
        onGetStarted();
      }, 3500);

    } catch (error) {
      console.error(error);
      setIsSigningIn(false);
    }
  };

  const handleLogout = () => {
    setStatusPopup('logout');
    setTimeout(() => {
      localStorage.removeItem("smart_interview_user");
      setUserData(null);
      setStatusPopup(null);
      setIsSigningIn(false);
    }, 3500);
  };

  return (
    <div className="min-vh-100 d-flex flex-column ui-bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {statusPopup && (
          <motion.div 
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="position-fixed start-50 translate-middle-x mt-4" 
            style={{ zIndex: 1050 }}
          >
            <div className="d-flex align-items-center bg-white shadow-lg rounded-3 p-3 border position-relative overflow-hidden" style={{ minWidth: '320px' }}>
              <motion.div 
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3.5, ease: "linear" }}
                className={`position-absolute bottom-0 start-0 ${statusPopup === 'login' ? 'bg-success' : 'bg-danger'}`}
                style={{ height: '4px' }} 
              />
              <div className="me-3">
                {statusPopup === 'login' 
                  ? <CheckCircle2 size={24} className="text-success" /> 
                  : <AlertCircle size={24} className="text-danger" />}
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold fs-6 text-dark">
                  {statusPopup === 'login' ? `Welcome, ${userData?.name}` : 'Logged out'}
                </div>
                <div className="text-muted small">
                  {statusPopup === 'login' ? 'Opening your workspace...' : 'See you next time.'}
                </div>
              </div>
              <Loader2 className={`animate-spin ms-3 ${statusPopup === 'login' ? 'text-success' : 'text-danger'}`} size={18} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold fs-5 d-flex align-items-center gap-2">
             <div className="p-2 rounded bg-gradient-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                <Cpu size={20} />
             </div>
             <span className="text-dark">SmartInterview</span>
          </span>

          <div className="d-flex align-items-center">
            {userData ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 pe-3 border-end">
                  <div className="text-end d-none d-md-block">
                    <div className="fw-bold text-dark small">{userData.name}</div>
                  </div>
                  <UserCircle2 size={32} className="text-secondary" />
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button onClick={handleGoogleAuth} className="btn btn-primary bg-gradient-primary border-0 rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm btn-hover-lift">
                {isSigningIn ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                Sign In With Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-5 hero-bg border-bottom">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-start">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="badge badge-soft-indigo px-3 py-2 rounded-pill fw-bold mb-4 border border-indigo-subtle">
                  <Sparkles size={14} className="me-2 mb-1" /> Powered by AI
                </span>
                <h3 className="display-5 fw-bold text-dark mb-4" style={{ letterSpacing: "-1px" }}>
                  Practice Interviews <br /><span className="text-gradient">The Smart Way.</span>
                </h3>
                <p className="lead text-secondary mb-5 fs-5">
                  Answer real interview questions, get instant feedback, and build the confidence you need to land the job.
                </p>
                <button onClick={userData ? onGetStarted : handleGoogleAuth} className="btn btn-dark modern-dark-btn btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-inline-flex align-items-center btn-hover-lift">
                   {userData ? "Open Workspace" : "Get Started Now"} <ChevronRight size={20} className="ms-2" />
                </button>
              </motion.div>
            </div>
            
            <div className="col-lg-6">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                 <div className="card border-0 modern-terminal-shadow rounded-4 overflow-hidden p-4" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                       <Terminal size={18} className="text-emerald" />
                       <span className="small font-monospace" style={{ color: '#94a3b8' }}>smart_interview_console</span>
                    </div>
                    <div className="font-monospace">
                      <p className="text-indigo mb-1">&gt; Topic: System Design</p>
                      <p className="mb-4">Load Balancing & Scaling</p>
                      <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span className="text-warning fw-bold">AI Agent:</span> "Good answer! Now, how would you handle traffic across multiple regions?"
                      </div>
                      <p className="text-emerald mb-0 fw-bold">&gt; Score: 89% Clarity</p>
                    </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* --- METHODOLOGY --- */}
      <section className="py-5 bg-white">
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="display-6 fw-bold text-dark mb-3">How It Works</h2>
                <p className="text-muted lead">Simple steps to help you prepare better.</p>
            </div>
            <div className="row g-4 text-center">
                <div className="col-md-4">
                    <div className="card h-100 border border-light shadow-sm p-4 rounded-4 hover-lift bg-white">
                        <div className="card-body">
                          <div className="mb-4 d-inline-flex p-3 rounded-4 icon-box-indigo">
                            <Target size={32} />
                          </div>
                          <h4 className="fw-bold fs-5 mb-3">Problem Solving</h4>
                          <p className="text-muted mb-0">We check how well you solve coding problems and handle tricky edge cases.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border border-light shadow-sm p-4 rounded-4 hover-lift bg-white">
                        <div className="card-body">
                          <div className="mb-4 d-inline-flex p-3 rounded-4 icon-box-emerald">
                            <MessagesSquare size={32} />
                          </div>
                          <h4 className="fw-bold fs-5 mb-3">Communication</h4>
                          <p className="text-muted mb-0">We look at how clearly and confidently you explain your technical answers.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border border-light shadow-sm p-4 rounded-4 hover-lift bg-white">
                        <div className="card-body">
                          <div className="mb-4 d-inline-flex p-3 rounded-4 icon-box-fuchsia">
                            <BarChart4 size={32} />
                          </div>
                          <h4 className="fw-bold fs-5 mb-3">Your Progress</h4>
                          <p className="text-muted mb-0">After each session, get a simple report showing your strengths and what to improve.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- TECHNICAL TRACKS --- */}
      <section className="py-5 hero-bg border-top">
        <div className="container py-5">
            <div className="row align-items-center g-5">
                <div className="col-lg-5">
                    <h2 className="display-6 fw-bold mb-4">What You'll Practice</h2>
                    <p className="text-secondary mb-5 lead">Questions are based on real interview topics used by top technology companies.</p>
                    <div className="d-grid gap-3 text-start">
                        {['System Design', 'Frontend Skills', 'Data Structures & Algorithms', 'Behavioral Scenarios'].map((item, i) => (
                            <div key={i} className="d-flex align-items-center gap-3 fw-semibold border-bottom border-light-subtle pb-3 fs-5 text-dark">
                                <CheckCircle2 size={24} className="text-emerald" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="row g-4">
                        {[
                            { icon: <Code2 size={24}/>, title: "Backend Scenarios", count: "400+ Scenarios" },
                            { icon: <Globe size={24}/>, title: "Cloud & Infra", count: "250+ Scenarios" },
                            { icon: <ShieldCheck size={24}/>, title: "Security Basics", count: "120+ Scenarios" },
                            { icon: <Zap size={24}/>, title: "Real-time Systems", count: "180+ Scenarios" }
                        ].map((box, i) => (
                            <div className="col-sm-6" key={i}>
                                <div className="p-4 bg-white rounded-4 border border-light shadow-sm d-flex align-items-start gap-3 h-100 hover-lift">
                                    <div className="text-indigo">{box.icon}</div>
                                    <div>
                                        <h6 className="fw-bold mb-1 fs-5 text-dark">{box.title}</h6>
                                        <span className="text-muted small">{box.count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      <footer className="py-4 text-center text-muted bg-white mt-auto border-top">
        <div className="container">
          <small>© {new Date().getFullYear()} SmartInterview • Practice Smarter, Interview Better</small>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* Modern Color Variables */
        :root {
          --indigo-600: #4f46e5;
          --fuchsia-500: #d946ef;
          --emerald-500: #10b981;
          --slate-900: #0f172a;
        }

        /* Custom Gradients & Text */
        .text-gradient {
          background: linear-gradient(135deg, var(--indigo-600) 0%, var(--fuchsia-500) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, var(--indigo-600) 0%, #7c3aed 100%);
        }
        
        /* Layout Backgrounds */
        .ui-bg-light { background-color: #f8fafc; }
        .hero-bg {
          background: linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%);
        }

        /* Modern Accent Colors */
        .badge-soft-indigo { background-color: #e0e7ff; color: var(--indigo-600); }
        .border-indigo-subtle { border-color: #c7d2fe !important; }
        
        .icon-box-indigo { background-color: #e0e7ff; color: var(--indigo-600); }
        .icon-box-emerald { background-color: #d1fae5; color: var(--emerald-500); }
        .icon-box-fuchsia { background-color: #fae8ff; color: var(--fuchsia-500); }
        
        .text-indigo { color: #818cf8; }
        .text-emerald { color: #34d399; }

        /* Button & Card Enhancements */
        .modern-dark-btn {
          background-color: var(--slate-900);
          border: none;
        }
        .modern-terminal-shadow {
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.5);
        }
        
        /* Animations */
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .hover-lift, .btn-hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover, .btn-hover-lift:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 1rem 3rem rgba(0,0,0,.08)!important; 
        }
      `}</style>
    </div>
  );
}