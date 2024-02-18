from app.models import models
from jose.exceptions import JWTError
from .jwt import JWTContext, get_expire_time

# TODO: get key and algorithm from environment variables
_jwt_context = JWTContext(
    key="abc",
    algorithm="HS256"
)

EXPIRE_MINUTES = 60 * 24 * 7  # 1 week 


class UserDataError(JWTError):
    """User id is either not encoded or not an int."""
    
    pass


def create_token(user_id: int) -> str:
    """Get token with user id encoded in it."""
    
    return _jwt_context.encode(claims={
            'sub': user_id,
            'exp': get_expire_time(EXPIRE_MINUTES),
        })


def get_user_id(token: str) -> int:
    """Get user id encoded into access token."""
    
    payload = _jwt_context.decode(token)
    try:
        user_id = int(payload["sub"])
    except:
        raise UserDataError()
    
    return user_id


async def get_user(token: str) -> models.User:
    """Get user from access token."""
    
    user_id = get_user_id(token) 
    
    # TODO