import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, LogIn, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackgroundVideo from "components/BackgroundVideo/BackgroundVideo.js";

const highlights = [
  { icon: BookOpen, title: "Read", text: "Clear lessons shaped for steady practice." },
  { icon: Brain, title: "Practice", text: "Speech and quiz tools that keep learning active." },
  { icon: Sparkles, title: "Grow", text: "Friendly progress moments after every activity." },
];

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  return (
    <div className="home-shell">
      <BackgroundVideo />
      <motion.main
        className="home-content"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <section className="home-hero-card">
          <motion.div
            className="home-badge"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <Sparkles size={18} />
            Dyslexia-friendly learning
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5 }}
          >
            DyslexiLearn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            A warmer learning space for reading, pronunciation, quizzes, and confidence.
          </motion.p>
          <motion.button
            className="home-login-button"
            onClick={handleLoginClick}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogIn size={20} />
            Login
          </motion.button>
        </section>

        <section className="home-feature-grid" aria-label="Learning highlights">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                className="home-mini-card"
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 + index * 0.1, duration: 0.45 }}
                whileHover={{ y: -8, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }}
              >
                <span className="home-mini-icon">
                  <Icon size={24} />
                </span>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </motion.article>
            );
          })}
        </section>
      </motion.main>
    </div>
  );
};

export default Home;
