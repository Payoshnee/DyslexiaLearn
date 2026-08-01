import tempfile
from functools import lru_cache
from pathlib import Path
from typing import BinaryIO

from app.config import get_settings


class SpeechToTextError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def _load_whisper_model():
    settings = get_settings()
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise SpeechToTextError(
            "faster-whisper is not installed. Run: pip install -r requirements.txt"
        ) from exc

    return WhisperModel(
        settings.whisper_model_size,
        device=settings.whisper_device,
        compute_type=settings.whisper_compute_type,
    )


def transcribe_audio(file: BinaryIO, suffix: str = ".webm") -> dict:
    settings = get_settings()
    if settings.stt_engine.lower() != "faster-whisper":
        raise SpeechToTextError("Only faster-whisper STT is configured.")

    with tempfile.NamedTemporaryFile(prefix="dyslexialearn-stt-", suffix=suffix, delete=False) as temp:
        temp.write(file.read())
        audio_path = Path(temp.name)

    try:
        model = _load_whisper_model()
        segments, info = model.transcribe(
            str(audio_path),
            beam_size=1,
            best_of=1,
            vad_filter=False,
            condition_on_previous_text=False,
        )
        transcript = " ".join(segment.text.strip() for segment in segments).strip()
        return {
            "transcript": transcript,
            "language": getattr(info, "language", "auto") or "auto",
            "duration": getattr(info, "duration", 0) or 0,
            "source": "faster-whisper",
        }
    except Exception as exc:
        raise SpeechToTextError(f"Could not transcribe audio: {exc}") from exc
    finally:
        audio_path.unlink(missing_ok=True)
