from abc import ABC, abstractmethod
from app.dto.group import GroupCreateDto
from app.models.group import Group
from app.models.member import Member
from app.dto.result import ResultDto
from app.models.invite import Invite
from app.dto.group import InviteDto


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
    
    
    @abstractmethod
    async def get_history(self, group_id: int) -> list[ResultDto]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def find_invite_by_id(self, id: int) -> Invite | None:
        raise NotImplementedError
    
    
    @abstractmethod
    async def create_invite(self, user_id: int, group_id: int) -> Invite:
        raise NotImplementedError
    
    
    @abstractmethod
    async def get_all_invites(self, user_id: int) -> list[InviteDto]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def delete_and_use_invite_by_id(self, id: int, group_id: int, user_id: int):
        raise NotImplementedError
    
    
    @abstractmethod
    async def delete_invite_by_id(self, id: int):
        raise NotImplementedError