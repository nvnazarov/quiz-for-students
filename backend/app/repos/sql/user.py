from sqlalchemy import select
from sqlalchemy import update

from app.repos.user import UserRepository
from app.models.user import User
from app.dto.user import UserCreateDto
from app.db.db import async_session_maker


class SqlUserRepository(UserRepository):
    async def create_user(self, user: UserCreateDto) -> User:        
        async with async_session_maker() as session: 
            db_user = User(name=user.name,
                           email=user.email,
                           hashed_password=user.hashed_password)
            
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)
        
        return db_user
    
    
    async def change_user_name_by_id(self, user_id, name) -> User:
        async with async_session_maker() as session:
            stmt = update(User).where(User.id == user_id).values(name=name).returning(User)
            result = await session.execute(stmt)
            await session.commit()
        
        return result.fetchall()[0][0]


    async def find_user_by_email(self, email: str) -> User | None:
        async with async_session_maker() as session:
            stmt = select(User).filter_by(email=email)
            row = (await session.execute(stmt)).first()
            if row:
                return row[0]
            else:
                return None


    async def find_user_by_id(self, id: int) -> User | None:
        async with async_session_maker() as session:
            return await session.get(User, id)
    
    
    async def activate_user_by_id(self, id: int):
        async with async_session_maker() as session:
            stmt = update(User).where(User.id == id).values(active=True)
            await session.execute(stmt)
            await session.commit()