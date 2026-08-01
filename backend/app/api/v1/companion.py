import shutil

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.schemas.companion import (
    CompanionEndSessionRequest,
    CompanionPreferences,
    CompanionRespondRequest,
    CompanionResponse,
    CompanionSessionRequest,
    CompanionSpeechRequest,
    CompanionTranscriptionResponse,
    CompanionVoiceTurnRequest,
    CompanionVoiceTurnResponse,
)
from app.services import companion_service
from app.services.stt_service import SpeechToTextError, transcribe_audio
from app.services.tts_service import TextToSpeechError, synthesize_speech

router = APIRouter(prefix="/companion", tags=["companion"])
settings = get_settings()


def ensure_companion_enabled() -> None:
    if not settings.companion_enabled:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Companion feature is disabled.",
        )


@router.get("/preferences", response_model=CompanionPreferences)
def get_preferences() -> CompanionPreferences:
    ensure_companion_enabled()
    return companion_service.get_preferences()


@router.put("/preferences", response_model=CompanionPreferences)
def update_preferences(payload: CompanionPreferences) -> CompanionPreferences:
    ensure_companion_enabled()
    return companion_service.update_preferences(payload)


@router.post("/sessions", response_model=CompanionResponse)
def start_session(payload: CompanionSessionRequest) -> CompanionResponse:
    ensure_companion_enabled()
    return companion_service.start_session(payload)


@router.post("/sessions/end", response_model=CompanionResponse)
def end_session(payload: CompanionEndSessionRequest) -> CompanionResponse:
    ensure_companion_enabled()
    return companion_service.end_session()


@router.post("/respond", response_model=CompanionResponse)
def respond(payload: CompanionRespondRequest) -> CompanionResponse:
    ensure_companion_enabled()
    return companion_service.respond(payload)


@router.post("/voice-turn", response_model=CompanionVoiceTurnResponse)
def voice_turn(
    payload: CompanionVoiceTurnRequest,
    db: Session = Depends(get_db),
) -> CompanionVoiceTurnResponse:
    ensure_companion_enabled()
    return companion_service.handle_voice_turn(payload, db)


@router.post("/transcribe", response_model=CompanionTranscriptionResponse)
def transcribe_voice(file: UploadFile = File(...)) -> CompanionTranscriptionResponse:
    ensure_companion_enabled()
    suffix = ".webm"
    if file.filename and "." in file.filename:
        suffix = f".{file.filename.rsplit('.', 1)[-1]}"
    try:
        result = transcribe_audio(file.file, suffix=suffix)
    except SpeechToTextError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    return CompanionTranscriptionResponse(**result)


@router.post("/speech")
def create_speech(
    payload: CompanionSpeechRequest,
    background_tasks: BackgroundTasks,
) -> FileResponse:
    ensure_companion_enabled()
    try:
        audio_path = synthesize_speech(
            text=payload.text,
            doodle_id=payload.doodle_id,
            voice_name=payload.voice_name,
            rate=payload.rate,
        )
    except TextToSpeechError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    background_tasks.add_task(shutil.rmtree, audio_path.parent, ignore_errors=True)
    return FileResponse(
        audio_path,
        media_type="audio/wav",
        filename=f"{payload.doodle_id}-speech.wav",
        background=background_tasks,
    )
