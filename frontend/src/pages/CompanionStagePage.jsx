import { useEffect, useRef, useState } from "react";

import { COMPANION_STATES } from "../companion/companionStates.js";
import { useDoodle } from "../companion/DoodleContext.js";
import DoodleCanvas from "../components/companion/DoodleCanvas.jsx";
import SpeechBubble from "../components/companion/SpeechBubble.jsx";
import TeachingBoard from "../components/companion/TeachingBoard.jsx";
import VoiceButton from "../components/companion/VoiceButton.jsx";
import ThemeButton from "../components/ui/ThemeButton.jsx";
import TopBar from "../components/ui/TopBar.jsx";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition.js";
import { requestVoiceTurn } from "../services/companionApi.js";
import { speakAsDoodle, stopDoodleSpeech } from "../utils/doodleVoice.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CompanionStagePage() {
  const voiceTurnRunningRef = useRef(false);
  const lastTranscriptRef = useRef("");
  const [autoListen, setAutoListen] = useState(false);
  const [teachingBoard, setTeachingBoard] = useState(null);
  const {
    selectedDoodle,
    profile,
    companionState,
    setCompanionState,
    message,
    setMessage,
    theme,
    toggleTheme,
    boardOpen,
    setBoardOpen,
    activeSyllable,
    setActiveSyllable,
  } = useDoodle();

  const speak = (text) => speakAsDoodle(text, selectedDoodle.voice, selectedDoodle);

  const createMockVoiceTurn = (transcript) => {
    const lowerTranscript = transcript.toLowerCase();
    const targetWord = lowerTranscript.match(/(?:say|pronounce|word)\s+([a-zA-Z'-]+)/)?.[1] || "practice";
    const wantsPronunciation =
      lowerTranscript.includes("pronunciation") ||
      lowerTranscript.includes("word") ||
      lowerTranscript.includes("say");

    return {
      transcript,
      detectedLanguage: "en",
      intent: wantsPronunciation ? "pronunciation_help" : "general_help",
      stateSequence: wantsPronunciation
        ? ["processing", "speaking", "pointing", "listening"]
        : ["processing", "speaking", "idle"],
      responseText: wantsPronunciation
        ? `Great question. Let us break ${targetWord} into small sound parts.`
        : "I heard you. Tell me the word or lesson you want to practice.",
      teachingBoard: wantsPronunciation
        ? {
            type: "syllables",
            word: targetWord,
            syllables: [targetWord],
          }
        : null,
      memoryUpdate: {
        lastTranscript: transcript,
      },
      source: "frontend-mock",
    };
  };

  const playBackendSequence = async (result) => {
    const sequence = result.stateSequence?.length
      ? result.stateSequence
      : [COMPANION_STATES.PROCESSING, COMPANION_STATES.SPEAKING, COMPANION_STATES.IDLE];

    for (const state of sequence) {
      if (state === COMPANION_STATES.POINTING && result.teachingBoard?.syllables?.length) {
        const focusIndex =
          typeof result.teachingBoard.focusIndex === "number"
            ? result.teachingBoard.focusIndex
            : 0;
        setCompanionState(COMPANION_STATES.POINTING);
        setActiveSyllable(focusIndex);
        await wait(650);
        setActiveSyllable(-1);
      } else if (state === COMPANION_STATES.SPEAKING) {
        setCompanionState(COMPANION_STATES.SPEAKING);
        await speak(result.responseText);
      } else {
        setCompanionState(state);
        await wait(state === COMPANION_STATES.PROCESSING ? 700 : 350);
      }
    }
  };

  const playVoiceTurn = async (transcript) => {
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript || voiceTurnRunningRef.current) {
      return;
    }

    if (lastTranscriptRef.current === cleanTranscript) {
      return;
    }

    voiceTurnRunningRef.current = true;
    lastTranscriptRef.current = cleanTranscript;
    stopDoodleSpeech();
    try {
      setCompanionState(COMPANION_STATES.PROCESSING);
      setMessage("Let me think about that.");

      let result;
      try {
        result = await requestVoiceTurn({
          transcript: cleanTranscript,
          learnerName: profile?.name || "Learner",
          learnerAge: profile?.age || 8,
          doodleId: selectedDoodle.id,
          doodleName: selectedDoodle.name,
          language: "auto",
          context: {
            currentBoard: teachingBoard,
            boardOpen,
            companionState,
          },
        });
      } catch {
        result = createMockVoiceTurn(cleanTranscript);
      }

      setMessage(result.responseText);
      setTeachingBoard(result.teachingBoard || null);
      setBoardOpen(Boolean(result.teachingBoard));

      await playBackendSequence(result);
      if (autoListen) {
        window.setTimeout(() => {
          if (!voiceTurnRunningRef.current) {
            speech.startListening();
          }
        }, 700);
      }
    } finally {
      voiceTurnRunningRef.current = false;
      window.setTimeout(() => {
        if (lastTranscriptRef.current === cleanTranscript) {
          lastTranscriptRef.current = "";
        }
      }, 1500);
    }
  };

  const speech = useSpeechRecognition({
    onStart: async () => {
      stopDoodleSpeech();
      voiceTurnRunningRef.current = false;
      setCompanionState(COMPANION_STATES.HEARING);
      setMessage(`${selectedDoodle.name} is turning to hear you.`);
      await wait(500);
      setCompanionState(COMPANION_STATES.LISTENING);
      setMessage("I am listening.");
    },
    onResult: playVoiceTurn,
    onEnd: () => {
      if (companionState === COMPANION_STATES.LISTENING && !voiceTurnRunningRef.current) {
        setCompanionState(COMPANION_STATES.PROCESSING);
      }
    },
    onError: (error) => {
      setCompanionState(COMPANION_STATES.IDLE);
      setMessage(error);
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function playEntrance() {
      setBoardOpen(false);
      setMessage("");
      setCompanionState(COMPANION_STATES.WALKING);
      await wait(1200);
      if (cancelled) return;
      setCompanionState(COMPANION_STATES.GREETING);
      await wait(1100);
      if (cancelled) return;
      setCompanionState(COMPANION_STATES.SPEAKING);
      const greetingText = `Hi, my name is ${selectedDoodle.name}. What should we practice today?`;
      setMessage(greetingText);
      await speak(greetingText);
      if (cancelled) return;
      setCompanionState(COMPANION_STATES.IDLE);
    }

    playEntrance();
    return () => {
      cancelled = true;
      stopDoodleSpeech();
    };
  }, [selectedDoodle.name, setBoardOpen, setCompanionState, setMessage]);

  return (
    <main className={`stage-page ${theme}`}>
      <TopBar />
      <section className="stage-copy">
        <p className="eyebrow">AI Doodle Companion</p>
        <h1>{selectedDoodle.name}</h1>
        <label className="auto-listen-toggle">
          <input
            type="checkbox"
            checked={autoListen}
            onChange={(event) => setAutoListen(event.target.checked)}
          />
          Keep listening after reply
        </label>
      </section>
      <DoodleCanvas doodle={selectedDoodle} state={companionState} />
      <SpeechBubble message={message} />
      <VoiceButton
        listening={speech.listening}
        supported={speech.supported}
        transcript={speech.transcript}
        error={speech.error}
        onStart={speech.startListening}
        onStop={speech.stopListening}
        onSubmitText={playVoiceTurn}
      />
      <TeachingBoard open={boardOpen} board={teachingBoard} activeSyllable={activeSyllable} />
      <ThemeButton theme={theme} onToggle={toggleTheme} />
    </main>
  );
}
