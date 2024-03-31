from passlib.context import CryptContext
from fastapi import HTTPException
from fastapi import status
from sqlalchemy.exc import IntegrityError

from app.dto.user import to_user_dto
from app.dto.user import UserDto
from app.dto.user import UserAuthDto
from app.dto.user import UserCreateDto
from app.dto.user import UserRegisterDto
from app.dto.user import UserUpdateDto
from app.repos.user import UserRepository
from app.security.token import TokenContext


class UserService:
    _repo: UserRepository = None
    _token_context: TokenContext = None
    _password_context: CryptContext = None


    def __init__(self,
                 repo: UserRepository,
                 token_context: TokenContext,
                 password_context: CryptContext,
                 ):
        self._repo = repo
        self._token_context = token_context
        self._password_context = password_context


    async def auth_user(self, user: UserAuthDto) -> str:
        db_user = await self._repo.find_user_by_email(user.email)
        
        check_credentials_invalid = not db_user or not self._password_context.verify(user.password, db_user.hashed_password)
        if check_credentials_invalid:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Invalid email or password")
            
        if not db_user.active:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Account is suspended")
        
        encode_data = {
            "sub": str(db_user.id),
        }
        token = self._token_context.encode(encode_data)
        return token


    async def register_user(self, user: UserRegisterDto) -> str:
        if not self._is_valid_password(user.password):
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                "Invalid password")
        
        hashed_password = self._password_context.hash(user.password)
        user_create = UserCreateDto(name=user.name,
                                    email=user.email,
                                    hashed_password=hashed_password)
        try:
            db_user = await self._repo.create_user(user_create)
        except IntegrityError:
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "Email exists")
        
        encode_data = {
            "sub": str(db_user.id),
        }
        return self._token_context.encode(encode_data)


    async def get_user_by_id(self, id: int) -> UserDto:
        db_user = await self._repo.find_user_by_id(id)
        
        if not db_user:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                "User not found")
        
        return to_user_dto(db_user)


    async def update_user_by_id(self, id: int, data: UserUpdateDto) -> UserDto:
        try:
            db_user = await self._repo.change_user_name_by_id(id, data.name)
        except IndexError:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                "User not found")
        
        return to_user_dto(db_user)


    def get_user_id_from_token(self, token: str | None) -> int:
        try:
            payload = self._token_context.decode(token)
            id = int(payload["sub"])
        except:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return id


    def _is_valid_password(self, password: str) -> bool:
        password = password.lower()
        check_length = len(password) >= 8
        check_contains_digit = any([d in password for d in '0123456789'])
        check_contains_letter = any([s in password for s in 'abcdefghijklmnopqrstuvwxyz'])
        return check_length and check_contains_digit and check_contains_letter