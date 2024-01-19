from fastapi import APIRouter, Depends, HTTPException, status
from . import schemas
from .database import get_db_session
from . import services
from .dependencies import get_credentials
from sqlalchemy.orm import Session

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)


@router.post('/')
async def register_user_and_get_access_token(
    credentials: schemas.Credentials = Depends(get_credentials),
    db: Session = Depends(get_db_session)
):  
    user = await services.register_user(credentials, db)
    try:
        token = await services.create_access_token_for_user(user)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return token
