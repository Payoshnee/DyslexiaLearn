from uuid import uuid4

from app.config import get_settings
from app.schemas.companion import (
    CompanionBoardInstruction,
    CompanionCharacterInstruction,
    CompanionPreferences,
    CompanionRespondRequest,
    CompanionResponse,
    CompanionSessionRequest,
)

settings = get_settings()

_preferences = CompanionPreferences(
    character_id=settings.companion_default_character,
    muted=False,
    text_only=False,
    reduced_motion=False,
    speech_rate=0.85,
)


def get_preferences() -> CompanionPreferences:
    return _preferences


def update_preferences(preferences: CompanionPreferences) -> CompanionPreferences:
    global _preferences
    _preferences = preferences
    return _preferences


def start_session(payload: CompanionSessionRequest) -> CompanionResponse:
    session_id = str(uuid4())
    lesson_label = payload.lesson_type or "lesson"
    return CompanionResponse(
        session_id=session_id,
        message=f"Your learning companion is ready for this {lesson_label}.",
        character=CompanionCharacterInstruction(
            state="idle",
            animation="Idle",
            emotion="friendly",
        ),
        board=CompanionBoardInstruction(),
        next_action="wait",
    )


def end_session() -> CompanionResponse:
    return CompanionResponse(
        message="Companion session ended.",
        character=CompanionCharacterInstruction(
            state="idle",
            animation="Idle",
            emotion="neutral",
        ),
        board=CompanionBoardInstruction(),
        next_action="wait",
    )


def respond(payload: CompanionRespondRequest) -> CompanionResponse:
    return CompanionResponse(
        session_id=payload.session_id,
        message="I am ready to help when Phase 1 connects lesson intelligence.",
        character=CompanionCharacterInstruction(
            state="encouraging",
            animation="Encourage",
            emotion="encouraging",
        ),
        board=CompanionBoardInstruction(
            visible=False,
            mode="none",
            title=None,
            content=None,
            highlighted_index=-1,
        ),
        next_action="wait",
    )
