from fastapi import APIRouter, WebSocket, Depends

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_chat_service
from app.dto.chat import MessageDto

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)


@router.websocket("/ws/{group_id}/{token}")
async def connect_to_chat(group_id: int,
                          token: str,
                          socket: WebSocket):
    try:
        user_id = get_current_user_id(token)
    except Exception as e:
        return
    await get_chat_service().connect_to_group_chat(socket, group_id, user_id)


@router.get("/{group_id}/all", response_model=list[MessageDto])
async def get_all_messages(group_id: int,
                           user_id: int = Depends(get_current_user_id)):
    messages = await get_chat_service().get_all_messages(group_id, user_id)
    return messages[-5:]