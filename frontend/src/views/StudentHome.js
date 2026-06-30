import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Microscope, Trophy, User, X, Bot } from "lucide-react";

import PronunciationFeature from "../components/Features/PronunciationFeature";
import QuizFeature from "../components/Features/QuizFeature";
import LeaderboardFeature from "../components/Features/LeaderboardFeature";
import ProfileFeature from "../components/Features/ProfileFeature";
import AITutorFeature from "../components/Features/AITutorFeature";
import SettingsModal from "../components/Features/SettingsModal";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  { id: "pronunciation", title: "Pronunciation", subtitle: "Train clear sounds", icon: Mic, color: "#0694a8", gradient: "linear-gradient(135deg, rgba(6, 148, 168, 0.18), rgba(52, 211, 153, 0.16))" },
  { id: "quiz", title: "Quiz", subtitle: "Practice in small steps", icon: Microscope, color: "#e85d04", gradient: "linear-gradient(135deg, rgba(232, 93, 4, 0.18), rgba(245, 158, 11, 0.15))" },
  { id: "leaderboard", title: "Leaderboard", subtitle: "Celebrate progress", icon: Trophy, color: "#b7791f", gradient: "linear-gradient(135deg, rgba(183, 121, 31, 0.2), rgba(250, 204, 21, 0.14))" },
  { id: "profile", title: "Profile", subtitle: "Your learning space", icon: User, color: "#2f855a", gradient: "linear-gradient(135deg, rgba(47, 133, 90, 0.18), rgba(20, 184, 166, 0.14))" },
  { id: "ai_tutor", title: "AI Tutor", subtitle: "Ask me anything", icon: Bot, color: "#8965e0", gradient: "linear-gradient(135deg, rgba(137, 101, 224, 0.2), rgba(137, 101, 224, 0.1))" },
];

const StudentHome = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderFeature = () => {
    switch (activeCard) {
      case "pronunciation": return <PronunciationFeature />;
      case "quiz": return <QuizFeature />;
      case "leaderboard": return <LeaderboardFeature />;
      case "profile": return <ProfileFeature />;
      case "ai_tutor": return <AITutorFeature />;
      default: return null;
    }
  };

  return (
    <div className="student-home">
      <motion.div
        className="student-home-heading"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p>Welcome back</p>
        <h1>Choose your learning path</h1>
      </motion.div>

      <AnimatePresence>
        {!activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            transition={{ duration: 0.3 }}
            className="student-card-grid"
          >
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  layoutId={`card-container-${card.id}`}
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.42 }}
                  whileHover={{ scale: 1.04, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-panel student-feature-card"
                  style={{ background: card.gradient }}
                >
                  <span className="student-card-shine" />
                  <motion.div
                    layoutId={`card-icon-${card.id}`}
                    className="student-card-icon"
                    style={{ color: card.color }}
                  >
                    <Icon size={56} />
                  </motion.div>
                  <motion.h3 
                    layoutId={`card-title-${card.id}`} 
                  >
                    {card.title}
                  </motion.h3>
                  <p>{card.subtitle}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Feature Panel */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="student-feature-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`card-container-${activeCard}`}
              className="glass-panel student-expanded-panel"
            >
              <motion.button
                className="student-close-button"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setActiveCard(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close feature"
              >
                <X size={24} />
              </motion.button>

              <div style={{ position: "absolute", top: "1.5rem", left: "2rem", opacity: 0 }}>
                <motion.h3 layoutId={`card-title-${activeCard}`}>Title</motion.h3>
                <motion.div layoutId={`card-icon-${activeCard}`} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="student-feature-content"
              >
                {renderFeature()}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div style={{ position: "fixed", bottom: "2rem", left: "2rem", zIndex: 1000 }}>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="btn btn-light shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        >
          <Settings size={24} color="#525f7f" />
        </button>
      </div>

      <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000 }}>
        <button 
          onClick={handleLogout}
          className="btn btn-danger shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        >
          <LogOut size={24} color="#fff" />
        </button>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default StudentHome;
