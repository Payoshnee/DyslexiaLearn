import { requestSpeechAudio } from "../services/companionApi.js";

let activeAudio = null;
let activeAudioUrl = "";

export function stopDoodleSpeech() {
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
  try {
    const audioBlob = await requestSpeechAudio({
      text,
      doodleId: doodle?.id || voiceProfile.doodleId || "nova",
      voiceName: voiceProfile.ttsVoice,
      rate: voiceProfile.rate || 0.86,
    });
    return playAudioBlob(audioBlob);
  } catch (error) {
    console.error("Doodle speech failed:", error);
    return false;
  }
}
