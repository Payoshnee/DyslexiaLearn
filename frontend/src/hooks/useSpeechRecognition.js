import { useRef, useState } from "react";

import { requestTranscription } from "../services/companionApi.js";

function getRecorderMimeType() {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return options.find((type) => MediaRecorder.isTypeSupported?.(type)) || "";
}

export function useSpeechRecognition({ onResult, onStart, onEnd, onError } = {}) {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const analyserFrameRef = useRef(null);
  const [supported, setSupported] = useState(() => Boolean(navigator.mediaDevices?.getUserMedia));
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const cleanupStream = () => {
    window.clearTimeout(silenceTimerRef.current);
    window.cancelAnimationFrame(analyserFrameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startSilenceDetection = (stream, recorder) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const data = new Uint8Array(analyser.fftSize);
    source.connect(analyser);

    const checkVolume = () => {
      analyser.getByteTimeDomainData(data);
      const volume =
        data.reduce((sum, value) => sum + Math.abs(value - 128), 0) / data.length;

      if (volume > 2.5) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = window.setTimeout(() => {
          if (recorder.state === "recording") {
            recorder.stop();
          }
          audioContext.close();
        }, 950);
      }

      if (recorder.state === "recording") {
        analyserFrameRef.current = window.requestAnimationFrame(checkVolume);
      }
    };

    silenceTimerRef.current = window.setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop();
      }
      audioContext.close();
    }, 6000);
    checkVolume();
  };

  const startListening = async () => {
    const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    setSupported(canRecord);

    if (!canRecord) {
      const message = "Microphone recording is not supported in this browser. Type to Doodle instead.";
      setError(message);
      onError?.(message);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = getRecorderMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setListening(true);
        setTranscript("");
        setError("");
        onStart?.();
      };

      recorder.onstop = async () => {
        setListening(false);
        cleanupStream();
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        chunksRef.current = [];
        if (!audioBlob.size) {
          onEnd?.();
          return;
        }

        try {
          setTranscript("Transcribing with local Whisper...");
          const result = await requestTranscription(audioBlob);
          setTranscript(result.transcript || "");
          if (result.transcript) {
            onResult?.(result.transcript);
          }
        } catch {
          const message = "Backend Whisper transcription failed. Type to Doodle instead.";
          setError(message);
          onError?.(message);
        } finally {
          onEnd?.();
        }
      };

      recorderRef.current = recorder;
      recorder.start();
      startSilenceDetection(stream, recorder);
    } catch {
      const message = "Microphone permission was blocked. Type to Doodle instead.";
      setError(message);
      onError?.(message);
      cleanupStream();
    }
  };

  const stopListening = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  return {
    supported,
    listening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
