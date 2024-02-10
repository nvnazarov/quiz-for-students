from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from . import schemas
from . import services
from .database import get_db_session
from .dependencies import get_register_data, get_login_data

router = APIRouter(prefix="/user", tags=[
    "user",
    ])


@router.post("/auth")
async def register_user(
        register_data: schemas.UserRegister = Depends(get_register_data),
        db: Session = Depends(get_db_session)) -> str:
    """Register user."""
    
    user = await services.register_user(register_data, db)
    token = await services.create_access_token_for_user(user)
    return token


@router.get("/auth")
async def authenticate_user(
        login_data: schemas.UserLogin = Depends(get_login_data),
        db: Session = Depends(get_db_session)) -> str:
    """Authenticate user."""
    
    token = await services.authenticate_user(login_data, db)
    return token
