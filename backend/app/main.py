from typing import Any, List

import requests
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.v1.router import api_router
from app.config import get_settings
from app.database import Base, engine, get_db
from app.models import Flashcard, User
from app.schemas import (
    AIResponse,
    FlashcardCreate,
    FlashcardRead,
    FlashcardUpdate,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    RAGRequest,
    SocraticRequest,
    SynonymRequest,
)
from app.seed import seed_database

settings = get_settings()

app = FastAPI(title="DyslexiLearn Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/")
def home() -> str:
    return "Welcome to DyslexiLearn!"


@app.get("/health")
def health_check() -> str:
    return "Server is running!"


@app.get("/api/test/db")
def test_db_connection(db: Session = Depends(get_db)) -> str:
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {exc}",
        ) from exc
    return "Database connection successful!"


@app.post(
    "/api/auth/login",
    response_model=LoginResponse,
    responses={401: {"model": MessageResponse}},
)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .order_by(User.id.asc())
        .first()
    )

    if user and user.password == payload.password:
        return LoginResponse(
            message="Login successful",
            name=user.name,
            email=user.email,
        )

    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"message": "Invalid email or password"},
    )


@app.post("/api/flashcards", response_model=FlashcardRead)
def create_flashcard(
    payload: FlashcardCreate,
    db: Session = Depends(get_db),
) -> Flashcard:
    flashcard = Flashcard(
        term=payload.term,
        definition=payload.definition,
        score=payload.score or 0,
    )
    db.add(flashcard)
    db.commit()
    db.refresh(flashcard)
    return flashcard


@app.get("/api/flashcards", response_model=list[FlashcardRead])
def get_all_flashcards(db: Session = Depends(get_db)) -> List[Flashcard]:
    return db.query(Flashcard).order_by(Flashcard.id.asc()).all()


@app.put("/api/flashcards/{flashcard_id}", response_model=FlashcardRead)
def update_flashcard(
    flashcard_id: int,
    payload: FlashcardUpdate,
    db: Session = Depends(get_db),
) -> Flashcard:
    flashcard = db.get(Flashcard, flashcard_id)
    if flashcard is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard not found")

    flashcard.term = payload.term
    flashcard.definition = payload.definition
    flashcard.score = payload.score or 0
    db.commit()
    db.refresh(flashcard)
    return flashcard


@app.delete("/api/flashcards/{flashcard_id}")
def delete_flashcard(flashcard_id: int, db: Session = Depends(get_db)) -> str:
    flashcard = db.get(Flashcard, flashcard_id)
    if flashcard is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard not found")

    db.delete(flashcard)
    db.commit()
    return "Flashcard deleted successfully!"


def post_to_ai(endpoint: str, payload: dict[str, Any]) -> dict[str, Any]:
    request_payload = {key: value for key, value in payload.items() if value is not None}
    try:
        response = requests.post(
            f"{settings.ai_service_url}{endpoint}",
            json=request_payload,
            timeout=120,
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error communicating with AI service: {exc}",
        ) from exc


@app.post("/api/ai/rag/ask", response_model=AIResponse)
def ask_rag(payload: RAGRequest) -> AIResponse:
    ai_result = post_to_ai("/api/rag/ask", payload.model_dump())
    return AIResponse(answer=ai_result.get("answer") or ai_result.get("response", ""))


@app.post("/api/ai/synonym", response_model=AIResponse)
def get_synonym(payload: SynonymRequest) -> AIResponse:
    ai_result = post_to_ai("/api/features/synonym", payload.model_dump())
    return AIResponse(response=ai_result.get("response") or ai_result.get("answer", ""))


@app.post("/api/ai/socratic", response_model=AIResponse)
def socratic_tutor(payload: SocraticRequest) -> AIResponse:
    ai_result = post_to_ai("/api/features/socratic", payload.model_dump())
    return AIResponse(response=ai_result.get("response") or ai_result.get("answer", ""))
