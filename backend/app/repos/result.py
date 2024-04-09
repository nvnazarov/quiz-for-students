from abc import ABC, abstractmethod

from app.dto.result import ResultDto, ResultCreateDto


class ResultRepository(ABC):
    @abstractmethod
    async def get_results(self, group_id: int) -> list[ResultDto]:
        raise NotImplementedError
    
    
    @abstractmethod
    async def create_result(self, result: ResultCreateDto):
        raise NotImplementedError