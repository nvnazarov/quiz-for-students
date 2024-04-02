from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_quiz_service
from app.dto.quiz import QuizDataDto
from app.dto.quiz import QuizUpdateDto
from app.dto.quiz import QuizDto

router = APIRouter(prefix="/quizzes",
                   tags=["quizzes"],
                   )


@router.post("/create/test", response_model=QuizDto)
async def create_test(data: QuizDataDto,
                      user_id: int = Depends(get_current_user_id),
                      ):
    test = await get_quiz_service().create_test(user_id, data)
    return test


@router.post("/update/test")
async def update_test(data: QuizUpdateDto,
                      user_id: int = Depends(get_current_user_id),
                      ):
    await get_quiz_service().update_test(user_id, data)


@router.post("/create/quiz", response_model=QuizDto)
async def create_quiz(data: QuizDataDto,
                      user_id: int = Depends(get_current_user_id),
                      ):
    quiz = await get_quiz_service().create_quiz(user_id, data)
    return quiz


@router.post("/update/quiz")
async def update_quiz(data: QuizUpdateDto,
                      user_id: int = Depends(get_current_user_id),
                      ):
    await get_quiz_service().update_quiz(user_id, data)


@router.get("/my", response_model=list[QuizDto])
async def get_all_user_quizzes(user_id: int = Depends(get_current_user_id)):    
    quizzes = await get_quiz_service().get_all_quizzes_by_user_id(user_id)
    return quizzes


@router.get("/{id}")
async def get_quiz_data(id: int,
                        user_id: int = Depends(get_current_user_id)
                        ):
    data = await get_quiz_service().get_quiz_data_by_id(user_id, id)
    return data