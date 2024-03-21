from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_quiz_service

router = APIRouter(prefix="/quizzes",
                   tags=["quizzes"],
                   )


@router.post("/create/test/{name}")
async def create_test(name: str, data, user_id: int = Depends(get_current_user_id)):
    await get_quiz_service().create_test(user_id, data)


@router.post("/create/quiz/{name}")
async def create_quiz(name: str, data, user_id: int = Depends(get_current_user_id)):
    await get_quiz_service().create_quiz(user_id, data)


@router.get("/")
def get_quiz_data():    
    pass


@router.delete("/")
def delete_quiz():
    pass