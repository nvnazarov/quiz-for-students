from datetime import datetime

from fastapi import WebSocket
from pydantic import BaseModel

from app.models.message import Message
from app.models.user import User


class MessageCreateDto(BaseModel):
    user_id: int
    group_id: int
    content: str
    date: datetime


class ChatRoomMemberDto:
    user_id: int
    name: str
    socket: WebSocket
    
    def __init__(self, user_id: int, name: str, socket: WebSocket):
        self.name = name
        self.socket = socket
        self.user_id = user_id


class MessageDto(BaseModel):
    name: str
    content: str
    date: datetime


def to_message_dto(user: User, message: Message) -> MessageDto:
    return MessageDto(name=user.name,
                      content=message.content,
                      date=message.date,
                      )