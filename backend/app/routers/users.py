from fastapi import APIRouter, Depends

from app.dependencies.auth import get_access_token
from app.services import user_crud, auth
from app.services.db import get_session
from app.schemes import schemes

router = APIRouter(
    prefix="/users"
)


# TODO: do activation via email
@router.get("/activate")
def activate_user():
    pass


@router.post("/create")
async def create_user(
        data: schemes.UserCreate,
        db = Depends(get_session)) -> str:
    
    return await user_crud.create(data, db)


@router.post("/delete")
def delete_user(
        token: str = Depends(get_access_token)):
    
    user_crud.delete(token)


@router.post("/login")
async def login(
        data: schemes.UserLogin,
        db = Depends(get_session)) -> str:
    
    return await auth.login_user(data, db)


@router.get("/me")
def get_current_user_data(
    token: str = Depends(get_access_token)):
    pass