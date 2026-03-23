
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function RoleSelection({ onSelectRole }) {
//   const navigate = useNavigate();

//   const roles = [
//     {
//       id: "frontend",
//       name: "Frontend Developer",
//       icon: "💻",
//       description: "React, Angular, Vue.js, HTML, CSS, JavaScript",
//       gradientStart: "#2196F3",
//       gradientEnd: "#00BCD4",
//     },
//     {
//       id: "backend",
//       name: "Backend Developer",
//       icon: "⚙️",
//       description: "Node.js, Python, Java, Databases, APIs",
//       gradientStart: "#9C27B0",
//       gradientEnd: "#E91E63",
//     },
//     {
//       id: "datascience",
//       name: "Data Science",
//       icon: "📊",
//       description: "Python, R, Statistics, Machine Learning",
//       gradientStart: "#4CAF50",
//       gradientEnd: "#8BC34A",
//     },
//     {
//       id: "aiml",
//       name: "AI/ML Engineer",
//       icon: "🤖",
//       description: "TensorFlow, PyTorch, Neural Networks, Deep Learning",
//       gradientStart: "#FF9800",
//       gradientEnd: "#F44336",
//     },

//     // ⭐ NEW ROLE 1 — DevOps
//     {
//       id: "devops",
//       name: "DevOps Engineer",
//       icon: "🛠️",
//       description: "CI/CD, Docker, Kubernetes, AWS, Terraform",
//       gradientStart: "#673AB7",
//       gradientEnd: "#3F51B5",
//     },

//     // ⭐ NEW ROLE 2 — Cybersecurity
//     {
//       id: "cybersecurity",
//       name: "Cybersecurity Specialist",
//       icon: "🛡️",
//       description: "Network Security, Pentesting, Cryptography, SIEM",
//       gradientStart: "#FF5722",
//       gradientEnd: "#795548",
//     },
//   ];

//   const handleRoleClick = (roleId) => {
//     if (onSelectRole) onSelectRole(roleId);
//     navigate("/questions");
//   };

//   return (
//     <div
//       className="min-vh-100 d-flex flex-column"
//       style={{
//         background: "linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #f8f9fa 100%)",
//         animation: "gradientMove 8s ease infinite alternate",
//         backgroundSize: "200% 200%",
//       }}
//     >
//       {/* Header */}
//       <header
//         className="bg-white shadow-sm"
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 1000,
//           backdropFilter: "blur(6px)",
//         }}
//       >
//         <div className="container py-3 text-center">
//          <h4
//           className="fw-bold mb-0 role-heading"
//           style={{ 
//           letterSpacing: "1px",
//           transition: "0.3s ease",
//          color: "black"
//     }}
//       >
//       Select Your Role to Begin
//      </h4>

//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container flex-grow-1 py-5">
//         <div className="row g-4 justify-content-center">
//           {roles.map((role, index) => (
//             <div
//               key={role.id}
//               className="col-12 col-sm-6 col-lg-5"
//               style={{
//                 animation: `fadeInUp 0.8s ease ${index * 0.15}s both`,
//               }}
//             >
//               <div
//                 className="card h-100 border-0 shadow-lg"
//                 style={{
//                   cursor: "pointer",
//                   borderRadius: "1rem",
//                   transition: "all 0.4s ease",
//                   background: "#ffffffaa",
//                   backdropFilter: "blur(4px)",
//                 }}
//                 onClick={() => handleRoleClick(role.id)}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
//                   e.currentTarget.style.boxShadow =
//                     "0 15px 30px rgba(0,0,0,0.2)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0) scale(1)";
//                   e.currentTarget.style.boxShadow =
//                     "0 6px 12px rgba(0,0,0,0.1)";
//                 }}
//               >
//                 <div className="card-body text-center py-5">
//                   <div
//                     className="d-inline-flex align-items-center justify-content-center mb-4"
//                     style={{
//                       width: "80px",
//                       height: "80px",
//                       borderRadius: "50%",
//                       background: `linear-gradient(135deg, ${role.gradientStart}, ${role.gradientEnd})`,
//                       color: "white",
//                       fontSize: "2.2rem",
//                       boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                     }}
//                   >
//                     {role.icon}
//                   </div>
//                   <h5 className="fw-bold text-dark mb-2">{role.name}</h5>
//                   <p className="text-muted mb-3">{role.description}</p>
//                   <button
//                     className="btn btn-primary px-4"
//                     style={{
//                       borderRadius: "25px",
//                       transition: "0.3s",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.boxShadow =
//                         "0 0 15px rgba(13, 110, 253, 0.6)")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.boxShadow = "none")
//                     }
//                     onClick={() => handleRoleClick(role.id)}
//                   >
//                     Start Practice →
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       <footer className="text-center py-4 text-muted small">
//         © {new Date().getFullYear()} <strong>SmartInterview</strong> — Choose.
//         Practice. Succeed. 💼
//       </footer>

//       {/* Animations */}
//       <style>
//         {`
//           @keyframes fadeInUp {
//             from {
//               opacity: 0;
//               transform: translateY(40px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           @keyframes gradientMove {
//             0% {
//               background-position: 0% 50%;
//             }
//             100% {
//               background-position: 100% 50%;
//             }
//           }

//           /* Heading hover effect */
//           .role-heading:hover {
//             color: #0d6efd;
//             text-shadow: 0 0 10px rgba(13,110,253,0.7);
//             transform: scale(1.05);
//           }
//         `}
//       </style>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Code2, Settings, BarChart3, Cpu, ShieldCheck, 
  Terminal, ArrowRight, Sparkles, LayoutGrid, CheckCircle2
} from "lucide-react";

export default function RoleSelection({ onSelectRole }) {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const roles = [
    { id: "frontend", name: "Frontend Developer", icon: <Code2 />, desc: "React architecture, CSS-in-JS, and client-side performance logic.", skills: ["React", "TypeScript", "Performance"] },
    { id: "backend", name: "Backend Developer", icon: <Settings />, desc: "Scalable system design, database optimization, and API security.", skills: ["Node.js", "PostgreSQL", "System Design"] },
    { id: "datascience", name: "Data Science", icon: <BarChart3 />, desc: "Advanced statistical modeling, predictive analytics, and ML pipelines.", skills: ["Python", "Pandas", "Statistics"] },
    { id: "aiml", name: "AI/ML Engineer", icon: <Cpu />, desc: "Neural networks, NLP models, and computer vision implementation.", skills: ["PyTorch", "NLP", "Optimization"] },
    { id: "devops", name: "DevOps Engineer", icon: <Terminal />, desc: "CI/CD automation, cloud infrastructure, and container orchestration.", skills: ["Docker", "AWS", "Terraform"] },
    { id: "cybersecurity", name: "Cybersecurity", icon: <ShieldCheck />, desc: "Threat detection, penetration testing, and security compliance.", skills: ["Network Sec", "Pentesting", "IAM"] },
  ];

  const handleRoleConfirm = (roleId) => {
    if (onSelectRole) onSelectRole(roleId);
    navigate("/questions");
  };

  return (
    <div className="min-vh-100 bg-white d-flex flex-column" style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a" }}>
      
      {/* --- HEADER --- */}
      <header className="border-bottom py-3 bg-white sticky-top z-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary rounded-2 p-1 text-white shadow-sm">
              <LayoutGrid size={20} />
            </div>
            <span className="fw-black fs-5 tracking-tight">SmartInterview</span>
          </div>
          <div className="small text-muted fw-semibold px-3 py-1 bg-light rounded-pill border">
            Career Assessment v2.0
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container flex-grow-1 py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* Title Section */}
            <div className="mb-5">
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="fw-black tracking-tighter display-6 mb-2">Initialize your assessment.</h2>
                  <p className="text-secondary">Select the professional track you wish to simulate today.</p>
               </motion.div>
            </div>

            <div className="row g-5">
              {/* LEFT: Role List */}
              <div className="col-md-5">
                <div className="d-grid gap-2">
                  {roles.map((role) => (
                    <motion.div
                      key={role.id}
                      onMouseEnter={() => setHoveredRole(role)}
                      onClick={() => setSelectedRole(role)}
                      className={`role-item p-3 rounded-4 border d-flex align-items-center gap-3 transition-3 ${
                        selectedRole?.id === role.id ? "selected-role shadow-sm" : ""
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`p-2 rounded-3 border transition-3 ${
                        selectedRole?.id === role.id ? "bg-primary text-white border-primary" : "bg-light text-secondary"
                      }`}>
                        {React.cloneElement(role.icon, { size: 20 })}
                      </div>
                      <span className="fw-bold small">{role.name}</span>
                      {selectedRole?.id === role.id && (
                        <CheckCircle2 size={16} className="ms-auto text-primary" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Dynamic Preview Panel */}
              <div className="col-md-7">
                <AnimatePresence mode="wait">
                  {(selectedRole || hoveredRole) ? (
                    <motion.div
                      key={(selectedRole || hoveredRole).id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="h-100 p-5 rounded-5 border bg-white d-flex flex-column justify-content-between position-relative overflow-hidden"
                    >
                      {/* Background Glimmer */}
                      <div className="position-absolute top-0 end-0 p-5 opacity-10">
                        {React.cloneElement((selectedRole || hoveredRole).icon, { size: 120 })}
                      </div>

                      <div className="position-relative z-1">
                        <div className="d-inline-flex align-items-center gap-2 px-2 py-1 bg-primary bg-opacity-10 text-primary rounded small fw-bold mb-3">
                           <Sparkles size={14} /> Professional Track
                        </div>
                        <h3 className="fw-black mb-3">{(selectedRole || hoveredRole).name}</h3>
                        <p className="text-secondary mb-4 leading-relaxed">
                          {(selectedRole || hoveredRole).desc}
                        </p>
                        
                        <div className="d-flex flex-wrap gap-2 mb-4">
                           {(selectedRole || hoveredRole).skills.map(skill => (
                             <span key={skill} className="badge bg-light text-dark border px-3 py-2 rounded-pill font-monospace small">
                                {skill}
                             </span>
                           ))}
                        </div>
                      </div>

                      <div className="mt-auto position-relative z-1">
                        <button 
                          onClick={() => handleRoleConfirm((selectedRole || hoveredRole).id)}
                          className="btn btn-primary btn-lg rounded-pill w-100 py-3 fw-black d-flex align-items-center justify-content-center gap-2 shadow"
                        >
                          Start Assessment Track <ArrowRight size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center border rounded-5 border-dashed p-5 text-center text-muted">
                        <div className="mb-3 opacity-20"><LayoutGrid size={48} /></div>
                        <p className="small fw-bold">Select a track from the left to view assessment details.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-top py-4 bg-white text-center mt-auto">
        <span className="small text-muted fw-medium">© 2026 SmartInterview Professional • High-Fidelity Simulations</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        
        .fw-black { font-weight: 900 !important; }
        .tracking-tighter { letter-spacing: -0.04em; }
        .transition-3 { transition: all 0.25s ease; }
        .border-dashed { border: 2px dashed #e2e8f0; }

        .role-item {
          background: #ffffff;
          border-color: #f1f5f9;
        }

        .role-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateX(5px);
        }

        .selected-role {
          background: #f1f5f9 !important;
          border-color: #6366f1 !important;
        }

        .role-item:active {
          transform: scale(0.98);
        }

        .shadow {
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3) !important;
        }
      `}</style>
    </div>
  );
}