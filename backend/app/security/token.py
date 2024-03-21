from abc import ABC, abstractmethod


class TokenContext(ABC):
    @abstractmethod
    def encode():
        raise NotImplemented
    
    @abstractmethod
    def decode():
        raise NotImplemented