// import React from "react";
// import { Link, NavLink } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav
//       className="navbar navbar-expand-lg shadow-lg"
//       style={{
//         background: "linear-gradient(135deg, #f8f9fa 0%, #d8b4fe 50%, #fbc2eb 100%)", // 💜 Added soft white tone blend
//         padding: "10px 0",
//       }}
//     >
//       <div className="container">
//         {/* Brand / Logo */}
//         <Link
//           className="navbar-brand fw-bold fs-3 text-dark"
//           to="/"
//           style={{
//             textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
//             letterSpacing: "0.5px",
//             transition: "transform 0.3s ease, text-shadow 0.3s ease",
//           }}
//           onMouseOver={(e) => {
//             e.target.style.transform = "scale(1.1)";
//             e.target.style.textShadow = "2px 3px 8px rgba(0,0,0,0.3)";
//           }}
//           onMouseOut={(e) => {
//             e.target.style.transform = "scale(1)";
//             e.target.style.textShadow = "1px 1px 2px rgba(0,0,0,0.2)";
//           }}
//         >
//          SmartInterview
//         </Link>

//         {/* Navbar Toggler */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//           style={{
//             borderColor: "rgba(0,0,0,0.2)",
//           }}
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar Links */}
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             {["/", "/roles", "/questions", "/result"].map((path, index) => {
//               const labels = ["Home", "Roles", "Q&A", "Result"];
//               return (
//                 <li key={path} className="nav-item mx-2">
//                   <NavLink
//                     to={path}
//                     end={path === "/"}
//                     className={({ isActive }) =>
//                       `nav-link ${
//                         isActive ? "fw-bold text-dark" : "text-dark opacity-75"
//                       }`
//                     }
//                     style={{
//                       borderRadius: "25px",
//                       padding: "8px 18px",
//                       fontSize: "1rem",
//                       transition: "all 0.3s ease-in-out",
//                       background: "transparent",
//                     }}
//                     onMouseOver={(e) => {
//                       e.target.style.background =
//                         "linear-gradient(135deg, #b993d6, #fbc2eb)";
//                       e.target.style.color = "#fff";
//                       e.target.style.transform = "scale(1.08)";
//                       e.target.style.boxShadow =
//                         "0 4px 12px rgba(0,0,0,0.2)";
//                     }}
//                     onMouseOut={(e) => {
//                       e.target.style.background = "transparent";
//                       e.target.style.color = "black";
//                       e.target.style.transform = "scale(1)";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   >
//                     {labels[index]}
//                   </NavLink>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }







import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, AlertCircle, Target } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [showWarning, setShowWarning] = useState(false);
  const [warningConfig, setWarningConfig] = useState({ title: "", text: "", type: "auth" });

  // Function to get fresh state from localStorage
  const getAuthStatus = () => !!localStorage.getItem("smart_interview_user");
  const getRoleStatus = () => !!localStorage.getItem("selected_interview_role");

  const triggerWarning = (title, text, type) => {
    setWarningConfig({ title, text, type });
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  const handleProtectedClick = (e, path) => {
    const isLoggedIn = getAuthStatus();
    const roleSelected = getRoleStatus();

    // 1. If user is NOT logged in: Block Roles, Session, and Result
    if (!isLoggedIn && path !== "/") {
      e.preventDefault();
      if (path === "/result") {
        triggerWarning("Interview Data Missing", "Please sign in to view your reports.", "data");
      } else {
        triggerWarning("Access Restricted", "Please sign in to start your test.", "auth");
      }
      return;
    }

    // 2. If user IS logged in, but clicks Session without selecting a role
    if (isLoggedIn && path === "/questions" && !roleSelected) {
      e.preventDefault();
      triggerWarning("Select Role", "Please choose an interview track in the Roles page first.", "role");
      return;
    }

    // 3. If everything is fine, DO NOT call e.preventDefault(). 
    // The NavLink will naturally open the page.
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg sticky-top shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #f1f5f9",
          padding: "15px 0",
          fontFamily: "'Inter', sans-serif",
          zIndex: 1000
        }}
      >
        <div className="container justify-content-end">
          <ul className="navbar-nav d-flex flex-row gap-2 align-items-center">
            {[
              { path: "/", label: "Home" },
              { path: "/roles", label: "Roles" },
              { path: "/questions", label: "Session" },
              { path: "/result", label: "Result" }
            ].map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  onClick={(e) => handleProtectedClick(e, item.path)}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-pill fw-bold small transition-all ${
                      isActive ? "text-primary bg-primary bg-opacity-10" : "text-secondary opacity-75"
                    } hover-opacity-100`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* --- DYNAMIC POPUP --- */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{ y: 20, opacity: 1, x: "-50%" }}
            exit={{ y: -100, opacity: 0, x: "-50%" }}
            className="position-fixed start-50 translate-middle-x"
            style={{ top: "80px", zIndex: 9999 }}
          >
            <div 
              className="bg-white border shadow-2xl rounded-4 p-3 d-flex align-items-center gap-3" 
              style={{ 
                minWidth: "360px", 
                borderColor: warningConfig.type === "auth" ? "#fee2e2" : "#e0e7ff" 
              }}
            >
              <div className={`p-2 rounded-circle ${
                warningConfig.type === "auth" ? "bg-danger bg-opacity-10 text-danger" : 
                warningConfig.type === "role" ? "bg-primary bg-opacity-10 text-primary" : 
                "bg-warning bg-opacity-10 text-warning"
              }`}>
                {warningConfig.type === "auth" ? <Lock size={20} /> : 
                 warningConfig.type === "role" ? <Target size={20} /> : 
                 <AlertCircle size={20} />}
              </div>
              
              <div className="flex-grow-1 text-start">
                <div className="fw-black text-dark small">{warningConfig.title}</div>
                <div className="text-muted" style={{ fontSize: "12px" }}>{warningConfig.text}</div>
              </div>

              <button onClick={() => setShowWarning(false)} className="btn btn-link p-0 text-muted">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        .fw-black { font-weight: 900 !important; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        .transition-all { transition: all 0.2s ease-in-out; }
        .nav-link { color: #64748b !important; }
        .nav-link.active { color: #0d6efd !important; }
        .hover-opacity-100:hover { opacity: 1 !important; color: #000 !important; background: rgba(0,0,0,0.03); }
      `}</style>
    </>
  );
}