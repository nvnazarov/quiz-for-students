from abc import ABC, abstractmethod

from app.schemas.quizzes import QuizCreateSchema, QuizUpdateSchema, QuizDeleteSchema
from app.models.quiz import Quiz


class AbstractQuizzesRepository(ABC):
    """Repository to work with quizzes."""


    @abstractmethod
    async def create_quiz(quiz: QuizCreateSchema) -> Quiz:
        raise NotImplementedError


    @abstractmethod
    async def update_quiz(quiz: QuizUpdateSchema):
        raise NotImplementedError


    @abstractmethod
    async def delete_quiz(quiz: QuizDeleteSchema):
        raise NotImplementedError