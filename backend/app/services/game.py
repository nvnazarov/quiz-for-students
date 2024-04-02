import asyncio
from enum import Enum

from fastapi import WebSocket, WebSocketDisconnect, HTTPException, status
from typing import Any

from app.dto.game import GameCreateDto
from app.dto.game import GameDto
from app.repos.group import GroupRepository
from app.repos.quiz import QuizRepository
from app.dto.game import GameMemberDto
from app.repos.user import UserRepository


class GameState(Enum):
    LOBBY = 1
    ANSWERS = 2
    RESULTS = 3
    QUESTION = 4


class Game:
    id: int
    admin_id: int
    group_id: int
    quiz_id: int
    
    _admin_socket: WebSocket = None
    _members: list[GameMemberDto] = []
    _acceptable_members_ids: list[int] = []
    _data: dict[str, Any] = []
    
    # test
    _state: GameState = GameState.LOBBY
    _current_question_index = -1
    _questions = []
    _given_answers: dict[int, int] = {}
    _results = []
    
    def __init__(self,
                 id: int,
                 admin_id: int,
                 group_id: int,
                 quiz_id: int,
                 members_ids: list[int],
                 data: dict[str, Any]):
        self.id = id
        self.admin_id = admin_id
        self.group_id = group_id
        self.quiz_id = quiz_id
        self._acceptable_members_ids = members_ids
        self._data = data
        
        # load questions
        self._questions = data["q"]
        
    
    def _get_current_state(self):
        if self._state == GameState.LOBBY:
            members = list(map(lambda m: { "id": m.id, "name": m.name, "email": m.email }, self._members))
            return {
                "state": "lobby",
                "members": members,
            }
    
    
    async def connect(self, user: GameMemberDto):
        if user.id == self.admin_id:
            await self.process_admin(user)
        elif user.id in self._acceptable_members_ids:
            await self.process_member(user)
        else:
            await user.socket.close(reason="Forbidden")

    
    def _broadcast(self, json):
        if self._admin_socket:
            self._admin_socket.send_json(json)
        for member in self._members:
            member.socket.send_json(json)
    
    
    async def _on_question_started(self):
        data = {
            "state": "question",
            "q": self._questions[self._current_question_index]
        }
        self._broadcast(data)
            
            
    async def _on_member_joined(self, member: GameMemberDto):
        data = {
            "action": "member",
            "data": {
                "id": member.id,
                "name": member.name,
                "email": member.email,
            }
        }
        self._broadcast(data)
    
    
    async def _on_stop_question(self):
        pass


    async def process_admin(self, admin: GameMemberDto):
        self._admin_socket = admin.socket
    
        try:
            await admin.socket.accept()            
            await admin.socket.send_json(self._get_current_state())
            
            while True:
                command = await admin.socket.receive_text()
                
                if command == "start":
                    if self._state == GameState.LOBBY:
                        self._current_question_index = 0
                        self._state = GameState.QUESTION
                        self._on_question_started()
                    continue
                        
                if command == "next":
                    if self._state == GameState.ANSWERS:
                        if self._current_question_index == len(self._questions) - 1:
                            pass
                        else:
                            self._current_question_index += 1
                            self._state = GameState.QUESTION
                            self._on_question_started()
                    continue
                
                if command == "stop":
                    if self._state == GameState.QUESTION:
                        self._state = GameState.ANSWERS
                        self._on_stop_question()
                    continue

                        
        except WebSocketDisconnect:
            pass
        except:
            await self._admin_socket.close()
        
        self._admin_socket = None


    async def process_member(self, member: GameMemberDto):
        self._members.append(member)
                
        try:
            await member.socket.accept()    
            await member.socket.send_json(self._get_current_state())
            
            self._on_member_joined(member)
            
            while True:
                text = await member.socket.receive_text()
                
                if (self._state == GameState.QUESTION):
                    if member.id not in self._given_answers:
                        try:
                            self._given_answers[member.id] = int(text)
                        except:
                            pass
        except WebSocketDisconnect:
            pass
        except:
            await member.socket.close()
        
        self._members.remove(member)


class GameService:
    _quiz_repo = None
    _group_repo = None
    _user_repo = None
    _games: dict[int, Game] = {}
    _id = 0


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
        
        db_quiz = await self._quiz_repo.find_quiz_by_id(dto.quiz_id)
        if not db_quiz:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz does not exist")
        
        db_members = await self._group_repo.get_group_members(dto.group_id)
        members_ids = [m.id for m in db_members]
        
        if any(map(lambda x: x[1].admin_id == user_id, self._games.items())):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Can only run one game")
        
        self._id += 1
        self._games[self._id] = Game(self._id,
                                     user_id,
                                     dto.group_id,
                                     dto.quiz_id,
                                     members_ids,
                                     db_quiz.data)
        return self._id


    async def connect(self, game_id: int, socket: WebSocket, user_id: int):
        db_user = await self._user_repo.find_user_by_id(user_id)
        
        if game_id not in self._games:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
        game = self._games[game_id]
        
        user = GameMemberDto(user_id,
                             db_user.name,
                             db_user.email,
                             socket)
        await game.connect(user)
    
    
    async def get_current_game(self, group_id: int, user_id: int) -> GameDto | None:
        for item in self._games.items():
            game = item[1]
            if game.group_id == group_id:
                db_quiz = await self._quiz_repo.find_quiz_by_id(game.quiz_id)            
                return GameDto(game_id=game.id,
                               quiz_name=db_quiz.name)
                
        return None