from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemes import schemes
from .db_ops import get_user_by_email
from .password import hash_password
from .token import create_token
from .password import verify_password


async def login_user(data: schemes.UserLogin, db: Session) -> str:
    try:
        user = await get_user_by_email(data.email, db)
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid email or password")
    
    return create_token(user.id)