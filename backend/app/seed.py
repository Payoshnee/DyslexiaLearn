from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models import LessonChunk, User


LESSON_CHUNKS = [
    {
        "title": "Breaking Long Words Into Syllables",
        "topic": "pronunciation",
        "language": "en",
        "content": (
            "For dyslexia-friendly pronunciation practice, break long words into small "
            "syllables. Say one syllable at a time, pause, then blend the whole word. "
            "Use warm encouragement and avoid rushing the learner."
        ),
    },
    {
        "title": "Pronunciation: pronunciation",
        "topic": "pronunciation",
        "language": "en",
        "content": (
            "The word pronunciation can be practiced as pro, nun, ci, a, tion. "
            "The ci sound is often tricky, so highlight it and ask the learner to repeat "
            "slowly before saying the full word."
        ),
    },
    {
        "title": "Supportive Error Feedback",
        "topic": "encouragement",
        "language": "en",
        "content": (
            "When a learner struggles, acknowledge the effort first. Then give one small "
            "next step. Example: Great try. Let us slow down and practice only this sound."
        ),
    },
    {
        "title": "Hindi English Mixed Learning",
        "topic": "translation",
        "language": "en",
        "content": (
            "If the learner uses Hindi, Hinglish, or mixed English, understand the intent, "
            "retrieve the English lesson context, and answer in simple language that matches "
            "the learner preference."
        ),
    },
]


def seed_database(db: Session) -> None:
    db.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))

    demo_user = (
        db.query(User)
        .filter(User.email == "student@dyslexialearn.com")
        .order_by(User.id.asc())
        .first()
    )
    if demo_user is None:
        db.add(
            User(
                email="student@dyslexialearn.com",
                password="password123",
                name="Demo Student",
            )
        )
    for chunk in LESSON_CHUNKS:
        existing = (
            db.query(LessonChunk)
            .filter(LessonChunk.title == chunk["title"])
            .order_by(LessonChunk.id.asc())
            .first()
        )
        if existing is None:
            db.add(LessonChunk(**chunk))
    db.commit()
