from pydantic import BaseModel

from app.models.user import User


class UserDto(BaseModel):
    id: int
    name: str
    email: str


class UserRegisterDto(BaseModel):
    name: str
    email: str
    password: str


class UserCreateDto(BaseModel):
    name: str
    email: str
    hashed_password: str


class UserAuthDto(BaseModel):
    email: str
    password: str


class UserUpdateDto(BaseModel):
    name: str


class UserActivateDto(BaseModel):
    code: str


def to_user_dto(user: User):
    return UserDto(id=user.id,
                   name=user.name,
                   email=user.email)