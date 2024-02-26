from pydantic import BaseModel


class QuizCreateSchema:
    user_id: int
    name: str
    data: dict[str]
    
    
class QuizUpdateSchema:
    name: str
    data: dict[str]