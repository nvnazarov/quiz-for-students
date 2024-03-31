from fastapi import WebSocket, WebSocketDisconnect, HTTPException, status
import asyncio
from typing import Any


from app.dto.game import GameCreateDto
from app.dto.game import GameDto
from app.repos.group import GroupRepository
from app.repos.quiz import QuizRepository
from app.dto.game import GameMemberDto
from app.repos.user import UserRepository


class Game:
    id: int
    admin_id: int
    group_id: int
    quiz_id: int
    
    _admin_socket: WebSocket = None
    _members: list[GameMemberDto] = []
    _members_sockets: list[WebSocket] = []
    _acceptable_members_ids: list[int] = []
    _questions: list[dict[str, Any]] = []
    
    
    def __init__(self,
                 id: int,
                 admin_id: int,
                 group_id: int,
                 quiz_id: int,
                 members_ids: list[int],
                 questions: list[dict[str, Any]]):
        self.id = id
        self.admin_id = admin_id
        self.group_id = group_id
        self.quiz_id = quiz_id
        self._acceptable_members_ids = members_ids
        self._questions = questions
    
    
    def get_state(self):
        return {
            "members": list(map(lambda m: { "id": m.id, "email": m.email, "name": m.name }, self._members)),
        }
    
    
    async def connect(self, user: GameMemberDto):
        if user.id == self.admin_id:
            await self.process_admin(user)
        elif user.id in self._acceptable_members_ids:
            if not any(map(lambda member: member.id == user.id, self._members)):
                self._members.append(user)
            await self.process_member(user)
        else:
            await user.socket.close(reason="Forbidden")


    async def process_admin(self, admin: GameMemberDto):
        self._admin_socket = admin.socket
        await admin.socket.accept()
        
        try:
            state = self.get_state()
            await admin.socket.send_json(state)
            
            while True:
                text = await admin.socket.receive_text()
                # do something
        except WebSocketDisconnect:
            pass
        
        await admin.socket.close()
        self._admin_socket = None


    async def process_member(self, member: GameMemberDto):
        self._members_sockets.append(member.socket)
        await member.socket.accept()
        
        try:
            state = self.get_state()
            await member.socket.send_json(state)
            
            while True:
                text = await member.socket.receive_text()
                # do something
        except WebSocketDisconnect:
            pass
        
        await member.socket.close()
        self._members_sockets.remove(member.socket)


class GameService:
    _quiz_repo = None
    _group_repo = None
    _user_repo = None
    _running_games: list[Game] = []   


    def __init__(self,
                 group_repo: GroupRepository,
                 quiz_repo: QuizRepository,
                 user_repo: UserRepository):
        self._group_repo = group_repo
        self._quiz_repo = quiz_repo
        self._user_repo = user_repo


    async def create_game(self, dto: GameCreateDto, user_id: int):
        db_group = await self._group_repo.find_by_id(dto.group_id)
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
        
        if db_group.admin_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin")

        # FIXME: I am not sure if this code is thread safe,
        # but python does not have multithreading, right?
        
        if any(map(lambda x: x.admin_id == user_id, self._running_games)):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Can only run one game")
        
        members = await self._group_repo.get_group_members(dto.group_id)
        members_ids = [m.id for m in members]
        
        db_quiz = await self._quiz_repo.find_by_id(dto.quiz_id)
        if not db_quiz:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz does not exist")
        
        questions = db_quiz.data
        id = len(self._running_games)
        self._running_games.append(Game(id,
                                        user_id,
                                        dto.group_id,
                                        dto.quiz_id,
                                        members_ids,
                                        questions))
        return id


    async def connect(self, game_id: int, socket: WebSocket, user_id: int):
        if game_id < 0 or game_id >= len(self._running_games):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
        
        game = self._running_games[game_id]
        
        db_user = await self._user_repo.find_by_id(user_id)
        user = GameMemberDto(user_id,
                             db_user.name,
                             db_user.email,
                             socket)
        await game.connect(user)
    
    
    async def get_current_game(self, group_id: int, user_id: int) -> GameDto | None:
        games = list(filter(lambda g: g.group_id == group_id, self._running_games))
        if len(games) == 0:
            return None
        
        game = games[0]
        db_quiz = await self._quiz_repo.find_by_id(game.quiz_id)
        
        # FIXME: here (after await) game could be ended, but we
        # still return it. It is not bad (and, tbh, happens rarely),
        # but can be inconvenient.
        
        return GameDto(game_id=game.id,
                       quiz_name=db_quiz.name)