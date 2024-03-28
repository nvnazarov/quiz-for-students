from fastapi import APIRouter, WebSocket, Depends

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_game_service
from app.dto.game import GameCreateDto
from app.dto.game import GameDto

router = APIRouter(
    prefix="/games"
)


@router.post("/create")
async def create_game(dto: GameCreateDto,
                     user_id: int = Depends(get_current_user_id)
                     ):
    game_id = await get_game_service().create_game(dto, user_id)
    return game_id


@router.websocket("/ws/{game_id}")
async def connect_to_game(game_id: int,
                          websocket: WebSocket,
                          user_id: int = Depends(get_current_user_id),
                          ):
    
    await get_game_service().connect(game_id, websocket, user_id)


@router.get("/{group_id}", response_model=GameDto | None)
async def get_current_game(group_id: int,
                           user_id: int = Depends(get_current_user_id)
                           ):
    
    game = await get_game_service().get_current_game(group_id, user_id)
    return game