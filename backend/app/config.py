from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DyslexiLearn"
    port: int = 8080
    database_url: str = "postgresql+psycopg://admin:password123@localhost:5432/dyslexialearn"
    db_url: Optional[str] = None
    db_username: str = "admin"
    db_password: str = "password123"
    frontend_allowed_origins: str = (
        "http://localhost:3000,"
        "http://127.0.0.1:3000,"
        "http://localhost:3001,"
        "http://127.0.0.1:3001,"
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "http://localhost:5174,"
        "http://127.0.0.1:5174"
    )
    companion_enabled: bool = True
    companion_default_character: str = "default"
    ollama_base_url: str = "http://localhost:11434"
    ollama_api_key: str = ""
    ollama_chat_model: str = "qwen2.5vl:3b"
    ollama_embedding_model: str = "nomic-embed-text:latest"
    ollama_keep_alive: str = "10m"
    rag_top_k: int = 4
    tts_engine: str = "piper"
    piper_binary_path: str = "piper"
    piper_voice_dir: str = "tts/voices"
    piper_voice_nova: str = "en_US-lessac-medium.onnx"
    piper_voice_luna: str = "en_US-amy-medium.onnx"
    piper_voice_bob: str = "en_US-ryan-medium.onnx"
    piper_voice_leo: str = "en_GB-alan-medium.onnx"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.db_url:
            if self.db_url.startswith("jdbc:postgresql://"):
                host_and_db = self.db_url.removeprefix("jdbc:postgresql://")
                return f"postgresql+psycopg://{self.db_username}:{self.db_password}@{host_and_db}"
            if self.db_url.startswith("postgresql://"):
                return self.db_url.replace("postgresql://", "postgresql+psycopg://", 1)
            return self.db_url
        return self.database_url

    @property
    def cors_origins(self) -> List[str]:
        return [
            origin.strip()
            for origin in self.frontend_allowed_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
