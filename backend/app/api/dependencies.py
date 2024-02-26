from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.services.users import UsersService
from app.repositories.impl import SQLAlchemyUserRepository


def get_users_service() -> UsersService:
    return UsersService(SQLAlchemyUserRepository())


UsersServiceDep = Annotated[UsersService, Depends(get_users_service)]


async def get_current_user_id(
    users_service: UsersServiceDep,
    token: Annotated[str | None, Header()] = None,
) -> int:
    
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    try:
        user_id = users_service.get_user_id_from_token(token)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED) 
    
    return user_id