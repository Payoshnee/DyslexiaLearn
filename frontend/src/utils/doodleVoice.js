import { requestSpeechAudio } from "../services/companionApi.js";

let activeAudio = null;
let activeAudioUrl = "";
let backendSpeechRetryAfter = 0;

export function stopDoodleSpeech() {
  window.speechSynthesis?.cancel();

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }

  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = "";
  }
}

function speakWithBrowser(text, voiceProfile = {}) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredNames = voiceProfile.preferredNames || [];
    utterance.voice = preferredNames
      .map((name) => voices.find((voice) => voice.name.includes(name)))
      .find(Boolean) || voices.find((voice) => voice.lang?.startsWith("en")) || null;
    utterance.rate = Math.min(1.5, Math.max(0.5, voiceProfile.rate || 0.86));
    utterance.pitch = Math.min(2, Math.max(0, voiceProfile.pitch || 1));
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

function playAudioBlob(blob) {
  return new Promise((resolve) => {
    stopDoodleSpeech();
    activeAudioUrl = URL.createObjectURL(blob);
    activeAudio = new Audio(activeAudioUrl);

    activeAudio.onended = () => {
      stopDoodleSpeech();
      resolve(true);
    };
    activeAudio.onerror = () => {
      stopDoodleSpeech();
      resolve(false);
    };

    activeAudio.play().catch(() => {
      stopDoodleSpeech();
      resolve(false);
    });
  });
}

export async function speakAsDoodle(text, voiceProfile = {}, doodle = null) {
  stopDoodleSpeech();
  if (Date.now() < backendSpeechRetryAfter) {
    return speakWithBrowser(text, voiceProfile);
  }

  try {
    const audioBlob = await requestSpeechAudio({
      text,
      doodleId: doodle?.id || voiceProfile.doodleId || "nova",
      voiceName: voiceProfile.ttsVoice,
      rate: voiceProfile.rate || 0.86,
    });
    const played = await playAudioBlob(audioBlob);
    if (played) {
      backendSpeechRetryAfter = 0;
      return true;
    }
  } catch (error) {
    console.error("Doodle speech failed:", error);
  }

  backendSpeechRetryAfter = Date.now() + 30_000;
  return speakWithBrowser(text, voiceProfile);
}
