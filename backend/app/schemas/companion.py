from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class CompanionPreferences(BaseModel):
    character_id: Optional[str] = None
    muted: bool = False
    text_only: bool = False
    reduced_motion: bool = False
    speech_rate: float = Field(default=0.85, ge=0.5, le=1.5)


class CompanionSessionRequest(BaseModel):
    lesson_type: Optional[str] = None
    lesson_id: Optional[str] = None


class CompanionRespondRequest(BaseModel):
    session_id: Optional[str] = None
    message: str = ""
    lesson_type: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class CompanionEndSessionRequest(BaseModel):
    session_id: Optional[str] = None


class CompanionCharacterInstruction(BaseModel):
    state: str
    animation: Optional[str] = None
    emotion: str = "neutral"


class CompanionBoardInstruction(BaseModel):
    visible: bool = False
    mode: str = "none"
    title: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    highlighted_index: int = -1


class CompanionResponse(BaseModel):
    message: str
    character: CompanionCharacterInstruction
    board: CompanionBoardInstruction
    next_action: Optional[str] = None
    session_id: Optional[str] = None
