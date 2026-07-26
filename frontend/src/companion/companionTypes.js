/**
 * @typedef {"hidden"|"loading"|"entering"|"greeting"|"idle"|"listening"|"thinking"|"speaking"|"explaining"|"encouraging"|"celebrating"|"error"} CompanionStatus
 * @typedef {"neutral"|"friendly"|"happy"|"encouraging"|"curious"|"concerned"} CompanionEmotion
 * @typedef {"none"|"pronunciation"|"reading"|"topic"|"quiz_hint"|"vocabulary"|"step_by_step"} BoardMode
 *
 * @typedef {Object} CompanionBoardState
 * @property {boolean} open
 * @property {BoardMode} mode
 * @property {string} title
 * @property {*} content
 * @property {number} highlightedIndex
 *
 * @typedef {Object} CompanionState
 * @property {CompanionStatus} status
 * @property {CompanionEmotion} emotion
 * @property {string|null} animation
 * @property {boolean} visible
 * @property {boolean} minimised
 * @property {boolean} muted
 * @property {boolean} textOnly
 * @property {boolean} reducedMotion
 * @property {string|null} characterId
 * @property {boolean} isModelLoaded
 * @property {string|null} modelLoadError
 * @property {string} message
 * @property {boolean} isSpeaking
 * @property {boolean} isListening
 * @property {CompanionBoardState} board
 * @property {string|null} currentLesson
 * @property {string|null} sessionId
 */

export {};
