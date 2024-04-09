from pydantic import BaseModel
from fastapi import WebSocket


class GameCreateDto(BaseModel):
    quiz_id: int
    group_id: int


class GameDto(BaseModel):
    game_id: int
    quiz_name: str


class GameMemberDto:
    id: int
    name: str
    email: str
    socket: WebSocket
    
    def __init__(self, id: int, name: str, email: str, socket: WebSocket):
        self.id = id
        self.name = name
        self.email = email
        self.socket = socket
    
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
        }