from typing import Any
from pydantic import BaseModel

from app.models.quiz import Quiz


class QuizCreateDto(BaseModel):
    name: str
    owner_id: int
    data: list[dict[str, Any]]


class TestDataDto(BaseModel):
    data: list[dict[str, Any]]


class QuizDataDto(BaseModel):
    data: dict[str, Any]


class QuizDto(BaseModel):
    id: int
    name: str
    type: str


def to_quiz_dto(quiz: Quiz) -> QuizDto:
    return QuizDto(id=quiz.id,
                   name=quiz.name,
                   type=quiz.type)