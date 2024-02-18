from fastapi import APIRouter

router = APIRouter(
    prefix="/quizzes"
)


@router.post("/create")
def create_quiz():
    pass


@router.get("/delete")
def delete_quiz():
    pass