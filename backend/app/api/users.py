from typing import Annotated

from fastapi import APIRouter, Depends

from .dependencies import UsersServiceDependency, get_current_user_id
from app.schemas.users import UserRegisterSchema, UserAuthenticateSchema

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


# TODO: do activation via email
@router.post("/activate")
def activate_user():
    pass


@router.post("/register")
async def register_user(
    user: UserRegisterSchema,
    users_service: UsersServiceDependency
) -> str:
    
    return await users_service.register(user)


@router.post("/login")
async def authenticate_user(
    user: UserAuthenticateSchema,
    users_service: UsersServiceDependency
) -> str:
    
    token = await users_service.authenticate(user)
    return token


@router.get("/me")
async def get_user_info(
    users_service: UsersServiceDependency,
    user_id: int = Depends(get_current_user_id),
):
    
    info = await users_service.get_user_info(user_id)
    return info
    

@router.patch("/")
async def change_name():
    pass