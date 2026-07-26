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
    ai_service_url: str = "http://localhost:8000"
    frontend_allowed_origins: str = "http://localhost:3000"
    companion_enabled: bool = True
    companion_default_character: str = "default"

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
