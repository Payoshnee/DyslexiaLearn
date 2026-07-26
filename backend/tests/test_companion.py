from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_preferences_endpoint_returns_defaults():
    response = client.get("/api/v1/companion/preferences")

    assert response.status_code == 200
    data = response.json()
    assert data["character_id"] == "default"
    assert data["muted"] is False
    assert data["text_only"] is False
    assert data["reduced_motion"] is False
    assert data["speech_rate"] == 0.85


def test_companion_session_response_matches_schema():
    response = client.post(
        "/api/v1/companion/sessions",
        json={"lesson_type": "pronunciation", "lesson_id": "demo"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Your learning companion is ready for this pronunciation."
    assert data["character"] == {
        "state": "idle",
        "animation": "Idle",
        "emotion": "friendly",
    }
    assert data["board"]["visible"] is False
    assert data["board"]["mode"] == "none"
    assert data["next_action"] == "wait"
    assert data["session_id"]


def test_invalid_preferences_are_rejected():
    response = client.put(
        "/api/v1/companion/preferences",
        json={
            "character_id": "default",
            "muted": False,
            "text_only": False,
            "reduced_motion": False,
            "speech_rate": 5,
        },
    )

    assert response.status_code == 422


def test_companion_routes_follow_current_no_auth_convention():
    response = client.post("/api/v1/companion/respond", json={"message": "hello"})

    assert response.status_code == 200
    assert response.json()["character"]["state"] == "encouraging"
