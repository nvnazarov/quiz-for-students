from abc import ABC, abstractmethod
from typing import Any

from app.dto.quiz import QuizCreateDto
from app.dto.quiz import QuizUpdateDto
from app.models.quiz import Quiz


class QuizRepository(ABC):
    @abstractmethod
    async def create_test(self, quiz: QuizCreateDto) -> Quiz:
        raise NotImplementedError
    
    
    @abstractmethod
    async def create_quiz(self, quiz: QuizCreateDto) -> Quiz:
        raise NotImplementedError
    
    
    @abstractmethod
    async def update_test(self, user_id: int, quiz: QuizUpdateDto) -> Quiz:
        raise NotImplementedError
    
    
    @abstractmethod
    async def update_quiz(self, user_id: int, quiz: QuizUpdateDto) -> Quiz:
        raise NotImplementedError
    
    
    @abstractmethod
    async def find_all_quizzes_by_user_id(self, user_id: int) -> list[Quiz]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def find_quiz_by_id(self, id: int) -> Quiz:
        raise NotImplementedError