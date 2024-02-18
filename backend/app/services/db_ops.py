from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models import models
from app.schemes import schemes


async def create_user(
        data: schemes.DBUserCreate,
        db: Session) -> models.User:
    
    user = models.User(
        name=data.name,
        email=data.email,
        hashed_password=data.hashed_password)
    
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


async def get_user_by_email(
    email: str,
    db: Session) -> models.User | None:
    
    row = db.execute(select(models.User).filter_by(email = email)).first()
    if row:
        return row[0]
    else:
        return None