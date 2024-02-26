from fastapi import APIRouter

router = APIRouter(
    prefix="/quizzes",
    tags=["quizzes"]
)


@router.post("/")
def create_quiz():
    pass


@router.get("/")
def get_quiz_data():    
    pass


@router.delete("/")
def delete_quiz():
    pass