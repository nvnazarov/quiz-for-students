from pydantic import BaseModel
from app.models.result import Result
from datetime import datetime
from typing import Any


class ResultCreateDto(BaseModel):
    date: datetime
    quiz_id: int
    group_id: int
    scores: dict[int, Any]


class ResultDto(BaseModel):
    date: datetime
    quiz_id: int
    scores: dict[str, Any]


def to_result_dto(result: Result):
    return Result(date=result.date,
                  quiz_id=result.quiz_id,
                  scores=result.scores)