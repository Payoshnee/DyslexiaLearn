import { useEffect, useRef, useState } from "react";

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

const ERROR_MESSAGES = {
  "audio-capture": "No microphone was found. Type to Doodle instead.",
  "not-allowed": "Microphone permission was blocked. Type to Doodle instead.",
  "service-not-allowed": "Chrome speech recognition is unavailable. Type to Doodle instead.",
  network: "Chrome speech recognition could not connect. Type to Doodle instead.",
};

export function useSpeechRecognition({ onResult, onStart, onEnd, onError } = {}) {
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const callbacksRef = useRef({ onResult, onStart, onEnd, onError });
  const [supported] = useState(() => Boolean(getSpeechRecognition()));
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    callbacksRef.current = { onResult, onStart, onEnd, onError };
  }, [onResult, onStart, onEnd, onError]);

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      const message = "Chrome speech recognition is not supported in this browser. Type to Doodle instead.";
      setError(message);
      callbacksRef.current.onError?.(message);
      return;
    }

    if (recognitionRef.current) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    finalTranscriptRef.current = "";

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
      setError("");
      callbacksRef.current.onStart?.();
    };

    recognition.onresult = (event) => {
      let finalText = finalTranscriptRef.current;
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0]?.transcript || "";
        if (event.results[index].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      finalTranscriptRef.current = finalText;
      setTranscript(`${finalText}${interimText}`.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }
      const message = ERROR_MESSAGES[event.error] || "Chrome could not understand the microphone input. Try again or type instead.";
      setError(message);
      callbacksRef.current.onError?.(message);
    };

    recognition.onend = () => {
      const finalText = finalTranscriptRef.current.trim();
      recognitionRef.current = null;
      setListening(false);
      setTranscript(finalText);
      if (finalText) {
        callbacksRef.current.onResult?.(finalText);
      }
      callbacksRef.current.onEnd?.();
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      const message = "Chrome speech recognition could not start. Try again or type instead.";
      setError(message);
      callbacksRef.current.onError?.(message);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return {
    supported,
    listening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
