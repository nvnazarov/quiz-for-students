from pydantic import BaseModel

from app.models.group import Group
from app.models.invite import Invite


class GroupDto(BaseModel):
    id: int
    name: str


class GroupCreateDto(BaseModel):
    admin_id: int
    name: str


class GroupJoinDto(BaseModel):
    user_id: int
    token: str


class InviteDto(BaseModel):
    id: int
    group_name: str


def to_group_dto(group: Group):
    return GroupDto(id=group.id,
                    name=group.name)


def to_invite_dto(invite: Invite, group: Group):
    return InviteDto(id=invite.id,
                     group_name=group.name)