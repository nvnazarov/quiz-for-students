from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_quiz_service
from app.dto.quiz import QuizDataDto
from app.dto.quiz import TestDataDto

router = APIRouter(prefix="/quizzes",
                   tags=["quizzes"],
                   )


@router.post("/create/test/{name}")
async def create_test(name: str, data: TestDataDto, user_id: int = Depends(get_current_user_id)):
    await get_quiz_service().create_test(user_id, name, data)


@router.post("/create/quiz/{name}")
async def create_quiz(name: str, data: QuizDataDto, user_id: int = Depends(get_current_user_id)):
    await get_quiz_service().create_quiz(user_id, name, data)


@router.get("/")
def get_quiz_data():    
    pass


@router.delete("/")
def delete_quiz():
    pass