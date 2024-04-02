from fastapi import WebSocket, WebSocketDisconnect, HTTPException, status

from datetime import datetime

from app.repos.chat import ChatRepository
from app.dto.chat import ChatRoomMemberDto
from app.dto.chat import MessageCreateDto
from app.dto.chat import MessageDto
from app.repos.group import GroupRepository
from app.repos.user import UserRepository


class ChatRoom:
    _members: list[ChatRoomMemberDto] = []
    _chat_repo: ChatRepository
    _group_id: int = None
    
    
    def __init__(self, chat_repo: ChatRepository, group_id: int):
        self._chat_repo = chat_repo
        self._group_id = group_id
    
    
    async def _broadcast(self, json):
        for member in self._members:
            await member.socket.send_json(json)
    
    
    def _add_member(self, member: ChatRoomMemberDto):
        self._members.append(member)
    
    
    def _remove_member(self, member: ChatRoomMemberDto):
        self._members.remove(member)
    
    
    async def connect(self, member: ChatRoomMemberDto):
        await member.socket.accept()
        self._add_member(member)
        
        try:
            text = await member.socket.receive_text()
            try:
                date = datetime.now()
                message = MessageCreateDto(user_id=member.user_id,
                                           group_id=self._group_id,
                                           content=text,
                                           date=date)
                await self._chat_repo.add_message(message)
                await self._broadcast(
                    {
                        "name": member.name,
                        "content": text,
                        "date": str(date),
                    }
                )
            except Exception as e:
                await member.socket.send_json({ "what": "error" })

        except WebSocketDisconnect:
            pass
        
        self._remove_member(member)


class ChatService:
    _chat_repo = None
    _group_repo = None
    _user_repo = None
    _rooms: dict[int, ChatRoom] = {}
    
    
    def __init__(self, chat_repo: ChatRepository, group_repo: GroupRepository, user_repo: UserRepository):
        self._chat_repo = chat_repo
        self._group_repo = group_repo
        self._user_repo = user_repo
        
    
    async def get_all_messages(self, group_id: int, user_id: int) -> list[MessageDto]:
        db_group = await self._group_repo.find_by_id(group_id)
        if not db_group:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                "Group not found")
            
        members = await self._group_repo.get_group_members(group_id)
        if not db_group.admin_id == user_id and not any(map(lambda m: m.id == user_id and not m.banned, members)):
            raise HTTPException(status.HTTP_403_FORBIDDEN,
                                detail="Not a member or banned")
        
        messages = await self._chat_repo.get_all_messages(group_id)
        return messages
    
    
    async def connect_to_group_chat(self, socket: WebSocket, group_id: int, user_id: int):
        db_group = await self._group_repo.find_by_id(group_id)
        if not db_group:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                "Group not found")
            
        members = await self._group_repo.get_group_members(group_id)
        if not db_group.admin_id == user_id and not any(map(lambda m: m.id == user_id and not m.banned, members)):
            raise HTTPException(status.HTTP_403_FORBIDDEN,
                                detail="Not a member or banned")
            
        db_user = await self._user_repo.find_user_by_id(user_id)
        if not db_user:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                detail="User not found")
        
        member = ChatRoomMemberDto(user_id=user_id,
                                   name=db_user.name,
                                   socket=socket)
        
        if group_id not in self._rooms:    
            self._rooms[group_id] = ChatRoom(self._chat_repo, group_id)
        
        await self._rooms[group_id].connect(member)