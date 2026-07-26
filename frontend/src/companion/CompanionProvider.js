import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

import { COMPANION_ACTIONS } from "./companionActions";
import { COMPANION_STATES } from "./companionConstants";
import { companionReducer, initialCompanionState } from "./companionReducer";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";

const CompanionContext = createContext(null);

export function CompanionProvider({ children }) {
  const [state, dispatch] = useReducer(companionReducer, initialCompanionState);
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    dispatch({
      type: COMPANION_ACTIONS.SET_REDUCED_MOTION,
      payload: prefersReducedMotion,
    });
  }, [prefersReducedMotion]);

  const showCompanion = useCallback(
    (status = COMPANION_STATES.IDLE) =>
      dispatch({ type: COMPANION_ACTIONS.SHOW_COMPANION, payload: { status } }),
    []
  );
  const hideCompanion = useCallback(() => dispatch({ type: COMPANION_ACTIONS.HIDE_COMPANION }), []);
  const minimiseCompanion = useCallback(
    () => dispatch({ type: COMPANION_ACTIONS.MINIMISE_COMPANION }),
    []
  );
  const restoreCompanion = useCallback(
    () => dispatch({ type: COMPANION_ACTIONS.RESTORE_COMPANION }),
    []
  );
  const resetCompanion = useCallback(
    () => dispatch({ type: COMPANION_ACTIONS.RESET_COMPANION }),
    []
  );
  const setStatus = useCallback(
    (status) => dispatch({ type: COMPANION_ACTIONS.SET_STATUS, payload: status }),
    []
  );
  const setEmotion = useCallback(
    (emotion) => dispatch({ type: COMPANION_ACTIONS.SET_EMOTION, payload: emotion }),
    []
  );
  const setMessage = useCallback(
    (message) => dispatch({ type: COMPANION_ACTIONS.SET_MESSAGE, payload: message }),
    []
  );
  const setMuted = useCallback(
    (muted) => dispatch({ type: COMPANION_ACTIONS.SET_MUTED, payload: muted }),
    []
  );
  const setTextOnly = useCallback(
    (textOnly) => dispatch({ type: COMPANION_ACTIONS.SET_TEXT_ONLY, payload: textOnly }),
    []
  );
  const openBoard = useCallback(
    (board) => dispatch({ type: COMPANION_ACTIONS.OPEN_BOARD, payload: board }),
    []
  );
  const updateBoard = useCallback(
    (board) => dispatch({ type: COMPANION_ACTIONS.UPDATE_BOARD, payload: board }),
    []
  );
  const closeBoard = useCallback(() => dispatch({ type: COMPANION_ACTIONS.CLOSE_BOARD }), []);
  const startSession = useCallback(
    (payload) => dispatch({ type: COMPANION_ACTIONS.START_SESSION, payload }),
    []
  );
  const endSession = useCallback(() => dispatch({ type: COMPANION_ACTIONS.END_SESSION }), []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      showCompanion,
      hideCompanion,
      minimiseCompanion,
      restoreCompanion,
      resetCompanion,
      setStatus,
      setEmotion,
      setMessage,
      setMuted,
      setTextOnly,
      openBoard,
      updateBoard,
      closeBoard,
      startSession,
      endSession,
    }),
    [
      state,
      showCompanion,
      hideCompanion,
      minimiseCompanion,
      restoreCompanion,
      resetCompanion,
      setStatus,
      setEmotion,
      setMessage,
      setMuted,
      setTextOnly,
      openBoard,
      updateBoard,
      closeBoard,
      startSession,
      endSession,
    ]
  );

  return <CompanionContext.Provider value={value}>{children}</CompanionContext.Provider>;
}

export function useCompanion() {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error("useCompanion must be used inside CompanionProvider");
  }
  return context;
}
