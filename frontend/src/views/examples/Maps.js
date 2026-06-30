import React from "react";

// Flashcard Component with Text-to-Speech
const Flashcard = ({ term, definition, score }) => {
  const handleTTS = () => {
    // Check if speech synthesis is available in the browser
    const utterance = new SpeechSynthesisUtterance(definition);
    utterance.lang = "en-US";  // Set the language for speech

    // Optional: Set the pitch, rate, and volume of the speech
    utterance.pitch = 1;  // Range: 0 to 2 (default is 1)
    utterance.rate = 1;   // Range: 0.1 to 10 (default is 1)
    utterance.volume = 1; // Range: 0 to 1 (default is 1)

    // Speak the definition
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flashcard">
      <div className="flashcard-term">
        <strong>{term}</strong>
      </div>
      <div className="flashcard-definition">
        {definition}
      </div>
      <div className="flashcard-score">
        <p>Score: {score}</p>
      </div>
      <button onClick={handleTTS}>Speak Definition</button>
    </div>
  );
};

export default Flashcard;
