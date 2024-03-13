from abc import ABC, abstractmethod
from app.schemas.result import DBResultCreateSchema


class ResultRepository(ABC):
    @abstractmethod
    def get_results():
        pass
    
    
    @abstractmethod
    def create_result(result: DBResultCreateSchema):
        pass