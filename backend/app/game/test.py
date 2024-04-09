from enum import Enum
from typing import Any
from datetime import datetime
import asyncio

from fastapi import WebSocket, WebSocketDisconnect

from app.game.game import Game
from app.dto.game import GameMemberDto
from app.repos.user import UserRepository
from app.repos.result import ResultRepository
from app.dto.result import ResultCreateDto


class TestGameState(Enum):
    LOBBY = 0
    QUESTION = 1
    RESULTS = 2
    FINISHED = 3


class QuestionType(Enum):
    SINGLE = 0
    MULTIPLE = 1


class TestGame(Game):
    _id: int
    _admin_id: int
    _group_id: int
    _quiz_id: int
    
    _user_repo: UserRepository
    _result_repo: ResultRepository
    
    _admin_socket: WebSocket = None
    _members: list[GameMemberDto] = []
    
    _state: TestGameState
    _questions: list[Any] = []
    _correct_answers: list[Any] = []
    _question_index = 0
    
    _answers = {}
    _points = {}
    
    _question_finish_time = 0
    
    
    def __init__(self,
                 id: int,
                 admin_id: int,
                 group_id: int,
                 quiz_id: int,
                 test_data: Any,
                 user_repo: UserRepository,
                 result_repo: ResultRepository,
                 ):
        self._id = id
        self._admin_id = admin_id
        self._group_id = group_id
        self._quiz_id = quiz_id
        self._user_repo = user_repo
        self._result_repo = result_repo
        self._state = TestGameState.LOBBY
        
        self._parse_test_data(test_data)


    def _parse_test_data(self, test_data: Any):
        questions = test_data["q"]
        subset = ["time", "image", "title", "points", "answers"]
        
        self._questions = [dict((k, q["data"][k]) for k in subset) for q in questions]
        for i in range(len(questions)):
            self._questions[i]["type"] = questions[i]["type"]
        
        self._correct_answers = [q["data"]["correct"] for q in questions]


    async def connect(self, user_id: int, socket: WebSocket):
        """Connect user to game.
        
        If game has started and user is not an admin,
        than he cannot connect to the game.
        """
        
        if user_id == self._admin_id:
            await self._connect_admin(user_id, socket)
            return
        
        await self._connect_member(user_id, socket)
    
    
    async def _connect_admin(self, admin_id: int, socket: WebSocket):
        self._admin_socket = socket

        try:
            await socket.accept()
            await self._send_current_state(socket)
            
            while True:
                text = await socket.receive_text()
                
                if text == "start":
                    await self._start_game()
                    continue
                
                if text == "stop":
                    await self._stop_question()
                    continue
                
                if text == "next":
                    await self._next_question()
                    continue
                
        except WebSocketDisconnect:
            pass
        except:
            await socket.close(reason="Unexpected error.");
        
        self._admin_socket = None
    
    
    async def _connect_member(self, member_id: int, socket: WebSocket):       
        db_user = await self._user_repo.find_user_by_id(member_id)
        if not db_user:
            await socket.close(reason="No such user.")
            return
            
        member = GameMemberDto(id=member_id,
                               name=db_user.name,
                               email=db_user.email,
                               socket=socket)
        
        # if self._state != TestGameState.LOBBY:
        #     await socket.close(reason="Game has started.")
        #     return
        
        # FIXME: may be we should delete previous connection instead
        # of cancelling current.
        if any(map(lambda m: m.id == member_id, self._members)):
            await socket.close(reason="You are connected.")
            return
            
        self._members.append(member)
        
        try:
            await socket.accept()
            
            message = {
                "action": "member",
                "data": {
                    "member": member.to_json(),
                },
            }
            await self._broadcast_all(message)
            await self._send_current_state(socket)
            
            while True:
                text = await socket.receive_text()
                self._handle_member_answer(member_id, text)
                
        except WebSocketDisconnect:
            pass
        except:
            await socket.close(reason="Unexpected error.");
        
        self._members.remove(member)
    
    
    async def _broadcast_all(self, json):
        for member in self._members:
            await member.socket.send_json(json)
        if self._admin_socket != None:
            await self._admin_socket.send_json(json)
    
    
    async def _start_game(self):
        if self._state == TestGameState.LOBBY:
            for member in self._members:
                self._points[member.id] = 0
            
            self._question_index = -1
            await self._next_question()
    
    
    async def _stop_question(self):
        self._state = TestGameState.RESULTS
        
        type = self.get_current_question_type()
        stats = [0 for i in range(len(self._get_current_question()["answers"]))]
        
        if type == QuestionType.SINGLE:
            for (user_id, answer) in self._answers.items():
                stats[answer] += 1
                
                if answer == self._correct_answers[self._question_index]:
                    self._points[user_id] += self._get_current_question()["points"]
                
        if type == QuestionType.MULTIPLE:
            for (user_id, answer) in self._answers.items():
                for a in answer:
                    stats[a] += 1
                
                if sorted(answer) == sorted(self._correct_answers[self._question_index]):
                    self._points[user_id] += self._get_current_question()["points"]
        
        message = {
            "state": "results",
            "data": {
                "q": self._questions[self._question_index],
                "stats": stats,
                "correct": self._correct_answers[self._question_index],
            }
        }
        await self._broadcast_all(message)
    
    
    async def _next_question(self):
        self._question_index += 1
        self._answers = {}
        
        check_game_finished = len(self._questions) == self._question_index
        if check_game_finished:
            await self._finish_game()
            return
        
        self._state = TestGameState.QUESTION
        message = {
            "state": "question",
            "data": {
                "q": self._questions[self._question_index]
            }
        }
        await self._broadcast_all(message)
        
        asyncio.get_running_loop().create_task(self._timeout(self._get_current_question()["time"], self._question_index))
    
    
    async def _timeout(self, seconds: int, question_index: int):
        await asyncio.sleep(seconds + 1)
        if self._state == TestGameState.QUESTION and self._question_index == question_index:
            await self._stop_question()
    
    
    async def _finish_game(self):
        await self._result_repo.create_result(ResultCreateDto(date=datetime.now(),
                                                              quiz_id=self._quiz_id,
                                                              group_id=self._group_id,
                                                              scores=self._points))
        
        self._state = TestGameState.FINISHED
        message = {
            "state": "finished",
            "data": {
                "group_id": self._group_id,
            }
        }
        await self._broadcast_all(message)
    
    
    def is_finished(self) -> bool:
        return self._state == TestGameState.FINISHED
    
    
    async def _send_current_state(self, socket):
        if self._state == TestGameState.LOBBY:
            message = {
                "state": "lobby",
                "data": {
                    "members": [m.to_json() for m in self._members],
                },
            }
            await socket.send_json(message)
        elif self._state == TestGameState.QUESTION:
            message = {
                "state": "question",
                "data": {
                    "q": self._questions[self._question_index],
                },
            }
            await socket.send_json(message)
        elif self._state == TestGameState.RESULTS:
            # TODO: ...
            message = {
                "state": "results",
                "data": {
                    "q": self._questions[self._question_index],
                    "stats": [0 for i in range(len(self._questions[self._question_index]["answers"]))],
                    "correct": self._correct_answers[self._question_index],
                },
            }
            await socket.send_json(message)
    
    
    def get_current_question_type(self) -> QuestionType:
        type = self._questions[self._question_index]["type"]
        
        if type == "SingleAnswer":
            return QuestionType.SINGLE
        
        return QuestionType.MULTIPLE 
    
    
    def _get_current_question(self):
        return self._questions[self._question_index]
    
    
    def _handle_member_answer(self, user_id: int, text: str):
        if user_id not in self._answers:
            try:
                type = self.get_current_question_type()
                if type == QuestionType.SINGLE:
                    self._answers[user_id] = int(text)
            
                if type == QuestionType.MULTIPLE:
                    self._answers[user_id] = list(map(int, text.split(",")))
            except:
                pass