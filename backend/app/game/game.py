from abc import ABC, abstractmethod

from fastapi import WebSocket

from app.dto.game import GameMemberDto


class Game(ABC):
    @abstractmethod
    async def connect(self, user_id: int, socket: WebSocket):
        raise NotImplementedError