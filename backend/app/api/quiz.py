from fastapi import APIRouter, Depends, Response, status

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_quiz_service
from app.dto.quiz import QuizDataDto
from app.dto.quiz import TestDataDto
from app.dto.quiz import QuizDto

router = APIRouter(prefix="/quizzes",
                   tags=["quizzes"],
                   )


@router.post("/create/test", response_model=QuizDto)
async def create_test(data: TestDataDto,
                      user_id: int = Depends(get_current_user_id),
                      ):
    test = await get_quiz_service().create_test(user_id, data)
    return test


@router.post("/create/quiz", response_model=QuizDto)
async def create_quiz(data: QuizDataDto,
                      user_id: int = Depends(get_current_user_id),
                      ):
    quiz = await get_quiz_service().create_quiz(user_id, data)
    return quiz


@router.get("/my", response_model=list[QuizDto])
async def get_all_user_quizzes(user_id: int = Depends(get_current_user_id)):    
    quizzes = await get_quiz_service().get_all_quizzes_by_user_id(user_id)
    return quizzes