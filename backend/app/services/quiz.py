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


    async def create_test(self,
                          owner_id: int,
                          name: str,
                          dto: TestDataDto):
        try:
            await self._repo.create_test(QuizCreateDto(name=name,
                                                       owner_id=owner_id,
                                                       data=dto.data)
                                         )
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="name occupied")


    async def create_quiz(self,
                          owner_id: int,
                          name: str,
                          data: QuizDataDto):
        try:
            await self._repo.create_quiz(QuizCreateDto(name=name,
                                                       owner_id=owner_id,
                                                       data=data.data)
                                         )
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="name occupied")
    
    
    async def get_all_quizzes(self, user_id: int) -> list[QuizDto]:
        quizzes = await self._repo.find_all_owned_by(user_id)
        return [to_quiz_dto(quiz) for quiz in quizzes]