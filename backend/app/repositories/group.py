from abc import ABC, abstractmethod
from app.schemas.group import GroupCreateSchema, GroupGetSchema
from app.models.group import Group
from app.models.member import Member


class AbstractGroupRepository(ABC):    
    @abstractmethod
    async def create_group(group: GroupCreateSchema) -> Group:
        raise NotImplementedError
    
    
    @abstractmethod
    async def get_all_groups(user_id: int) -> list[Group]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def get_all_owned_groups(admin_id: int) -> list[Group]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def get_group_members(group_id: int) -> list[Member]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def add_group_member(group_id: int, user_id: int):
        raise NotImplementedError