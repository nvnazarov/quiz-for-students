from typing import Any

from pydantic import BaseModel


class QuizCreateDto(BaseModel):
    name: str
    owner_id: int
    data: dict[str, Any]


class TestDataDto(BaseModel):
    data: dict[str, Any]


class QuizDataDto(BaseModel):
    data: dict[str, Any]