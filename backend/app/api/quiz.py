from fastapi import APIRouter, Depends, Response, status

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_quiz_service
from app.dto.quiz import QuizDataDto
from app.dto.quiz import TestDataDto
from app.dto.quiz import QuizDto

router = APIRouter(prefix="/quizzes",
                   tags=["quizzes"],
                   )


@router.post("/create/test/{name}")
async def create_test(name: str,
                      data: TestDataDto,
                      user_id: int = Depends(get_current_user_id)
                      ):
    await get_quiz_service().create_test(user_id, name, data)
    return Response(status_code=status.HTTP_200_OK)


@router.post("/create/quiz/{name}")
async def create_quiz(name: str,
                      data: QuizDataDto,
                      user_id: int = Depends(get_current_user_id)
                      ):
    await get_quiz_service().create_quiz(user_id, name, data)


@router.get("/my", response_model=list[QuizDto])
async def get_all_quizzes(user_id: int = Depends(get_current_user_id)):    
    quizzes = await get_quiz_service().get_all_quizzes(user_id)
    return quizzes