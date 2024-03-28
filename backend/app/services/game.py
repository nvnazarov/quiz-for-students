from fastapi import WebSocket, WebSocketDisconnect, HTTPException, status

from app.dto.game import GameCreateDto
from app.dto.game import GameDto
from app.repos.group import GroupRepository
from app.repos.quiz import QuizRepository


class Game:
    id: int
    admin_id: int
    group_id: int
    quiz_id: int
    members: list[WebSocket]
    admin: WebSocket
    _members_ids: list[int]
    
    
    def __init__(self,
                 id: int,
                 admin_id: int,
                 group_id: int,
                 quiz_id: int,
                 members_ids: list[int]):
        self.id = id
        self.admin_id = admin_id
        self.group_id = group_id
        self.quiz_id = quiz_id
        self._members_ids = members_ids
    
    
    async def start():
        pass
    
    
    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        
        if user_id not in self._members_ids:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Not a member")
        
        if user_id == self.admin_id:
            pass
        else:
            text = await websocket.receive_text();
            print(text)


class GameService:
    _quiz_repo = None
    _group_repo = None
    _running_games: list[Game] = []   


    def __init__(self, group_repo: GroupRepository, quiz_repo: QuizRepository):
        self._group_repo = group_repo
        self._quiz_repo = quiz_repo


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

        id = len(self._running_games)
        self._running_games.append(Game(id,
                                        user_id,
                                        dto.group_id,
                                        dto.quiz_id,
                                        members_ids))
        return id


    async def connect(self, game_id: int, websocket: WebSocket, user_id: int):
        if game_id < 0 or game_id >= len(self._running_games):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
        
        game = self._running_games[game_id]
        await game.connect(websocket, user_id)
    
    
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