export const companionConfig = {
  enabled: process.env.REACT_APP_COMPANION_ENABLED === "true",
  defaultCharacterId: process.env.REACT_APP_COMPANION_DEFAULT_CHARACTER || "default",
};
