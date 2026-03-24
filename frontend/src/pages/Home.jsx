// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { motion, AnimatePresence } from "framer-motion"; 
// import { 
//   LogIn, LogOut, CheckCircle2, Cpu, AlertCircle, Loader2, 
//   Code2, MessagesSquare, BarChart4, ShieldCheck, ChevronRight,
//   UserCircle2, Sparkles, Terminal, Globe, Zap, Target
// } from "lucide-react";
// import { signInWithGoogle } from "../firebaseConfig"; 

// export default function Home({ onGetStarted }) {
//   const [isSigningIn, setIsSigningIn] = useState(false);
//   const [userData, setUserData] = useState(null); 
//   const [statusPopup, setStatusPopup] = useState(null); 

//   useEffect(() => {
//     const savedUser = localStorage.getItem("smart_interview_user");
//     if (savedUser) setUserData(JSON.parse(savedUser));
//   }, []);

//   const handleGoogleAuth = async () => {
//     if (isSigningIn) return;
//     setIsSigningIn(true);

//     try {
//       const { user, idToken } = await signInWithGoogle();
//       const backendResponse = await fetch("http://localhost:5000/api/auth/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ idToken }),
//       });

//       if (!backendResponse.ok) throw new Error("Auth failed");
//       const data = await backendResponse.json();
      
//       setUserData(data.user);
//       localStorage.setItem("smart_interview_user", JSON.stringify(data.user));

//       setStatusPopup('login');
//       setTimeout(() => {
//         setStatusPopup(null);
//         onGetStarted();
//       }, 3000);

//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsSigningIn(false);
//     }
//   };

//   const handleLogout = () => {
//     setStatusPopup('logout');
//     setTimeout(() => {
//       localStorage.removeItem("smart_interview_user");
//       setUserData(null);
//       setStatusPopup(null);
//     }, 3000);
//   };

//   return (
//     <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#fcfcfd", fontFamily: "'Inter', sans-serif" }}>
      
//       {/* --- PERFECTLY CENTERED STATUS POPUPS --- */}
//       <AnimatePresence>
//         {statusPopup && (
//           <div 
//             className="position-fixed top-0 start-0 vh-100 vw-100 d-flex align-items-center justify-content-center" 
//             style={{ 
//               zIndex: 9999, 
//               background: "rgba(15, 23, 42, 0.9)", 
//               backdropFilter: "blur(12px)" 
//             }}
//           >
//             <motion.div 
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white rounded-5 shadow-2xl text-center border-0 overflow-hidden position-relative"
//               style={{ maxWidth: "550px", width: "95%", padding: "80px 40px" }}
//             >
//               {/* Progress Line (Green for Login, Red for Logout) */}
//               <motion.div 
//                 initial={{ width: 0 }} 
//                 animate={{ width: "100%" }} 
//                 transition={{ duration: 3, ease: "linear" }}
//                 style={{ 
//                   height: '8px', position: 'absolute', top: 0, left: 0, 
//                   backgroundColor: statusPopup === 'login' ? '#10b981' : '#ef4444' 
//                 }} 
//               />

//               <div className={`mb-4 d-inline-flex p-4 rounded-circle ${statusPopup === 'login' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
//                 {statusPopup === 'login' ? <CheckCircle2 size={80} /> : <AlertCircle size={80} />}
//               </div>
              
//               <h1 className="display-5 fw-black text-dark mb-2">
//                 {statusPopup === 'login' ? 'Welcome Back' : 'Logging Out'}
//               </h1>
//               <p className="fs-3 text-secondary mb-0 fw-medium">
//                 {statusPopup === 'login' ? userData?.name : 'Securing your session...'}
//               </p>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* --- PREMIUM NAVBAR --- */}
//       <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top shadow-sm">
//         <div className="container">
//           <span className="navbar-brand fw-black fs-3 d-flex align-items-center gap-2">
//            {/* <div className="p-1 rounded-3 bg-primary text-white"></div> */}
//           </span>

//           <div className="d-flex align-items-center gap-4">
//             {userData ? (
//               <div className="d-flex align-items-center gap-4">
//                 <div className="d-flex align-items-center gap-3 pe-3 border-end">
//                   <div className="text-end d-none d-md-block">
//                     <div className="text-uppercase fw-black text-primary small" style={{ letterSpacing: '1px', fontSize: '10px' }}>Professional Account</div>
//                     <div className="fw-black text-dark fs-4">{userData.name}</div>
//                   </div>
//                   <UserCircle2 size={48} className="text-primary opacity-75" />
//                 </div>
//                 <button onClick={handleLogout} className="btn btn-danger btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
//                   <LogOut size={20} /> Logout
//                 </button>
//               </div>
//             ) : (
//               <button onClick={handleGoogleAuth} className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow-lg d-flex align-items-center gap-2">
//                 {isSigningIn ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
//                 Sign In With Google
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <header className="py-5 bg-gradient-light border-bottom">
//         <div className="container py-lg-5">
//           <div className="row align-items-center g-5">
//             <div className="col-lg-7 text-start">
//               <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
//                 <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-bold mb-4">
//                   <Sparkles size={16} className="me-2" /> Powered by Gemini Pro 1.5
//                 </span>
//                 <h1 className="display-2 fw-black text-dark mb-4 tracking-tighter" style={{ lineHeight: 1 }}>
//                   The AI Suite for <br /><span className="text-primary">Mastering Interviews.</span>
//                 </h1>
//                 <p className="lead fs-4 text-secondary mb-5">
//                   The industry-standard simulator for engineers. Bridge the gap between technical knowledge and high-pressure professional delivery.
//                 </p>
//                 <button onClick={userData ? onGetStarted : handleGoogleAuth} className="btn btn-dark btn-lg rounded-pill px-5 py-4 fw-bold shadow-2xl fs-5">
//                    {userData ? "Open Workspace" : "Get Started Now"} <ChevronRight size={24} className="ms-2" />
//                 </button>
//               </motion.div>
//             </div>
//             <div className="col-lg-5">
//                <div className="card border-0 shadow-2xl rounded-5 overflow-hidden bg-dark text-white p-4 hero-float">
//                   <div className="d-flex align-items-center gap-2 mb-4">
//                      <Terminal size={20} className="text-success" />
//                      <span className="small font-monospace opacity-50">smart_interview_console_v2</span>
//                   </div>
//                   <div className="font-monospace">
//                     <p className="text-primary">&gt; Analysis: System Design Round</p>
//                     <p className="small opacity-75">Topic: Load Balancing & Scaling</p>
//                     <div className="p-3 bg-white bg-opacity-10 rounded-4 my-3 border border-secondary">
//                         <span className="text-warning fw-bold">AI Agent:</span> "Great start. Now, how would you handle session stickiness in a multi-region deployment?"
//                     </div>
//                     <p className="text-success">&gt; Evaluating Answer... [89% Clarity]</p>
//                   </div>
//                </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* --- METHODOLOGY / PILLARS SECTION --- */}
//       <section className="py-5 bg-light bg-opacity-50">
//         <div className="container py-5">
//             <div className="text-center mb-5">
//                 <h2 className="display-4 fw-black">Rigorous Methodology.</h2>
//                 <p className="text-muted lead">Why top-tier candidates trust our evaluation engine.</p>
//             </div>
//             <div className="row g-4 text-center">
//                 <div className="col-md-4">
//                     <div className="p-5 bg-white rounded-5 shadow-sm h-100 border transition-all hover-card">
//                         <div className="mb-4 text-primary"><Target size={48} /></div>
//                         <h3 className="fw-black mb-3">Targeted Logic</h3>
//                         <p className="text-muted">We evaluate your ability to handle Space/Time complexity and edge-case resilience in real-time.</p>
//                     </div>
//                 </div>
//                 <div className="col-md-4">
//                     <div className="p-5 bg-white rounded-5 shadow-sm h-100 border transition-all hover-card">
//                         <div className="mb-4 text-success"><MessagesSquare size={48} /></div>
//                         <h3 className="fw-black mb-3">Soft Skills</h3>
//                         <p className="text-muted">Analyze speech confidence, clarity of thought, and your ability to explain complex abstractions.</p>
//                     </div>
//                 </div>
//                 <div className="col-md-4">
//                     <div className="p-5 bg-white rounded-5 shadow-sm h-100 border transition-all hover-card">
//                         <div className="mb-4 text-info"><BarChart4 size={48} /></div>
//                         <h3 className="fw-black mb-3">KPI Tracking</h3>
//                         <p className="text-muted">Every session generates a 12-point skill matrix report highlighting your trajectory toward senior roles.</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//       </section>

//       {/* --- TECHNICAL TRACKS SECTION --- */}
//       <section className="py-5 bg-white">
//         <div className="container py-5">
//             <div className="row align-items-center">
//                 <div className="col-lg-5 mb-5 mb-lg-0">
//                     <h2 className="display-4 fw-black mb-4">Enterprise-Grade Curriculum.</h2>
//                     <p className="text-secondary mb-4 fs-5">Our AI models are calibrated against actual interview rubrics from Fortune 500 tech firms.</p>
//                     <div className="d-grid gap-3 text-start">
//                         {['Distributed Systems Design', 'Frontend State Management', 'Data Structures & Algorithms', 'Behavioral Psychology'].map((item, i) => (
//                             <div key={i} className="d-flex align-items-center gap-3 fw-bold border-bottom pb-2">
//                                 <CheckCircle2 size={20} className="text-success" /> {item}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="col-lg-7">
//                     <div className="row g-3">
//                         {[
//                             { icon: <Code2 />, title: "Backend Systems", count: "400+ Scenarios" },
//                             { icon: <Globe />, title: "Cloud Architecture", count: "250+ Scenarios" },
//                             { icon: <ShieldCheck />, title: "Security Protocols", count: "120+ Scenarios" },
//                             { icon: <Zap />, title: "Real-time Systems", count: "180+ Scenarios" }
//                         ].map((box, i) => (
//                             <div className="col-sm-6" key={i}>
//                                 <div className="p-4 bg-light rounded-4 border d-flex align-items-start gap-3 h-100 text-start">
//                                     <div className="text-primary">{box.icon}</div>
//                                     <div>
//                                         <h6 className="fw-black mb-1">{box.title}</h6>
//                                         <small className="text-muted">{box.count}</small>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//       </section>

//       {/* --- FINAL CTA --- */}
//       <section className="py-5 mb-5">
//         <div className="container">
//             <div className="bg-primary rounded-5 p-5 text-center text-white shadow-2xl position-relative overflow-hidden">
//                 <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
//                 <h2 className="display-4 fw-black mb-4">Secure your professional future.</h2>
//                 <p className="fs-5 opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>Join the community of developers who have successfully prepared for roles at FAANG and beyond.</p>
//                 <button onClick={userData ? onGetStarted : handleGoogleAuth} className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-black text-primary shadow-lg">
//                     Initialize Assessment Round
//                 </button>
//             </div>
//         </div>
//       </section>

//       <footer className="py-4 text-center text-muted border-top bg-white mt-auto">
//         <small>© {new Date().getFullYear()} SmartInterview • High Fidelity Professional Training Environment</small>
//       </footer>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
//         .fw-black { font-weight: 900 !important; }
//         .animate-spin { animation: spin 1s linear infinite; }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         .shadow-2xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3); }
//         .hover-card { transition: all 0.3s ease; }
//         .hover-card:hover { transform: translateY(-10px); background: white !important; border-color: #0d6efd !important; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
//         .hero-float { animation: float 6s ease-in-out infinite; }
//         @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0); } }
//         .bg-gradient-light { background: radial-gradient(circle at top right, #f8f9ff 0%, #fcfcfd 100%); }
//       `}</style>
//     </div>
//   );
// }











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
      const backendResponse = await fetch("https://ai-powered-smartinterview-portal-backend.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!backendResponse.ok) throw new Error("Auth failed");
      const data = await backendResponse.json();
      
      // Update data immediately so popup reads the name
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
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#fcfcfd", fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- ENHANCED TOP POPUP (CONTAINED LINE) --- */}
      <AnimatePresence>
        {statusPopup && (
          <motion.div 
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 d-flex justify-content-center" 
            style={{ zIndex: 10000, paddingTop: '30px' }}
          >
            <div 
              className="shadow-2xl rounded-5 d-flex align-items-center px-5 py-4 position-relative overflow-hidden"
              style={{ 
                minWidth: '580px',
                background: statusPopup === 'login' ? "white" : "#0f172a",
                color: statusPopup === 'login' ? "#0f172a" : "white",
                border: statusPopup === 'login' ? "1px solid #e2e8f0" : "1px solid #334155",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              {/* Progress Line - Contained inside the popup floor */}
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                transition={{ duration: 3.5, ease: "linear" }}
                style={{ 
                  height: '6px', 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  backgroundColor: statusPopup === 'login' ? '#10b981' : '#ef4444',
                  zIndex: 2
                }} 
              />

              <div className={`me-4 p-3 rounded-circle ${statusPopup === 'login' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                {statusPopup === 'login' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>

              <div className="flex-grow-1">
                <div className="fw-black small text-uppercase mb-1 opacity-50" style={{ letterSpacing: '2px', fontSize: '10px' }}>
                  {statusPopup === 'login' ? 'Identity Verified' : 'Security Protocol'}
                </div>
                <h4 className="fw-black mb-0">
                  {statusPopup === 'login' 
                    ? `Welcome Back, ${userData?.name}` 
                    : 'Securely Logged Out'}
                </h4>
                <p className="mb-0 small opacity-75">
                  {statusPopup === 'login' 
                    ? 'Loading your personalized workspace...' 
                    : 'Session terminated. All local cache cleared.'}
                </p>
              </div>

              <div className="ms-4">
                 <Loader2 className={`animate-spin ${statusPopup === 'login' ? 'text-success' : 'text-danger'}`} size={28} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM NAVBAR --- */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-black fs-3 d-flex align-items-center gap-2">
             <div className="p-1 rounded-3 bg-primary text-white"><Cpu size={30} /></div>
             SmartInterview
          </span>

          <div className="d-flex align-items-center gap-4">
            {userData ? (
              <div className="d-flex align-items-center gap-4">
                <div className="d-flex align-items-center gap-3 pe-3 border-end">
                  <div className="text-end d-none d-md-block">
                    <div className="text-uppercase fw-black text-primary small" style={{ letterSpacing: '1px', fontSize: '10px' }}>Professional Account</div>
                    <div className="fw-black text-dark fs-4">{userData.name}</div>
                  </div>
                  <UserCircle2 size={48} className="text-primary opacity-75" />
                </div>
                <button onClick={handleLogout} className="btn btn-danger btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <button onClick={handleGoogleAuth} className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow-lg d-flex align-items-center gap-2">
                {isSigningIn ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
                Sign In With Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-5 bg-gradient-light border-bottom">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-start">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-bold mb-4">
                  <Sparkles size={16} className="me-2" /> Powered by Gemini Pro 1.5
                </span>
                <h1 className="display-2 fw-black text-dark mb-4 tracking-tighter" style={{ lineHeight: 1 }}>
                  The AI Suite for <br /><span className="text-primary">Mastering Interviews.</span>
                </h1>
                <p className="lead fs-4 text-secondary mb-5">
                  The industry-standard simulator for engineers. Bridge the gap between technical knowledge and high-pressure professional delivery.
                </p>
                <button onClick={userData ? onGetStarted : handleGoogleAuth} className="btn btn-dark btn-lg rounded-pill px-5 py-4 fw-bold shadow-2xl fs-5">
                   {userData ? "Open Workspace" : "Get Started Now"} <ChevronRight size={24} className="ms-2" />
                </button>
              </motion.div>
            </div>
            <div className="col-lg-5">
               <div className="card border-0 shadow-2xl rounded-5 overflow-hidden bg-dark text-white p-4 hero-float">
                  <div className="d-flex align-items-center gap-2 mb-4">
                     <Terminal size={20} className="text-success" />
                     <span className="small font-monospace opacity-50">smart_interview_console_v2</span>
                  </div>
                  <div className="font-monospace">
                    <p className="text-primary">&gt; Analysis: System Design Round</p>
                    <p className="small opacity-75">Topic: Load Balancing & Scaling</p>
                    <div className="p-3 bg-white bg-opacity-10 rounded-4 my-3 border border-secondary">
                        <span className="text-warning fw-bold">AI Agent:</span> "Great start. Now, how would you handle session stickiness in a multi-region deployment?"
                    </div>
                    <p className="text-success">&gt; Evaluating Answer... [89% Clarity]</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- METHODOLOGY --- */}
      <section className="py-5 bg-light bg-opacity-50">
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="display-4 fw-black">Rigorous Methodology.</h2>
                <p className="text-muted lead">Why top-tier candidates trust our evaluation engine.</p>
            </div>
            <div className="row g-4 text-center">
                <div className="col-md-4">
                    <div className="p-5 bg-white rounded-5 shadow-sm h-100 border transition-all hover-card">
                        <div className="mb-4 text-primary"><Target size={48} /></div>
                        <h3 className="fw-black mb-3">Targeted Logic</h3>
                        <p className="text-muted">We evaluate your ability to handle Space/Time complexity and edge-case resilience in real-time.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-5 bg-white rounded-5 shadow-sm h-100 border transition-all hover-card">
                        <div className="mb-4 text-success"><MessagesSquare size={48} /></div>
                        <h3 className="fw-black mb-3">Soft Skills</h3>
                        <p className="text-muted">Analyze speech confidence, clarity of thought, and your ability to explain complex abstractions.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-5 bg-white rounded-5 shadow-sm h-100 border transition-all hover-card">
                        <div className="mb-4 text-info"><BarChart4 size={48} /></div>
                        <h3 className="fw-black mb-3">KPI Tracking</h3>
                        <p className="text-muted">Every session generates a 12-point skill matrix report highlighting your trajectory toward senior roles.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- TECHNICAL TRACKS --- */}
      <section className="py-5 bg-white">
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-lg-5 mb-5 mb-lg-0">
                    <h2 className="display-4 fw-black mb-4">Enterprise-Grade Curriculum.</h2>
                    <p className="text-secondary mb-4 fs-5">Our AI models are calibrated against actual interview rubrics from Fortune 500 tech firms.</p>
                    <div className="d-grid gap-3 text-start">
                        {['Distributed Systems Design', 'Frontend State Management', 'Data Structures & Algorithms', 'Behavioral Psychology'].map((item, i) => (
                            <div key={i} className="d-flex align-items-center gap-3 fw-bold border-bottom pb-2">
                                <CheckCircle2 size={20} className="text-success" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="row g-3">
                        {[
                            { icon: <Code2 />, title: "Backend Systems", count: "400+ Scenarios" },
                            { icon: <Globe />, title: "Cloud Architecture", count: "250+ Scenarios" },
                            { icon: <ShieldCheck />, title: "Security Protocols", count: "120+ Scenarios" },
                            { icon: <Zap />, title: "Real-time Systems", count: "180+ Scenarios" }
                        ].map((box, i) => (
                            <div className="col-sm-6" key={i}>
                                <div className="p-4 bg-light rounded-4 border d-flex align-items-start gap-3 h-100 text-start">
                                    <div className="text-primary">{box.icon}</div>
                                    <div>
                                        <h6 className="fw-black mb-1">{box.title}</h6>
                                        <small className="text-muted">{box.count}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      <footer className="py-4 text-center text-muted border-top bg-white mt-auto">
        <small>© {new Date().getFullYear()} SmartInterview • High Fidelity Professional Training Environment</small>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        .fw-black { font-weight: 900 !important; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-2xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3); }
        .hover-card { transition: all 0.3s ease; }
        .hover-card:hover { transform: translateY(-10px); background: white !important; border-color: #0d6efd !important; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .hero-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0); } }
        .bg-gradient-light { background: radial-gradient(circle at top right, #f8f9ff 0%, #fcfcfd 100%); }
      `}</style>
    </div>
  );
}
