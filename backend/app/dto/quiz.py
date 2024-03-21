from typing import Any

from pydantic import BaseModel


class QuizCreateDto:
    name: str
    owner_id: int
    data: dict[str, Any]