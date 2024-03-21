from abc import ABC, abstractmethod


class ResultRepository(ABC):
    @abstractmethod
    def get_results():
        raise NotImplementedError
    
    
    @abstractmethod
    def create_result():
        raise NotImplementedError