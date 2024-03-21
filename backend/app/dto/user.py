from pydantic import BaseModel

from app.models.user import User


class UserDto(BaseModel):
    id: int
    name: str
    email: str


class UserCreateDto(BaseModel):
    name: str
    email: str
    password: str


class UserAuthDto(BaseModel):
    email: str
    password: str


class UserBanDto(BaseModel):
    id: int


class UserUnbanDto(BaseModel):
    id: int


def to_user_dto(user: User):
    return UserDto(id=user.id,
                   name=user.name,
                   email=user.email)