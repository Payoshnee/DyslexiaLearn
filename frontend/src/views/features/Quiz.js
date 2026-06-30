import React, { useState } from "react";
import { Container, Card, CardBody, Button, Row, Col } from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

const QUESTIONS = [
  {
    question: "Which of these is an animal?",
    options: ["Apple", "Elephant", "Car", "Tree"],
    answer: "Elephant"
  },
  {
    question: "What color is the sky?",
    options: ["Green", "Red", "Blue", "Yellow"],
    answer: "Blue"
  },
  {
    question: "How many legs does a spider have?",
    options: ["4", "6", "8", "10"],
    answer: "8"
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswerOptionClick = (option) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    setSelectedAnswer(option);
    
    if (option === QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < QUESTIONS.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1500); // Wait 1.5s before moving to next question
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <Container className="pt-5 pb-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-panel shadow-lg border-0" style={{ borderRadius: "30px", minHeight: "400px" }}>
          <CardBody className="p-5 d-flex flex-column justify-content-center align-items-center">
            
            {showScore ? (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-center text-white"
              >
                <Trophy size={100} className="text-warning mb-4" />
                <h1 className="display-2 font-weight-bold">Quiz Complete!</h1>
                <h2 className="mt-3">You scored {score} out of {QUESTIONS.length}</h2>
                <Button color="primary" size="lg" className="mt-5 rounded-pill" onClick={restartQuiz}>
                  Play Again
                </Button>
              </motion.div>
            ) : (
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                  <h4 className="mb-0 font-weight-bold">Question {currentQuestion + 1}/{QUESTIONS.length}</h4>
                  <h4 className="mb-0 font-weight-bold text-warning">Score: {score}</h4>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-white text-center mb-5" style={{ fontSize: "2.5rem", fontWeight: "800" }}>
                      {QUESTIONS[currentQuestion].question}
                    </h2>

                    <Row className="justify-content-center g-4">
                      {QUESTIONS[currentQuestion].options.map((option, index) => {
                        let btnColor = "secondary";
                        let Icon = null;
                        
                        if (selectedAnswer === option) {
                          if (isCorrect) {
                            btnColor = "success";
                            Icon = <CheckCircle className="ms-2" />;
                          } else {
                            btnColor = "danger";
                            Icon = <XCircle className="ms-2" />;
                          }
                        } else if (selectedAnswer !== null && option === QUESTIONS[currentQuestion].answer) {
                          btnColor = "success"; // Reveal correct answer
                        }

                        return (
                          <Col md="6" key={index} className="mb-3">
                            <motion.div whileHover={{ scale: selectedAnswer ? 1 : 1.05 }} whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}>
                              <Button
                                color={btnColor}
                                className={`w-100 p-4 rounded-pill shadow-sm d-flex justify-content-center align-items-center ${btnColor === 'secondary' ? 'bg-white text-default' : 'text-white'}`}
                                style={{ fontSize: "1.5rem", fontWeight: "bold", border: "none" }}
                                onClick={() => handleAnswerOptionClick(option)}
                                disabled={selectedAnswer !== null}
                              >
                                {option}
                                {Icon}
                              </Button>
                            </motion.div>
                          </Col>
                        );
                      })}
                    </Row>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Quiz;
