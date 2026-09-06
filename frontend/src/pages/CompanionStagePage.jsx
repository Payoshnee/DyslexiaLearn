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
import {
  requestSystemStatus,
  requestSystemWake,
  requestVoiceTurn,
  testBrainConnection,
} from "../services/companionApi.js";
import { speakAsDoodle, stopDoodleSpeech } from "../utils/doodleVoice.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readBrain = () => {
  try {
    return JSON.parse(localStorage.getItem("dyslexialearn_brain")) || { brainType: "dybrain", provider: "ollama" };
  } catch {
    return { brainType: "dybrain", provider: "ollama" };
  }
};

export default function CompanionStagePage() {
  const voiceTurnRunningRef = useRef(false);
  const lastTranscriptRef = useRef("");
  const brainNoticeShownRef = useRef(false);
  const [autoListen, setAutoListen] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [systemChecking, setSystemChecking] = useState(false);
  const [brainConfig, setBrainConfig] = useState(readBrain);
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

  const checkSystem = async () => {
    setSystemChecking(true);
    try {
      const usesManagedOllama = brainConfig.brainType === "dybrain" || brainConfig.provider === "ollama";
      const result = usesManagedOllama
        ? await requestSystemStatus()
        : await testBrainConnection(brainConfig);
      const normalized = "connected" in result
        ? { status: result.connected ? "up" : "error", message: result.message }
        : result;
      setSystemStatus(normalized);
      return normalized;
    } catch (error) {
      setSystemStatus({
        status: "error",
        message: error.message || "System check failed.",
      });
      return null;
    } finally {
      setSystemChecking(false);
    }
  };

  const announceBrainStatus = async (text) => {
    stopDoodleSpeech();
    setMessage(text);
    setCompanionState(COMPANION_STATES.SPEAKING);
    await speak(text);
    setCompanionState(COMPANION_STATES.IDLE);
  };

  const connectSystem = async () => {
    if (systemChecking) return;

    brainNoticeShownRef.current = true;
    setSystemChecking(true);
    setSystemStatus((current) => ({
      ...current,
      status: "starting",
      message: "Connecting to my brain. This can take a moment on the free server.",
    }));
    await announceBrainStatus("I am connecting to my brain. Please wait a moment.");

    try {
      const usesManagedOllama = brainConfig.brainType === "dybrain" || brainConfig.provider === "ollama";
      const response = usesManagedOllama
        ? await requestSystemWake()
        : await testBrainConnection(brainConfig);
      const result = "connected" in response
        ? { status: response.connected ? "up" : "error", message: response.message }
        : response;
      setSystemStatus(result);
      if (result.status === "up") {
        await announceBrainStatus("My brain is connected. I am ready to help you!");
      } else {
        await announceBrainStatus("I still cannot connect to my brain. Please try Connect again.");
      }
    } catch {
      setSystemStatus({
        status: "error",
        message: "The brain service could not be reached. Please try again.",
      });
      await announceBrainStatus("I could not connect to my brain. Please try Connect again.");
    } finally {
      setSystemChecking(false);
    }
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

    if (systemStatus?.status !== "up") {
      await announceBrainStatus("Please connect me to my brain first, then ask me again.");
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

      try {
        const result = await requestVoiceTurn({
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
            brain: brainConfig,
          },
        });

        setMessage(result.responseText);
        setTeachingBoard(result.teachingBoard || null);
        setBoardOpen(Boolean(result.teachingBoard));

        await playBackendSequence(result);
      } catch {
        setSystemStatus({
          status: "error",
          message: "The connection to my brain was lost. Please reconnect.",
        });
        await announceBrainStatus("I lost the connection to my brain. Please connect me and try again.");
        return;
      }
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSystem();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [brainConfig]);

  useEffect(() => {
    const updateBrain = (event) => {
      setBrainConfig(event.detail || readBrain());
      setSystemStatus(null);
    };
    window.addEventListener("dyslexialearn:brain-changed", updateBrain);
    return () => window.removeEventListener("dyslexialearn:brain-changed", updateBrain);
  }, []);

  useEffect(() => {
    checkSystem();
  }, [brainConfig]);

  useEffect(() => {
    if (systemStatus?.status === "up") {
      brainNoticeShownRef.current = false;
      return undefined;
    }

    if (
      !systemStatus ||
      systemStatus.status === "starting" ||
      brainNoticeShownRef.current
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      brainNoticeShownRef.current = true;
      announceBrainStatus("Please connect me to my brain so I can help you.");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [systemStatus?.status]);

  return (
    <main className={`stage-page ${theme}`}>
      <TopBar />
      <section className="stage-copy">
        <p className="eyebrow">AI Doodle Companion</p>
        <h1>{selectedDoodle.name}</h1>
        {systemStatus && systemStatus.status !== "up" ? (
          <div className={`system-status system-status-${systemStatus.status}`}>
            <button type="button" onClick={connectSystem} disabled={systemChecking}>
              {systemChecking ? "Connecting..." : "Connect brain"}
            </button>
            <span>{systemStatus.status === "starting" ? "connecting" : systemStatus.status}</span>
            <p>{systemStatus.message}</p>
          </div>
        ) : null}
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
