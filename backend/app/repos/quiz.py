from abc import ABC, abstractmethod
from typing import Any

from app.dto.quiz import QuizCreateDto
from app.models.quiz import Quiz


class QuizRepository(ABC):
    @abstractmethod
    async def create_test(self, quiz: QuizCreateDto) -> Quiz:
        raise NotImplementedError
    
    
    @abstractmethod
    async def create_quiz(self, quiz: QuizCreateDto) -> Quiz:
        raise NotImplementedError
    
    
    @abstractmethod
    async def find_all_owned_by(self, user_id: int) -> list[Quiz]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def find_by_id(self, id: int) -> Quiz:
        raise NotImplemented