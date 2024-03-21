from pydantic import BaseModel
from app.models.member import Member
from app.models.user import User


class MemberDto(BaseModel):
    id: int
    name: str
    email: str
    banned: bool | None = None


class MemberOnlyDto(BaseModel):
    id: int
    banned: bool | None = None


def to_member_dto(user: User, member: Member) -> MemberDto:
    return MemberDto(id=user.id,
                     name=user.name,
                     email=user.email,
                     banned=member.banned)


def to_member_only_dto(member: Member) -> MemberOnlyDto:
    return MemberOnlyDto(id=member.user_id,
                         banned=member.banned)