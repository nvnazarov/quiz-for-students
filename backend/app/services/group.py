from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, DBAPIError

from app.security.token import TokenContext
from app.repos.group import GroupRepository
from app.repos.user import UserRepository
from app.dto.group import GroupCreateDto, GroupDto, GroupJoinDto, InviteDto, to_group_dto
from app.dto.member import MemberDto, MemberOnlyDto, to_member_only_dto
from app.dto.result import ResultDto
from app.repos.result import ResultRepository


class GroupService:
    _repo: GroupRepository = None
    _user_repo: UserRepository = None
    _result_repo: ResultRepository = None
    _token_context: TokenContext = None


    def __init__(self,
                 repo: GroupRepository,
                 user_repo: UserRepository,
                 result_repo: ResultRepository,
                 token_context: TokenContext,
                 ):
        self._repo = repo
        self._user_repo = user_repo
        self._token_context = token_context
        self._result_repo = result_repo


    async def create_group(self, group: GroupCreateDto) -> GroupDto:
        try:
            db_group = await self._repo.create_group(group)
        except IntegrityError as e:
            # FIXME: it may happen than user id can be retrieved from token,
            # but it actually does not exist in database. Then, Integrity error
            # will occur, but it is not that group exists, it is that user does
            # not exist.
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="group exists")
        except DBAPIError:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Group name is too long")
        
        return to_group_dto(db_group)


    async def get_all_groups(self, user_id: int) -> list[GroupDto]:
        groups = await self._repo.get_all_groups(user_id)
        return list(map(to_group_dto, groups))


    async def get_all_owned_groups(self, admin_id: int) -> list[GroupDto]:
        groups = await self._repo.get_all_owned_groups(admin_id)
        return list(map(to_group_dto, groups))


    async def get_members(self, user_id: int, group_id: int) -> list[MemberDto]:
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group not found")
        
        members = await self._repo.get_group_members(group_id)
        
        if db_group.admin_id == user_id:
            return members
        
        if not any(map(lambda m: m.id == user_id and not m.banned, members)):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="not a member or banned")
        
        # Return all not banned members.
        members = list(filter(lambda m: not m.banned, members))
        return members


    async def join_group_by_token(self, dto: GroupJoinDto):
        try:
            payload = self._token_context.decode(dto.token)
        except:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="invalid token")
            
        group_id = int(payload["sub"])
        
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group does not exist") 
        
        if db_group.admin_id == dto.user_id:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="admin cannot join his group")
        
        try:
            await self._repo.add_group_member(group_id, dto.user_id)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT)


    async def get_group_info(self, group_id: int, user_id: int) -> GroupDto:
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group does not exist")
        
        return to_group_dto(db_group)


    async def get_group_token(self, group_id: int, admin_id: int) -> str:
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group not found")
        
        if db_group.admin_id != admin_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="not an admin")
        
        return self._token_context.encode({ "sub": str(group_id) })


    async def get_history(self, group_id: int, user_id: int) -> list[ResultDto]:
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group not found")
        
        members = await self._repo.get_group_members(group_id)
        
        if db_group.admin_id != user_id and not any(map(lambda m: m.id == user_id and not m.banned, members)):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="not a member or banned")
        
        history = await self._result_repo.get_results(group_id)
        return history


    async def join_group_by_invite(self, invite_id: int, user_id: int):
        db_invite = await self._repo.find_invite_by_id(invite_id)
        if not db_invite:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Invite does not exist")
        
        if db_invite.user_id != user_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN,
                                "Invite user is not you")
        
        try:
            await self._repo.delete_and_use_invite_by_id(invite_id, db_invite.group_id, user_id)
        except IntegrityError:
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "User already in group")


    async def invite_user(self, group_id: int, admin_id: int, email: str):
        db_group = await self._repo.find_by_id(group_id)
        if not db_group:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Group not found")
        
        if db_group.admin_id != admin_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN,
                                "Not an admin")
        
        db_user = await self._user_repo.find_user_by_email(email)
        if not db_user:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "User not found")
        
        if db_user.id == admin_id:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Cannot invite yourself")
        
        try:
            await self._repo.create_invite(db_user.id, group_id)
        except IntegrityError:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "User is already invited")


    async def get_all_invites(self, user_id: int) -> list[InviteDto]:
        invites = await self._repo.get_all_invites(user_id)
        return invites


    async def cancel_invite_by_id(self, id: int, user_id: int):
        db_invite = await self._repo.find_invite_by_id(id)
        if db_invite.user_id != user_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN,
                                "Not your invite")
        await self._repo.delete_invite_by_id(id)


    async def ban_user(self, group_id: int, user_id: int, admin_id: int) -> MemberOnlyDto:
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group not found")
        
        if db_group.admin_id != admin_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="not an admin")
        
        db_member = await self._repo.ban(group_id, user_id)
        
        if not db_member:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
        
        return to_member_only_dto(db_member)


    async def unban_user(self, group_id: int, user_id: int, admin_id: int) -> MemberOnlyDto:
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group not found")
        
        if db_group.admin_id != admin_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="not an admin")
        
        db_member = await self._repo.unban(group_id, user_id)
        
        if not db_member:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
        
        return to_member_only_dto(db_member)