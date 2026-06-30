import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Mic, MicOff, RefreshCw, Star } from "lucide-react";
import { Button } from "reactstrap";

const WORDS = ["Elephant", "Butterfly", "Dinosaur", "Strawberry", "Sunshine"];

const PronunciationFeature = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const word = WORDS[currentWordIndex];

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        const target = word.toLowerCase().trim();
        
        // Remove trailing punctuation
        const cleanTranscript = transcript.replace(/[.,!?]$/, "");

        if (cleanTranscript === target) {
          setFeedback("Perfect! 🌟");
          setIsSuccess(true);
        } else {
          setFeedback(`You said "${cleanTranscript}". Try again!`);
          setIsSuccess(false);
        }
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'no-speech') {
          setFeedback("I didn't hear anything. Please try speaking louder!");
        } else if (event.error === 'not-allowed') {
          setFeedback("Microphone access was denied. Please allow it in your browser.");
        } else if (event.error === 'network') {
          setFeedback("Network error. Speech recognition requires an internet connection in Chrome.");
        } else {
          setFeedback(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    } else {
      setFeedback("Speech recognition is not supported in this browser.");
    }
  }, [word]);

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8; // Slower for kids
      utterance.pitch = 1.1; // Slightly higher pitch
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setFeedback("");
      setIsSuccess(false);
      recognition.start();
      setIsListening(true);
    }
  };

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % WORDS.length);
    setFeedback("");
    setIsSuccess(false);
  };

  return (
    <div style={{ padding: "2rem", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem", color: "#32325d", fontWeight: "800", textAlign: "center" }}>
        🗣️ Pronunciation Practice
      </h2>

      <motion.div 
        key={word}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ marginBottom: "4rem" }}
      >
        <h1 
          style={{ 
            fontSize: "4rem",
            color: "#5e72e4",
            fontWeight: "900", 
            textShadow: "0px 4px 15px rgba(0,0,0,0.1)",
            letterSpacing: "4px",
            textAlign: "center"
          }}
        >
          {word}
        </h1>
      </motion.div>

      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              className="btn-icon btn-3 rounded-circle shadow-lg" 
              color="primary" 
              type="button"
              style={{ width: "80px", height: "80px" }}
              onClick={handleSpeak}
            >
              <Volume2 size={36} />
            </Button>
          </motion.div>
          <div style={{ color: "#32325d", marginTop: "10px", fontWeight: "bold" }}>Listen</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            animate={isListening ? { scale: [1, 1.1, 1] } : {}}
            transition={isListening ? { repeat: Infinity, duration: 1 } : {}}
          >
            <Button 
              className="btn-icon btn-3 rounded-circle shadow-lg" 
              color={isListening ? "danger" : "success"} 
              type="button"
              style={{ width: "80px", height: "80px" }}
              onClick={toggleListen}
            >
              {isListening ? <MicOff size={36} /> : <Mic size={36} />}
            </Button>
          </motion.div>
          <div style={{ color: "#32325d", marginTop: "10px", fontWeight: "bold" }}>
            {isListening ? "Listening..." : "Speak"}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              className="btn-icon btn-3 rounded-circle shadow-lg" 
              color="warning" 
              type="button"
              style={{ width: "80px", height: "80px" }}
              onClick={nextWord}
            >
              <RefreshCw size={36} />
            </Button>
          </motion.div>
          <div style={{ color: "#32325d", marginTop: "10px", fontWeight: "bold" }}>Next</div>
        </div>
      </div>

      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            marginTop: "1rem", 
            padding: "15px 30px", 
            borderRadius: "30px",
            color: "white",
            backgroundColor: isSuccess ? "#2dce89" : "#f5365c",
            display: "inline-flex", 
            alignItems: "center",
            fontSize: "1.2rem", 
            fontWeight: "bold", 
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)" 
          }}
        >
          {isSuccess && <Star className="me-2" size={24} />}
          {feedback}
          {isSuccess && <Star className="ms-2" size={24} />}
        </motion.div>
      )}
    </div>
  );
};

export default PronunciationFeature;
