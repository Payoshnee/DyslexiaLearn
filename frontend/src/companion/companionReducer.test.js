import { COMPANION_ACTIONS } from "./companionActions";
import { BOARD_MODES, COMPANION_STATES } from "./companionConstants";
import { companionReducer, initialCompanionState } from "./companionReducer";

describe("companionReducer", () => {
  test("returns initial state fields", () => {
    expect(initialCompanionState.status).toBe(COMPANION_STATES.HIDDEN);
    expect(initialCompanionState.board.open).toBe(false);
    expect(initialCompanionState.visible).toBe(true);
  });

  test("SET_STATUS updates only the status", () => {
    const state = { ...initialCompanionState, message: "Keep me" };
    const nextState = companionReducer(state, {
      type: COMPANION_ACTIONS.SET_STATUS,
      payload: COMPANION_STATES.THINKING,
    });

    expect(nextState.status).toBe(COMPANION_STATES.THINKING);
    expect(nextState.message).toBe("Keep me");
    expect(nextState.board).toBe(state.board);
  });

  test("OPEN_BOARD opens the board with content", () => {
    const nextState = companionReducer(initialCompanionState, {
      type: COMPANION_ACTIONS.OPEN_BOARD,
      payload: {
        mode: BOARD_MODES.PRONUNCIATION,
        title: "Say it with me",
        content: { word: "cat" },
        highlightedIndex: 0,
      },
    });

    expect(nextState.board.open).toBe(true);
    expect(nextState.board.mode).toBe(BOARD_MODES.PRONUNCIATION);
    expect(nextState.board.content.word).toBe("cat");
  });

  test("CLOSE_BOARD clears board state", () => {
    const openedState = companionReducer(initialCompanionState, {
      type: COMPANION_ACTIONS.OPEN_BOARD,
      payload: { mode: BOARD_MODES.READING, title: "Read" },
    });
    const nextState = companionReducer(openedState, {
      type: COMPANION_ACTIONS.CLOSE_BOARD,
    });

    expect(nextState.board.open).toBe(false);
    expect(nextState.board.mode).toBe(BOARD_MODES.NONE);
    expect(nextState.board.content).toBeNull();
  });

  test("SET_MUTED toggles mute state", () => {
    const mutedState = companionReducer(initialCompanionState, {
      type: COMPANION_ACTIONS.SET_MUTED,
      payload: true,
    });
    const unmutedState = companionReducer(mutedState, {
      type: COMPANION_ACTIONS.SET_MUTED,
      payload: false,
    });

    expect(mutedState.muted).toBe(true);
    expect(unmutedState.muted).toBe(false);
  });
});
