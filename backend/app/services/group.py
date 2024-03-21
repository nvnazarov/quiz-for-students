from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.security.token import TokenContext
from app.repos.group import GroupRepository
from app.dto.group import GroupCreateDto
from app.dto.group import GroupDto
from app.dto.group import GroupJoinDto
from app.dto.group import to_group_dto
from app.dto.member import MemberDto
from app.dto.member import MemberOnlyDto
from app.dto.member import to_member_only_dto
from app.models.group import Group
from app.models.member import Member


class GroupService:
    _repo: GroupRepository = None
    _token_context: TokenContext = None 


    def __init__(self, repo: GroupRepository, token_context: TokenContext):
        self._repo = repo
        self._token_context = token_context


    async def create_group(self, group: GroupCreateDto) -> GroupDto:
        try:
            db_group = await self._repo.create_group(group)
        except IntegrityError as e:
            # FIXME: it may happen than user id can be retrieved from token,
            # but it actually does not exist in database. Then, Integrity error
            # will occur, but it is not that group exists, it is that user does
            # not exist.
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="group exists")
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="admin cannot join his group")
        
        await self._repo.add_group_member(group_id, dto.user_id)


    async def get_group_name(self, group_id: int):
        db_group = await self._repo.get_group_by_id(group_id)
        return db_group.name


    async def get_group_token(self, group_id: int, admin_id: int) -> str:
        db_group = await self._repo.find_by_id(group_id)
        
        if not db_group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group not found")
        
        if db_group.admin_id != admin_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="not an admin")
        
        return self._token_context.encode({ "sub": str(group_id) })


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