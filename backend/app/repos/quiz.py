from abc import ABC, abstractmethod

from app.dto.quiz import QuizCreateDto
from app.models.quiz import Quiz


class QuizRepository(ABC):
    @abstractmethod
    async def create_test(self, owner_id: int, name: str, data: dict[str]) -> Quiz:
        raise NotImplementedError
    
    
    @abstractmethod
    async def create_quiz(self, owner_id: int, name: str, data: dict[str]) -> Quiz:
        raise NotImplementedError


    @abstractmethod
    async def update_quiz(self, owner_id: int, name: str, data: dict[str]):
        raise NotImplementedError


    @abstractmethod
    async def delete_quiz(quiz_id: int):
        raise NotImplementedError