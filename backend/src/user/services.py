from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import config
from . import models
from . import schemas


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if plain password equals to the hashed."""
    
    return config.PASS_CRYPT_CONTEXT.verify(plain_password, hashed_password)


def hash_password(plain_password: str) -> str:
    """Hash plain password."""
    
    return config.PASS_CRYPT_CONTEXT.hash(plain_password)


def is_valid_password(password: str) -> bool:
    """Check if password is valid."""
    
    password = password.lower()
    return len(password) >= 8 and any([d in password for d in '0123456789']) and \
        any([s in password for s in 'abcdefghijklmnopqrstuvwxyz'])


async def create_access_token_for_user(user: models.User) -> str:
    """Create access token and encode user id into it."""
    
    now = datetime.now(timezone.utc)
    return jwt.encode(
        claims={
            'sub': user.id,
            'exp': now + timedelta(minutes=config.TOKEN_EXPIRE_MINUTES),
        },
        key=config.TOKEN_ENCODE_SECRET,
        algorithm=config.TOKEN_ENCODE_ALGORITHM)
    

def get_user_id_from_access_token(access_token: str) -> int:
    """Get user id encoded into access token.
    
    Raise HTTPException with status code 401 if token
    is invalid. 
    """
    
    try:
        payload = jwt.decode(
            token=access_token,
            key=config.TOKEN_ENCODE_SECRET,
            algorithms=config.TOKEN_ENCODE_ALGORITHM)
        user_id = int(payload.get('sub'))
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    return user_id
    
    
async def get_user_from_access_token(access_token: str) -> models.User:
    """Get user from access token."""
    
    user_id = get_user_id_from_access_token(access_token) 
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='')

    return user


async def register_user(register_data: schemas.UserRegister, db: Session) -> models.User:
    """Register user."""
    
    if not is_valid_password(register_data.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if await check_email_exists(register_data.email, db):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT)
    
    user = models.User(
        name=register_data.name,
        email=register_data.email,
        hashed_password=hash_password(register_data.password))
    
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


async def authenticate_user(login_data: schemas.UserLogin, db: Session) -> str:
    """Authenticate user."""
    
    user = await get_user_by_email(login_data.email, db)
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    
    return await create_access_token_for_user(user)


async def check_email_exists(email: str, db: Session) -> bool:
    return db.execute(select(models.User).filter_by(email = email)).first() is not None


async def get_user_by_id(id: int, db: Session) -> models.User | None:
    return db.get(models.User, id)


async def get_user_by_email(email: str, db: Session) -> models.User | None:
    row = db.execute(select(models.User).filter_by(email = email)).first()
    if row:
        return row[0]
    else:
        return None
