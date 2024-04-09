from fastapi import WebSocket, HTTPException, status

from app.dto.game import GameCreateDto
from app.dto.game import GameDto
from app.repos.group import GroupRepository
from app.repos.quiz import QuizRepository
from app.repos.user import UserRepository
from app.repos.result import ResultRepository
from app.game.game import Game
from app.game.test import TestGame


class GameService:
    _quiz_repo = None
    _group_repo = None
    _user_repo = None
    _result_repo = None
    _games: dict[int, Game] = {}
    _id = 0


    def __init__(self,
                 group_repo: GroupRepository,
                 quiz_repo: QuizRepository,
                 user_repo: UserRepository,
                 result_repo: ResultRepository,
                 ):
        self._group_repo = group_repo
        self._quiz_repo = quiz_repo
        self._user_repo = user_repo
        self._result_repo = result_repo


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
        
        if db_quiz.type == "test":
            self._games[self._id] = TestGame(id=self._id,
                                             admin_id=user_id,
                                             group_id=dto.group_id,
                                             quiz_id=db_quiz.id,
                                             test_data=db_quiz.data,
                                             user_repo=self._user_repo,
                                             result_repo=self._result_repo,
                                             )
        return self._id


    async def connect(self, game_id: int, socket: WebSocket, user_id: int):
        if game_id not in self._games:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
        game = self._games[game_id]
    
        await game.connect(user_id, socket)
    
    
    def delete_game(self, game_id: int):
        # FIXME: care of exceptions
        del self._games[game_id]
 
    
    async def get_current_game(self, group_id: int, user_id: int) -> GameDto | None:
        for item in self._games.items():
            game = item[1]
            if game._group_id == group_id:
                if game.is_finished():
                    self.delete_game(item[0])
                    return None
                
                db_quiz = await self._quiz_repo.find_quiz_by_id(game._quiz_id)            
                return GameDto(game_id=item[0],
                               quiz_name=db_quiz.name)
        return None