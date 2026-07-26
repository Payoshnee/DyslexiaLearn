export const COMPANION_STATES = {
  HIDDEN: "hidden",
  LOADING: "loading",
  ENTERING: "entering",
  GREETING: "greeting",
  IDLE: "idle",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
  EXPLAINING: "explaining",
  ENCOURAGING: "encouraging",
  CELEBRATING: "celebrating",
  ERROR: "error",
};

export const COMPANION_EMOTIONS = {
  NEUTRAL: "neutral",
  FRIENDLY: "friendly",
  HAPPY: "happy",
  ENCOURAGING: "encouraging",
  CURIOUS: "curious",
  CONCERNED: "concerned",
};

export const BOARD_MODES = {
  NONE: "none",
  PRONUNCIATION: "pronunciation",
  READING: "reading",
  TOPIC: "topic",
  QUIZ_HINT: "quiz_hint",
  VOCABULARY: "vocabulary",
  STEP_BY_STEP: "step_by_step",
};

export const DEFAULT_BOARD_STATE = {
  open: false,
  mode: BOARD_MODES.NONE,
  title: "",
  content: null,
  highlightedIndex: -1,
};
