from abc import ABC, abstractmethod
from app.dto.group import GroupCreateDto
from app.models.group import Group
from app.models.member import Member


class GroupRepository(ABC):    
    @abstractmethod
    async def create_group(self, group: GroupCreateDto) -> Group:
        raise NotImplementedError
    
    
    @abstractmethod
    async def get_all_groups(self, user_id: int) -> list[Group]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def get_all_owned_groups(self, admin_id: int) -> list[Group]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def get_group_members(self, group_id: int) -> list[Member]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def add_group_member(self, group_id: int, user_id: int):
        raise NotImplementedError
    
    
    @abstractmethod
    async def ban(self, group_id: int, user_id: int):
        raise NotImplementedError
    
    
    @abstractmethod
    async def unban(self, group_id: int, user_id: int):
        raise NotImplementedError
    
    
    @abstractmethod
    async def find_by_id(self, group_id: int) -> Group | None:
        raise NotImplementedError