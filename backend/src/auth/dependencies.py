from fastapi import Depends, Form
from fastapi.security import OAuth2AuthorizationCodeBearer
from . import schemas
from .database import get_db_session
from typing import Annotated
from . import services


def get_access_token(token: str = Depends(OAuth2AuthorizationCodeBearer)) -> str:
    '''
    Extracts token from request.
    Currently works with Bearer.
    '''
    
    return token


def get_credentials(
    email: str,
    password: str,
) -> schemas.Credentials:
    '''
    Extracts user credentials from request.
    Currently credentials should be passed as query parameters.
    '''
    
    return schemas.Credentials(email=email, password=password)


def get_current_user(token: str = Depends(get_access_token)):
    '''
    Extracts token from request and returns user assosiated with it.
    '''
    
    user = services.get_user_by_token(token)
    return user
