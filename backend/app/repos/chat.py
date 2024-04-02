from abc import ABC, abstractmethod

from app.models.message import Message
from app.dto.chat import MessageCreateDto
from app.dto.chat import MessageDto


class ChatRepository(ABC):
    @abstractmethod
    async def get_all_messages(self, group_id: int) -> list[MessageDto]:
        raise NotImplementedError

    
    @abstractmethod
    async def add_message(self, message: MessageCreateDto) -> Message:
        raise NotImplementedError