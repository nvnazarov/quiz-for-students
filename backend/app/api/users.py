from typing import Annotated

from fastapi import APIRouter, Depends

from .dependencies import UsersServiceDep, get_current_user_id
from app.schemas.users import UserRegisterSchema, UserAuthenticateSchema

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


# TODO: do activation via email
@router.post("/activate")
def activate_user():
    pass


@router.post("/")
async def register_user(
    user: UserRegisterSchema,
    users_service: UsersServiceDep
) -> str:
    
    return await users_service.register(user)


@router.post("/auth")
async def authenticate_user(
    user: UserAuthenticateSchema,
    users_service: UsersServiceDep
) -> str:
    
    token = await users_service.authenticate(user)
    return token


@router.get("/")
async def get_current_user_data(
    user_id: Annotated[int, Depends(get_current_user_id)],
    users_service: UsersServiceDep
):
    
    return await users_service.get_user_profile(user_id) 


@router.patch("/")
async def change_name():
    pass