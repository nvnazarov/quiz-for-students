from abc import ABC, abstractmethod

from app.models.user import User
from app.schemas.users import UserCreateSchema


class AbstractUserRepository(ABC):
    @abstractmethod
    async def create_user(self, user: UserCreateSchema) -> User:
        raise NotImplementedError


    @abstractmethod
    async def get_user_by_email(self, email: str) -> User:
        raise NotImplementedError


    @abstractmethod
    async def get_user_by_id(self, id: int) -> User:
        raise NotImplementedError


    @abstractmethod
    async def get_user_profile(self, id: int):
        raise NotImplementedError