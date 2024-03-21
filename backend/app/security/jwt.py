from typing import Any, MutableMapping
from datetime import datetime, timedelta, timezone

from jose import jwt

from .token import TokenContext


class JwtContext(TokenContext):
    def __init__(self, key: str, algorithm: str):
        self.key = key
        self.algorithm = algorithm

    def encode(self, claims: MutableMapping[str, Any]) -> str:
        return jwt.encode(claims, self.key, self.algorithm)

    def decode(self, token) -> dict[str, Any]:
        return jwt.decode(token, self.key, self.algorithm)


def get_expire_time(minutes: int) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes)