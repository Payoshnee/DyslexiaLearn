export const selectIsCompanionVisible = (state) => state.visible && state.status !== "hidden";
export const selectCurrentAnimation = (state) => state.animation;
export const selectBoardContent = (state) => state.board.content;
export const selectCanUseSpeech = (state) => !state.muted && !state.textOnly;
export const selectIsBoardOpen = (state) => state.board.open;
