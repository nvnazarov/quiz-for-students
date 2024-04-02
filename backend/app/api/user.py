from fastapi import APIRouter, Depends, BackgroundTasks

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_user_service
from app.api.dependencies import get_email_service
from app.dto.user import UserRegisterDto
from app.dto.user import UserAuthDto
from app.dto.user import UserDto
from app.dto.user import UserUpdateDto
from app.dto.user import UserActivateDto

router = APIRouter(prefix="/users",
                   tags=["users"],
                   )


@router.post("/activate/{token}")
async def activate_user(token: str):
    user_id = await get_email_service().get_user_id_from_token(token)
    await get_user_service().activate_user(user_id)


@router.post("/register")
async def register(background_tasks: BackgroundTasks,
                   data: UserRegisterDto):
    user_id = await get_user_service().register_user(data)
    background_tasks.add_task(get_email_service().send_verification_email, user_id, data.email)


@router.post("/auth")
async def auth(data: UserAuthDto) -> str:
    token = await get_user_service().auth_user(data)
    return token


@router.get("/me", response_model=UserDto)
async def get_user(user_id: int = Depends(get_current_user_id)):
    user = await get_user_service().get_user_by_id(user_id)
    return user


@router.post("/update", response_model=UserDto)
async def change_user_name(data: UserUpdateDto,
                           user_id: int = Depends(get_current_user_id)):
    user = await get_user_service().update_user_by_id(user_id, data)
    return user