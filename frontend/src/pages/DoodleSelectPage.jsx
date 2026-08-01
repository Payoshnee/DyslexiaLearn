import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Hand, Sparkles } from "lucide-react";

import { useDoodle } from "../companion/DoodleContext.js";
import { COMPANION_STATES } from "../companion/companionStates.js";
import DoodleCanvas from "../components/companion/DoodleCanvas.jsx";
import VideoPage from "../components/ui/VideoPage.jsx";
import { speakAsDoodle, stopDoodleSpeech } from "../utils/doodleVoice.js";

export default function DoodleSelectPage() {
  const navigate = useNavigate();
  const { doodles, chooseDoodle, profile } = useDoodle();
  const [index, setIndex] = useState(0);
  const doodle = doodles[index];
  const previewState = useMemo(
    () => [COMPANION_STATES.GREETING, COMPANION_STATES.SPEAKING, COMPANION_STATES.IDLE][index % 3],
    [index]
  );

  const move = (direction) => {
    const nextIndex = (index + direction + doodles.length) % doodles.length;
    stopDoodleSpeech();
    setIndex(nextIndex);
  };

  const previewVoice = () => {
    speakAsDoodle(doodle.voice.preview, doodle.voice, doodle);
  };

  const selectDoodle = () => {
    stopDoodleSpeech();
    chooseDoodle(doodle.id);
    navigate("/stage");
  };

  return (
    <VideoPage className="select-page">
      <section className="doodle-picker" aria-label="Choose AI Doodle">
        <button className="picker-arrow" type="button" onClick={() => move(-1)} aria-label="Previous doodle">
          <ChevronLeft size={30} />
        </button>
        <div className="doodle-info-panel">
          <p className="eyebrow">Hi {profile?.name}</p>
          <h1>{doodle.name}</h1>
          <p>{doodle.role}</p>
          <p>
            {doodle.description}
          </p>
          <div className="doodle-traits">
            <span><Sparkles size={15} /> {doodle.voice.gender} voice</span>
            <span>RAG memory</span>
            <span>{doodle.modelStatus === "ready" ? "3D ready" : "visual placeholder"}</span>
          </div>
          <button className="voice-preview-button" type="button" onClick={previewVoice}>
            Hear {doodle.name}
          </button>
        </div>
        <div className="doodle-preview-panel">
          <div className="doodle-preview-canvas">
            <DoodleCanvas doodle={doodle} state={previewState} />
          </div>
          <div className="preview-caption">
            <Hand size={18} />
            <span>Showing hand hello</span>
          </div>
          <p className="asset-note">{doodle.sourceName}</p>
        </div>
        <button className="picker-arrow" type="button" onClick={() => move(1)} aria-label="Next doodle">
          <ChevronRight size={30} />
        </button>
        <button className="choose-me-button" type="button" onClick={selectDoodle}>
          Choose me
        </button>
      </section>
    </VideoPage>
  );
}
