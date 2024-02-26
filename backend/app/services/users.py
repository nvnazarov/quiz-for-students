from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

from app.schemas.users import UserCreateSchema, UserRegisterSchema, UserAuthenticateSchema
from app.repositories.users import AbstractUserRepository
from .util.jwt import JWTContext, get_expire_time


class UsersService:
    def __init__(self, repository: AbstractUserRepository):
        self.repository = repository
        
        # TODO: get from constructor, key and algo from env
        self.token_context = JWTContext(key="abc", algorithm="HS256")
        self.password_context = CryptContext(schemes=["bcrypt"])


    async def authenticate(self, user: UserAuthenticateSchema):
        """Authenticate user.

        Args:
            user (UserAuthenticateSchema): user credentials, i.e. email and password

        Raises:
            HTTPException (500): db error (service unavailable and etc.)
            HTTPException (400): email or password are invalid

        Returns:
            str: access token
        """
        
        try:
            db_user = await self.repository.get_user_by_email(user.email)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
        if not db_user or not self.password_context.verify(user.password, db_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="invalid email or password")
        
        return self.token_context.encode({
                "sub": str(db_user.id),
                "exp": get_expire_time(30)
            })
    
    
    async def register(self, user: UserRegisterSchema) -> str:
        """Register user.

        Args:
            user (UserCreateSchema): user credentials, i.e. email, password and name

        Raises:
            HTTPException (400): invalid password 
            HTTPException (400): email already exists
            HTTPException (500): db error (service unavailable and etc.)

        Returns:
            str: access token
        """
        
        if not self.is_valid_password(user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="invalid password")
    
        try:    
            db_user = await self.repository.create_user(UserCreateSchema(
                name=user.name,
                email=user.email,
                hashed_password=self.password_context.hash(user.password),
            ))
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="email exists")
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return self.token_context.encode({
                "sub": str(db_user.id),
                "exp": get_expire_time(30)
            })
        
        
    def get_user_id_from_token(self, token: str) -> int:
        return int(self.token_context.decode(token)["sub"])
        
        
    def is_valid_password(self, password: str) -> bool:
        """Check if password is strong security-wise.

        Args:
            password (str): password

        Returns:
            bool: is password strong (true if is)
        """
        
        password = password.lower()
        return len(password) >= 8 and any([d in password for d in '0123456789']) and \
            any([s in password for s in 'abcdefghijklmnopqrstuvwxyz'])
            
            
    async def get_user_profile(self, user_id: int) -> dict[str]:
        return {
            "ok": 200
        }