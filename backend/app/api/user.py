from fastapi import APIRouter, Depends

from .dependencies import get_current_user_id, get_user_service
from app.dto.user import UserCreateDto, UserAuthDto, UserDto

router = APIRouter(prefix="/users",
                   tags=["users"],
                   )


@router.post("/activate")
def activate_user():
    pass


@router.post("/register")
async def register(user: UserCreateDto) -> str:
    return await get_user_service().register(user)


@router.post("/login")
async def auth(user: UserAuthDto) -> str:
    token = await get_user_service().auth(user)
    return token


@router.get("/me", response_model=UserDto)
async def get_user(user_id: int = Depends(get_current_user_id)):
    user = await get_user_service().get_user_by_id(user_id)
    return user


@router.post("/name/{name}", response_model=UserDto)
async def change_name(name: str, user_id: int = Depends(get_current_user_id)):
    user = await get_user_service().change_name(user_id, name)
    return user