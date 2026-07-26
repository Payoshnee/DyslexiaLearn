import { COMPANION_ACTIONS } from "./companionActions";
import {
  BOARD_MODES,
  COMPANION_EMOTIONS,
  COMPANION_STATES,
  DEFAULT_BOARD_STATE,
} from "./companionConstants";

export const initialCompanionState = {
  status: COMPANION_STATES.HIDDEN,
  emotion: COMPANION_EMOTIONS.NEUTRAL,
  animation: null,

  visible: true,
  minimised: false,
  muted: false,
  textOnly: false,
  reducedMotion: false,

  characterId: null,
  isModelLoaded: false,
  modelLoadError: null,

  message: "",
  isSpeaking: false,
  isListening: false,

  board: DEFAULT_BOARD_STATE,

  currentLesson: null,
  sessionId: null,
};

export function companionReducer(state, action) {
  switch (action.type) {
    case COMPANION_ACTIONS.SHOW_COMPANION:
      return {
        ...state,
        visible: true,
        status: action.payload?.status || COMPANION_STATES.IDLE,
      };
    case COMPANION_ACTIONS.HIDE_COMPANION:
      return { ...state, visible: false, minimised: false, status: COMPANION_STATES.HIDDEN };
    case COMPANION_ACTIONS.MINIMISE_COMPANION:
      return { ...state, minimised: true };
    case COMPANION_ACTIONS.RESTORE_COMPANION:
      return { ...state, visible: true, minimised: false };
    case COMPANION_ACTIONS.SET_STATUS:
      return { ...state, status: action.payload };
    case COMPANION_ACTIONS.SET_EMOTION:
      return { ...state, emotion: action.payload };
    case COMPANION_ACTIONS.SET_ANIMATION:
      return { ...state, animation: action.payload };
    case COMPANION_ACTIONS.SET_CHARACTER:
      return { ...state, characterId: action.payload };
    case COMPANION_ACTIONS.SET_MODEL_LOADED:
      return { ...state, isModelLoaded: Boolean(action.payload), modelLoadError: null };
    case COMPANION_ACTIONS.SET_MODEL_ERROR:
      return {
        ...state,
        isModelLoaded: false,
        modelLoadError: action.payload || "The learning companion could not load.",
        status: COMPANION_STATES.ERROR,
      };
    case COMPANION_ACTIONS.SET_MESSAGE:
      return { ...state, message: action.payload || "" };
    case COMPANION_ACTIONS.SET_SPEAKING:
      return { ...state, isSpeaking: Boolean(action.payload) };
    case COMPANION_ACTIONS.SET_LISTENING:
      return { ...state, isListening: Boolean(action.payload) };
    case COMPANION_ACTIONS.SET_MUTED:
      return { ...state, muted: Boolean(action.payload) };
    case COMPANION_ACTIONS.SET_TEXT_ONLY:
      return { ...state, textOnly: Boolean(action.payload) };
    case COMPANION_ACTIONS.SET_REDUCED_MOTION:
      return { ...state, reducedMotion: Boolean(action.payload) };
    case COMPANION_ACTIONS.OPEN_BOARD:
      return {
        ...state,
        board: {
          ...DEFAULT_BOARD_STATE,
          ...action.payload,
          mode: action.payload?.mode || BOARD_MODES.NONE,
          open: true,
        },
      };
    case COMPANION_ACTIONS.UPDATE_BOARD:
      return { ...state, board: { ...state.board, ...action.payload } };
    case COMPANION_ACTIONS.CLOSE_BOARD:
      return { ...state, board: DEFAULT_BOARD_STATE };
    case COMPANION_ACTIONS.START_SESSION:
      return {
        ...state,
        sessionId: action.payload?.sessionId || null,
        currentLesson: action.payload?.currentLesson || null,
        visible: true,
        status: COMPANION_STATES.IDLE,
      };
    case COMPANION_ACTIONS.END_SESSION:
      return {
        ...state,
        sessionId: null,
        currentLesson: null,
        board: DEFAULT_BOARD_STATE,
        isSpeaking: false,
        isListening: false,
      };
    case COMPANION_ACTIONS.RESET_COMPANION:
      return { ...initialCompanionState, reducedMotion: state.reducedMotion };
    default:
      return state;
  }
}
