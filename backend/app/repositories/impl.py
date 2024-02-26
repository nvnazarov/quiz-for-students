from .users import AbstractUserRepository
from app.models.user import User
from app.db.db import async_session_maker
from app.schemas.users import UserCreateSchema
from sqlalchemy import select


class SQLAlchemyUserRepository(AbstractUserRepository):
    async def create_user(self, user: UserCreateSchema) -> User:        
        async with async_session_maker() as session: 
            user = User(
                name=user.name,
                email=user.email,
                hashed_password=user.hashed_password)
        
            session.add(user)
            await session.commit()
            await session.refresh(user)

        return user


    async def get_user_by_email(self, email: str) -> User | None:
        async with async_session_maker() as session:
            query = select(User).filter_by(email=email)
            row = (await session.execute(query)).first()
            if row:
                return row[0]
            else:
                return None


    async def get_user_by_id(self, id: int) -> User | None:
        async with async_session_maker() as session:
            return await session.get(User, id)
        
        
    async def get_user_profile(self, id: int):
        raise NotImplementedError