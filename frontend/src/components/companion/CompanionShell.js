import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BOARD_MODES, COMPANION_STATES } from "../../companion/companionConstants";
import { useCompanion } from "../../hooks/useCompanion";
import { companionConfig } from "../../config/companionConfig";
import CompanionControls from "./CompanionControls";
import CompanionErrorBoundary from "./CompanionErrorBoundary";
import CompanionPlaceholder from "./CompanionPlaceholder";
import LearningBoardPlaceholder from "./LearningBoardPlaceholder";

function CompanionShell() {
  const {
    state,
    showCompanion,
    hideCompanion,
    minimiseCompanion,
    restoreCompanion,
    resetCompanion,
    setMessage,
    setMuted,
    openBoard,
    closeBoard,
  } = useCompanion();

  useEffect(() => {
    if (!companionConfig.enabled) {
      return;
    }

    showCompanion(COMPANION_STATES.IDLE);
    setMessage("Your learning companion is ready.");
    openBoard({
      mode: BOARD_MODES.PRONUNCIATION,
      title: "Say it with me",
      content: {
        word: "pronunciation",
        syllables: ["pro", "nun", "ci", "a", "tion"],
      },
      highlightedIndex: 0,
    });
  }, [openBoard, setMessage, showCompanion]);

  if (!companionConfig.enabled || !state.visible) {
    return null;
  }

  const handleReset = () => {
    resetCompanion();
    showCompanion(COMPANION_STATES.IDLE);
    setMessage("Your learning companion is ready.");
  };

  const shell = (
    <aside
      className={`companion-shell ${state.minimised ? "is-minimised" : ""}`}
      aria-label="Learning companion"
    >
      <CompanionControls
        minimised={state.minimised}
        muted={state.muted}
        onHide={hideCompanion}
        onMinimise={minimiseCompanion}
        onRestore={restoreCompanion}
        onMuteToggle={setMuted}
        onReset={handleReset}
      />
      {!state.minimised && (
        <>
          <CompanionPlaceholder state={state} />
          <LearningBoardPlaceholder
            board={state.board}
            reducedMotion={state.reducedMotion}
            onClose={closeBoard}
          />
        </>
      )}
    </aside>
  );

  if (state.reducedMotion) {
    return <CompanionErrorBoundary>{shell}</CompanionErrorBoundary>;
  }

  return (
    <CompanionErrorBoundary>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {shell}
        </motion.div>
      </AnimatePresence>
    </CompanionErrorBoundary>
  );
}

export default CompanionShell;
