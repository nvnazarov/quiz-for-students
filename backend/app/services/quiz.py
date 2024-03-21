from app.dto.quiz import QuizCreateDto
from app.repos.quiz import QuizRepository


class QuizService:
    _repo: QuizRepository = None


    def __init__(self, repo: QuizRepository):
        self._repo = repo


    async def create_test(self, owner_id: int, name: str, data: dict[str]):
        self._repo.create_test(owner_id, name, data)


    async def create_quiz(self, owner_id: int, name: str, data: dict[str]):
        self._repo.create_quiz(owner_id, name, data)