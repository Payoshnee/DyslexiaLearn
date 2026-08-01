from __future__ import annotations

from typing import Any

import requests

from app.config import get_settings

settings = get_settings()


class LocalAIUnavailable(RuntimeError):
    pass


def ollama_embed(text: str) -> list[float]:
    try:
      response = requests.post(
          f"{settings.ollama_base_url}/api/embeddings",
          json={"model": settings.ollama_embedding_model, "prompt": text},
          timeout=30,
      )
      response.raise_for_status()
      data = response.json()
      embedding = data.get("embedding")
      if not isinstance(embedding, list):
          raise LocalAIUnavailable("Ollama did not return an embedding.")
      return [float(value) for value in embedding]
    except requests.RequestException as exc:
      raise LocalAIUnavailable(str(exc)) from exc


def ollama_chat(messages: list[dict[str, str]]) -> str:
    try:
      response = requests.post(
          f"{settings.ollama_base_url}/api/chat",
          json={
              "model": settings.ollama_chat_model,
              "messages": messages,
              "stream": False,
              "options": {
                  "temperature": 0.35,
                  "num_predict": 180,
              },
          },
          timeout=60,
      )
      response.raise_for_status()
      data: dict[str, Any] = response.json()
      content = data.get("message", {}).get("content", "")
      if not content:
          raise LocalAIUnavailable("Ollama did not return chat content.")
      return content.strip()
    except requests.RequestException as exc:
      raise LocalAIUnavailable(str(exc)) from exc
