from typing import Any, MutableMapping
from datetime import datetime
from datetime import timedelta
from datetime import timezone

from jose import jwt

from app.security.token import TokenContext


class JwtContext(TokenContext):
    _key: str = None
    _algorithm: str = None
    _expire: timedelta = None
    
    
    def __init__(self, key: str, algorithm: str, expire: timedelta = None):
        self._key = key
        self._algorithm = algorithm
        self._expire = expire


    def encode(self, claims: MutableMapping[str, Any]) -> str:
        if self._expire:
            claims.update(exp=self._get_expire_time())
        return jwt.encode(claims, self._key, self._algorithm)


    def decode(self, token) -> dict[str, Any]:
        return jwt.decode(token, self._key, self._algorithm)


    def _get_expire_time(self) -> datetime:
        return datetime.now(timezone.utc) + self._expire