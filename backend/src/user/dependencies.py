from typing import Annotated

from fastapi import Depends, Form
from fastapi.security import OAuth2AuthorizationCodeBearer

from . import schemas
from . import services


def get_register_data(name: str, email: str, password: str) -> schemas.UserRegister:
    """Extract register data from request query parameters."""
    
    return schemas.UserRegister(name=name, email=email, password=password)


def get_login_data(email: str, password: str) -> schemas.UserLogin:
    """Extract login data from request query parameters."""
    
    return schemas.UserLogin(email=email, password=password)


# def get_access_token(token: str = Depends(OAuth2AuthorizationCodeBearer)) -> str:
#     '''
#     Extracts token from request.
#     Currently works with Bearer.
#     '''
    
#     return token


# def get_current_user(token: str = Depends(get_access_token)):
#     '''
#     Extracts token from request and returns user assosiated with it.
#     '''
    
#     user = services.get_user_by_token(token)
#     return user


# def get_current_user_id(token: str = Depends(get_access_token)):
#     return services.get_user_by_token(token)
