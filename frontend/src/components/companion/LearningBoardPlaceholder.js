import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

function renderContent(content, highlightedIndex) {
  if (!content) {
    return <p className="companion-board-empty">No board content yet.</p>;
  }

  if (Array.isArray(content.syllables)) {
    return (
      <div>
        <p className="companion-board-word">{content.word}</p>
        <div className="companion-syllables">
          {content.syllables.map((syllable, index) => (
            <span
              key={`${syllable}-${index}`}
              className={index === highlightedIndex ? "is-highlighted" : ""}
            >
              {syllable}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return <pre className="companion-board-json">{JSON.stringify(content, null, 2)}</pre>;
}

function LearningBoardPlaceholder({ board, reducedMotion, onClose }) {
  if (!board.open) {
    return null;
  }

  const boardContent = (
    <section
      className="companion-board"
      aria-label="Learning companion board"
      tabIndex="-1"
    >
      <div className="companion-board-header">
        <div>
          <p className="companion-eyebrow">Board: {board.mode}</p>
          <h3>{board.title || "Learning board"}</h3>
        </div>
        <button type="button" onClick={onClose} aria-label="Close learning board">
          <X size={18} />
        </button>
      </div>
      <div className="companion-board-body">
        {renderContent(board.content, board.highlightedIndex)}
      </div>
    </section>
  );

  if (reducedMotion) {
    return boardContent;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {boardContent}
    </motion.div>
  );
}

export default LearningBoardPlaceholder;
