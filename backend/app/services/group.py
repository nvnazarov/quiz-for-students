from app.repositories.group import AbstractGroupRepository
from app.schemas.group import GroupCreateSchema
from app.models.group import Group
from app.models.member import Member
from app.services.util.jwt import JWTContext, get_expire_time


class GroupService:
    def __init__(self, repository: AbstractGroupRepository):
        self.repository = repository
        self.token_context = JWTContext("fff", "HS256")
    
    
    async def create_group(self, group: GroupCreateSchema) -> int:
        db_group = await self.repository.create_group(group)
        return db_group.id
        
        
    async def get_all_groups(self, user_id: int) -> list[Group]:
        groups = await self.repository.get_all_groups(user_id)
        return groups
    
    
    async def get_all_owned_groups(self, admin_id: int) -> list[Group]:
        groups = await self.repository.get_all_owned_groups(admin_id)
        return groups
        

    async def get_members(self, group_id: int) -> list[Member]:
        members = self.repository.get_group_members(group_id)
        return members


    async def join_group_by_token(self, user_id: int, token: str):
        try:
            payload = self.token_context.decode(token)
        except:
            ...
            
        group_id = int(payload["sub"])
        await self.repository.add_group_member(group_id, user_id)
        
        
    async def get_group_token(self, group_id: int):
        return self.token_context.encode({
                "sub": str(group_id),
                "exp": get_expire_time(30)
            })