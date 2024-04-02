from sqlalchemy import select

from app.repos.chat import ChatRepository
from app.models.message import Message
from app.models.user import User
from app.db.db import async_session_maker
from app.dto.chat import MessageCreateDto
from app.dto.chat import MessageDto
from app.dto.chat import to_message_dto


class SqlChatRepository(ChatRepository):
    async def get_all_messages(self, group_id: int) -> list[MessageDto]:
        async with async_session_maker() as session:
            stmt = select(Message, User).join(User).where(Message.group_id == group_id).order_by(Message.date)
            result = await session.execute(stmt)
            return [to_message_dto(row[1], row[0]) for row in result]
    
    
    async def add_message(self, message: MessageCreateDto) -> Message:
        async with async_session_maker() as session: 
            db_message = Message(user_id=message.user_id,
                                 group_id=message.group_id,
                                 date=message.date,
                                 content=message.content,
                                 )
            
            session.add(db_message)
            await session.commit()
            await session.refresh(db_message)
        
        return db_message