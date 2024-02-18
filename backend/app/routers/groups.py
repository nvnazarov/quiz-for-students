from fastapi import APIRouter

router = APIRouter(
    prefix="/groups"
)


@router.post("/create")
def create_group():
    pass


@router.websocket("/{id}/chat")
def connect_to_chat():
    pass