import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Database, LineChart, Brain, 
  Server, ShieldCheck, ChevronRight, CheckCircle2, LayoutTemplate 
} from "lucide-react";

const roles = [
  { id: "frontend", title: "Frontend Developer", desc: "React, DOM, CSS, JavaScript", icon: <Code2 size={24} /> },
  { id: "backend", title: "Backend Developer", desc: "Node.js, Express, MongoDB, SQL", icon: <Database size={24} /> },
  { id: "datascience", title: "Data Scientist", desc: "Machine Learning, Pandas, Stats", icon: <LineChart size={24} /> },
  { id: "aiml", title: "AI/ML Engineer", desc: "Neural Networks, NLP, PyTorch", icon: <Brain size={24} /> },
  { id: "devops", title: "DevOps Engineer", desc: "Docker, Kubernetes, CI/CD", icon: <Server size={24} /> },
  { id: "cybersecurity", title: "Cybersecurity Analyst", desc: "Encryption, Pentesting, Networks", icon: <ShieldCheck size={24} /> }
];

export default function RoleSelection({ onSelectRole }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleStartInterview = () => {
    if (selectedRole) {
      // Save locally as a fallback
      localStorage.setItem("selected_interview_role", selectedRole);
      
      // Call the function passed from App.jsx to load questions and navigate
      if (onSelectRole) {
        onSelectRole(selectedRole);
      } else {
        navigate("/questions"); // Fallback if prop is missing
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column ui-bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- HEADER --- */}
      <header className="border-bottom py-3 sticky-top bg-white shadow-sm z-2">
        <div className="container d-flex align-items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-3 text-white d-inline-flex align-items-center justify-content-center shadow-sm">
            <LayoutTemplate size={22} />
          </div>
          <span className="fw-bolder text-dark fs-5 tracking-tight">SmartInterview</span>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container flex-grow-1 py-5">
        <div className="mx-auto" style={{ maxWidth: "900px" }}>
          
          <div className="text-center mb-5 pb-2">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
              className="display-5 fw-black text-dark mb-3 tracking-tighter"
            >
              Choose Your <span className="text-indigo">Target Role</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="lead text-secondary mx-auto" style={{ maxWidth: "600px" }}
            >
              Select your specific engineering path. Our AI agent will dynamically tailor your technical assessment to match this role.
            </motion.p>
          </div>

          <div className="row g-4 mb-5">
            {roles.map((role, index) => {
              const isSelected = selectedRole === role.id;
              
              return (
                <div className="col-12 col-md-6" key={role.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedRole(role.id)}
                    className={`card h-100 border-2 rounded-4 p-3 p-lg-4 cursor-pointer transition-all role-card ${isSelected ? 'border-indigo bg-indigo-soft shadow-sm' : 'border-light bg-white hover-lift'}`}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3 gap-lg-4">
                      
                      {/* Left Icon - fixed width/height prevents squishing */}
                      <div 
                        className={`rounded-4 d-inline-flex align-items-center justify-content-center flex-shrink-0 transition-all ${isSelected ? 'bg-gradient-primary text-white shadow' : 'bg-light text-secondary'}`}
                        style={{ width: '60px', height: '60px' }}
                      >
                        {role.icon}
                      </div>
                      
                      {/* Text Content - Flex-grow allows text to wrap safely */}
                      <div className="flex-grow-1 text-wrap">
                        <h4 className={`fw-bold mb-1 fs-5 transition-all ${isSelected ? 'text-indigo' : 'text-dark'}`}>
                          {role.title}
                        </h4>
                        <p className="text-muted small mb-0 lh-sm">{role.desc}</p>
                      </div>

                      {/* Right Checkmark */}
                      <div className="flex-shrink-0">
                        <div 
                          className={`rounded-circle border-2 d-inline-flex align-items-center justify-content-center transition-all ${isSelected ? 'bg-indigo border-indigo text-white scale-in' : 'border-light text-transparent'}`} 
                          style={{ width: '28px', height: '28px' }}
                        >
                           <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* --- BOTTOM ACTION BAR --- */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center pt-4 border-top"
          >
            <button 
              onClick={handleStartInterview}
              disabled={!selectedRole}
              className={`btn rounded-pill px-5 py-3 fw-bold shadow-lg d-inline-flex align-items-center justify-content-center gap-2 transition-all ${selectedRole ? 'bg-gradient-primary text-white btn-hover-lift' : 'btn-light text-muted'}`}
              style={{ border: "none", minWidth: "280px" }}
            >
              <span>{selectedRole ? "Begin Assessment" : "Select a role to begin"}</span> 
              <ChevronRight size={20} className={selectedRole ? "opacity-100" : "opacity-50"} />
            </button>
          </motion.div>

        </div>
      </main>

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

        .text-indigo { color: var(--indigo-600) !important; }
        .bg-indigo { background-color: var(--indigo-600) !important; }
        .border-indigo { border-color: var(--indigo-600) !important; }
        .bg-indigo-soft { background-color: rgba(79, 70, 229, 0.04) !important; }
        
        .bg-gradient-primary { background: linear-gradient(135deg, var(--indigo-600) 0%, #7c3aed 100%); }
        .text-transparent { color: transparent; }

        .transition-all { transition: all 0.25s ease; }
        
        .hover-lift:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 10px 25px rgba(0,0,0,.05)!important; 
          border-color: #e2e8f0 !important;
        }
        
        .btn-hover-lift:hover:not(:disabled) { 
          transform: translateY(-3px); 
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.25)!important; 
        }

        .scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}