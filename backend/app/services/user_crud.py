from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.schemes import schemes
from .password import is_valid_password, hash_password
from .db_ops import create_user
from .token import create_token


async def create(data: schemes.UserCreate, db: Session) -> str:
    if not is_valid_password(data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid password")
    
    try:    
        user = await create_user(
            schemes.DBUserCreate(
                name=data.name,
                email=data.email,
                hashed_password=hash_password(data.password)),
            db)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="email exists")
    except:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    return create_token(user.id)


def delete(user_id: int):
    pass