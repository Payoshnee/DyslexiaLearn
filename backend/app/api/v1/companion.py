from fastapi import APIRouter, HTTPException, status

from app.config import get_settings
from app.schemas.companion import (
    CompanionEndSessionRequest,
    CompanionPreferences,
    CompanionRespondRequest,
    CompanionResponse,
    CompanionSessionRequest,
)
from app.services import companion_service

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
