from fastapi import APIRouter, WebSocket

router = APIRouter(
    prefix="/games"
)


@router.get("/{group_id}/all")
def get_all_games():
    pass


@router.get("/{id}")
def get_game_result():
    pass


@router.websocket("/{id}")
def connect_to_game(websocket: WebSocket):
    # TODO:
    # verify if user is admin or participant
    # connect to lobby / game
    # send primary data
    
    pass