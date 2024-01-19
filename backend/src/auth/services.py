from fastapi import HTTPException, status
from jose import jwt, JWTError
from . import config
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select
from . import models
from . import schemas


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return config.PASS_CRYPT_CONTEXT.verify(plain_password, hashed_password)


def hash_password(plain_password: str) -> str:
    return config.PASS_CRYPT_CONTEXT.hash(plain_password)


async def create_access_token_for_user(user: models.User) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        claims={
            'sub': user.id,
            'exp': now + timedelta(minutes=config.JWT_EXPIRES_MINUTES),
        },
        key=config.JWT_SECRET,
        algorithm=config.JWT_ALGORITHM
    )
    
    
async def get_user_by_token(token: str) -> models.User:
    try:
        payload = jwt.decode(
            token=token,
            key=config.JWT_SECRET,
            algorithms=config.JWT_ALGORITHM
        )
        user_id = int(payload.get('sub'))
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail='Token is invalid')
    
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='Token user does not exist')

    return user


async def register_user(credentials: schemas.Credentials, db: Session) -> models.User:
    if await check_email_exists(credentials.email, db):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email exists')
    
    # Situation: what if two users will simultaneously create same-email accounts?
    # It is possible that both will pass the check_email_exists, thus
    # posing a threat to the application.
    
    user = models.User(email=credentials.email, hashed_password=hash_password(credentials.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


async def check_email_exists(email: str, db: Session) -> bool:
    return db.execute(select(models.User).filter_by(email = email)).first() is not None


async def get_user_by_id(id: int, db: Session) -> models.User | None:
    return db.get(models.User, id)
