from jose import jwt
from typing import Any, MutableMapping
from datetime import datetime, timedelta, timezone


class JWTContext():
    def __init__(self, key: str, algorithm: str):
        self.key = key
        self.algorithm = algorithm

    def encode(self, claims: MutableMapping[str, Any]) -> str:
        return jwt.encode(claims, self.key, self.algorithm)

    def decode(self, token) -> dict[str, Any]:
        return jwt.decode(token, self.key, self.algorithm)
    

def get_expire_time(minutes: int) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes)