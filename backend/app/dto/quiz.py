from typing import Any
from pydantic import BaseModel

from app.models.quiz import Quiz


class QuizDataDto(BaseModel):
    name: str
    data: dict[str, Any]


class QuizDto(BaseModel):
    id: int
    name: str
    type: str


class QuizCreateDto(BaseModel):
    name: str
    owner_id: int
    data: dict[str, Any]


class QuizUpdateDto(BaseModel):
    id: int
    data: dict[str, Any]


def to_quiz_dto(quiz: Quiz) -> QuizDto:
    return QuizDto(id=quiz.id,
                   name=quiz.name,
                   type=quiz.type)