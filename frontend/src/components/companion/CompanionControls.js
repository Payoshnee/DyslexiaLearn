import React from "react";
import { EyeOff, RotateCcw, Volume2, VolumeX, Minimize2, Maximize2 } from "lucide-react";

function CompanionControls({
  minimised,
  muted,
  onHide,
  onMinimise,
  onRestore,
  onMuteToggle,
  onReset,
}) {
  return (
    <div className="companion-controls" aria-label="Learning companion controls">
      {minimised ? (
        <button type="button" onClick={onRestore} aria-label="Restore learning companion">
          <Maximize2 size={16} />
        </button>
      ) : (
        <button type="button" onClick={onMinimise} aria-label="Minimise learning companion">
          <Minimize2 size={16} />
        </button>
      )}
      <button
        type="button"
        onClick={() => onMuteToggle(!muted)}
        aria-label={muted ? "Unmute learning companion" : "Mute learning companion"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <button type="button" onClick={onReset} aria-label="Reset learning companion">
        <RotateCcw size={16} />
      </button>
      <button type="button" onClick={onHide} aria-label="Hide learning companion">
        <EyeOff size={16} />
      </button>
    </div>
  );
}

export default CompanionControls;
