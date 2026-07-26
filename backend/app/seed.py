from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models import User


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
    db.commit()
