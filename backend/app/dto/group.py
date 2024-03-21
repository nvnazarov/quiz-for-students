from pydantic import BaseModel
from app.models.group import Group


class GroupDto(BaseModel):
    id: int
    name: str


class GroupCreateDto(BaseModel):
    admin_id: int
    name: str


class GroupJoinDto(BaseModel):
    user_id: int
    token: str


def to_group_dto(group: Group):
    return GroupDto(id=group.id,
                    name=group.name)