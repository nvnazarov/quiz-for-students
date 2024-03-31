from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.dto.quiz import TestDataDto
from app.dto.quiz import QuizDataDto
from app.dto.quiz import QuizCreateDto
from app.dto.quiz import QuizDto
from app.dto.quiz import to_quiz_dto
from app.repos.quiz import QuizRepository


class QuizService:
    _repo: QuizRepository = None


    def __init__(self, repo: QuizRepository):
        self._repo = repo


    async def create_test(self, user_id: int, data: TestDataDto) -> QuizDto:
        try:
            test_create = QuizCreateDto(name=data.name,
                                        owner_id=user_id,
                                        data=data.data)
            db_quiz = await self._repo.create_test(test_create)
        except IntegrityError:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Name is occupied")
        
        return to_quiz_dto(db_quiz)


    async def create_quiz(self, user_id: int, data: QuizDataDto) -> QuizDto:
        try:
            quiz_create = QuizCreateDto(name=data.name,
                                        owner_id=user_id,
                                        data=data.data)
            db_quiz = await self._repo.create_quiz(quiz_create)
        except IntegrityError:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Name is occupied")
            
        return to_quiz_dto(db_quiz)
    
    
    async def get_all_quizzes_by_user_id(self, id: int) -> list[QuizDto]:
        quizzes = await self._repo.find_all_quizzes_by_user_id(id)
        return [to_quiz_dto(quiz) for quiz in quizzes]