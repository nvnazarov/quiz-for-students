from passlib.context import CryptContext
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.dto.user import to_user_dto
from app.dto.user import UserDto
from app.dto.user import UserAuthDto
from app.dto.user import UserCreateDto
from app.dto.user import UserBanDto
from app.dto.user import UserUnbanDto
from app.repos.user import UserRepository
from app.security.token import TokenContext


class UserService:
    _repo: UserRepository = None
    _token_context: TokenContext = None
    _password_context: CryptContext = None


    def __init__(self, repo: UserRepository,
                 token_context: TokenContext,
                 password_context: CryptContext,
                 ):
        self._repo = repo
        self._token_context = token_context
        self._password_context = password_context


    async def auth(self, user: UserAuthDto) -> str:
        db_user = await self._repo.find_by_email(user.email)
        
        if not db_user or not self._password_context.verify(user.password, db_user.hashed_password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="invalid email or password")
        
        token = self._token_context.encode({ "sub": str(db_user.id) })
        return token


    async def register(self, user: UserCreateDto) -> str:
        if not self._is_valid_password(user.password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="invalid password")
        
        try:
            user.password = self._password_context.hash(user.password)
            db_user = await self._repo.create(user)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                detail="email exists")
        
        return self._token_context.encode({ "sub": str(db_user.id) })


    async def get_user_by_id(self, user_id: int) -> UserDto:
        db_user = await self._repo.find_by_id(user_id)
        
        if not db_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        return to_user_dto(db_user)


    def get_user_id_from_token(self, token: str | None) -> int:
        try:
            payload = self._token_context.decode(token)
        except:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return int(payload["sub"])


    async def change_name(self, user_id: int, name: str) -> UserDto:
        db_user = await self._repo.change_name(user_id, name)
        
        if not db_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
        
        return to_user_dto(db_user)


    def _is_valid_password(self, password: str) -> bool:
        password = password.lower()
        return len(password) >= 8 and any([d in password for d in '0123456789']) and \
            any([s in password for s in 'abcdefghijklmnopqrstuvwxyz'])