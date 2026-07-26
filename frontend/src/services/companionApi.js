import { companionConfig } from "../config/companionConfig";
import { apiClient } from "./apiClient";

function skipWhenDisabled(defaultValue) {
  if (!companionConfig.enabled) {
    return Promise.resolve(defaultValue);
  }
  return null;
}

export const companionApi = {
  getPreferences() {
    return skipWhenDisabled(null) || apiClient.get("/api/v1/companion/preferences");
  },

  updatePreferences(payload) {
    return skipWhenDisabled(null) || apiClient.put("/api/v1/companion/preferences", payload);
  },

  startSession(payload) {
    return skipWhenDisabled(null) || apiClient.post("/api/v1/companion/sessions", payload);
  },

  endSession(sessionId) {
    return skipWhenDisabled(null) || apiClient.post("/api/v1/companion/sessions/end", { sessionId });
  },

  respond(payload) {
    return skipWhenDisabled(null) || apiClient.post("/api/v1/companion/respond", payload);
  },
};
