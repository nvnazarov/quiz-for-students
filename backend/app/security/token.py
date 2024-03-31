from abc import ABC, abstractmethod
from typing import Any


class TokenContext(ABC):
    @abstractmethod
    def encode() -> str:
        raise NotImplemented


    @abstractmethod
    def decode(token: str) -> dict[str, Any]:
        raise NotImplemented