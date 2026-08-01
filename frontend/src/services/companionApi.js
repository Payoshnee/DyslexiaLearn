const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function requestVoiceTurn(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/companion/voice-turn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Voice turn failed with status ${response.status}`);
  }

  return response.json();
}

export async function requestSpeechAudio(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/companion/speech`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Speech audio failed with status ${response.status}`);
  }

  return response.blob();
}

export async function requestTranscription(audioBlob) {
  const formData = new FormData();
  const extension = audioBlob.type.includes("mp4") ? "mp4" : "webm";
  formData.append("file", audioBlob, `voice-turn.${extension}`);

  const response = await fetch(`${API_BASE_URL}/api/v1/companion/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed with status ${response.status}`);
  }

  return response.json();
}
