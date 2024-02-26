from fastapi import APIRouter

router = APIRouter(
    prefix="/groups",
    tags=["groups"]
)


@router.post("/")
def create_group():
    pass


@router.post("/{quiz_id}")
def publish_quiz(quiz_id: int):
    pass


@router.websocket("/{id}/chat")
def connect_to_chat(id: int):
    pass