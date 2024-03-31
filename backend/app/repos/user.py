from abc import ABC, abstractmethod

from app.models.user import User
from app.dto.user import UserCreateDto


class UserRepository(ABC):
    @abstractmethod
    async def create_user(self, user: UserCreateDto) -> User:
        raise NotImplementedError


    @abstractmethod
    async def change_user_name_by_id(self, user_id, name) -> User:
        raise NotImplementedError


    @abstractmethod
    async def find_user_by_email(self, email: str) -> User | None:
        raise NotImplementedError


    @abstractmethod
    async def find_user_by_id(self, id: int) -> User | None:
        raise NotImplementedError