from pydantic import BaseModel


class GameCreateDto(BaseModel):
    quiz_id: int
    group_id: int


class GameDto(BaseModel):
    game_id: int
    quiz_name: str