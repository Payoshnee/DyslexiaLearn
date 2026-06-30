import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Button, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { Volume2, Mic, MicOff, RefreshCw, Star } from "lucide-react";

const WORDS = ["Elephant", "Butterfly", "Dinosaur", "Strawberry", "Sunshine"];

const Pronunciation = () => {
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
        setFeedback("Didn't catch that. Try again.");
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
    <Container className="pt-5 pb-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-panel shadow-lg border-0" style={{ borderRadius: "30px", overflow: "hidden" }}>
          <CardBody className="p-5 text-center">
            <h2 className="text-white mb-4" style={{ fontWeight: "800", letterSpacing: "1px" }}>
              🗣️ Pronunciation Practice
            </h2>

            <motion.div 
              key={word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="my-5"
            >
              <h1 
                className="display-1 text-white" 
                style={{ 
                  fontWeight: "900", 
                  textShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                  letterSpacing: "4px"
                }}
              >
                {word}
              </h1>
            </motion.div>

            <Row className="justify-content-center mt-5 mb-4">
              <Col xs="auto">
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
                <div className="text-white mt-2 font-weight-bold">Listen</div>
              </Col>
              <Col xs="auto" className="mx-4">
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
                <div className="text-white mt-2 font-weight-bold">{isListening ? "Listening..." : "Speak"}</div>
              </Col>
              <Col xs="auto">
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
                <div className="text-white mt-2 font-weight-bold">Next</div>
              </Col>
            </Row>

            {feedback && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-pill text-white ${isSuccess ? "bg-success" : "bg-danger"}`}
                style={{ display: "inline-block", fontSize: "1.2rem", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
              >
                {isSuccess && <Star className="me-2" size={24} />}
                {feedback}
                {isSuccess && <Star className="ms-2" size={24} />}
              </motion.div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Pronunciation;
