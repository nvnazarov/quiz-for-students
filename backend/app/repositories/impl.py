from sqlalchemy import select
from datetime import date

from app.repositories.users import AbstractUserRepository
from app.repositories.quizzes import AbstractQuizzesRepository
from app.repositories.group import AbstractGroupRepository
from app.models.user import User
from app.models.quiz import Quiz
from app.models.group import Group
from app.models.member import Member
from app.db.db import async_session_maker
from app.schemas.users import UserCreateSchema
from app.schemas.quizzes import QuizCreateSchema, QuizUpdateSchema, QuizDeleteSchema
from app.schemas.group import GroupCreateSchema


class SQLAlchemyGroupRepository(AbstractGroupRepository):
    async def create_group(self, group: GroupCreateSchema) -> Group:
        async with async_session_maker() as session:
            db_group = Group(
                name=group.name,
                admin_id=group.admin_id,
                creation_date=date.today())
        
            session.add(db_group)
            await session.commit()
            await session.refresh(db_group)

        return db_group
    

    async def get_all_groups(self, user_id: int) -> list[Group]:
        async with async_session_maker() as session:
            stmt = select(Group).join(Member).where(Member.id == user_id)
            result = await session.execute(stmt)
            return [row[0] for row in result]
    
    
    async def get_all_owned_groups(self, admin_id: int) -> list[Group]:
        async with async_session_maker() as session:
            stmt = select(Group).where(Group.admin_id == admin_id)
            result = await session.execute(stmt)
            return [row[0] for row in result]
    
    
    async def get_group_members(self, group_id: int) -> list[Member]:
        async with async_session_maker() as session:
            stmt = select(Member).where(Member.group_id == group_id)
            result = await session.execute(stmt)
            return [row[0] for row in result]
        
        
    async def add_group_member(self, group_id: int, user_id: int) -> Member:
        async with async_session_maker() as session:
            db_member = Member(
                group_id=group_id,
                member_id=user_id
            )
        
            session.add(db_member)
            await session.commit()
            await session.refresh(db_member)
            
        return db_member
    

class SQLAlchemyQuizzesRepository(AbstractQuizzesRepository):
    async def create_quiz(self, quiz: QuizCreateSchema) -> Quiz:
        async with async_session_maker() as session:
            db_quiz = Quiz()


    async def update_quiz(self, quiz: QuizUpdateSchema):
        raise NotImplementedError


    async def delete_quiz(self, quiz: QuizDeleteSchema):
        raise NotImplementedError


class SQLAlchemyUserRepository(AbstractUserRepository):
    async def create_user(self, user: UserCreateSchema) -> User:        
        async with async_session_maker() as session: 
            db_user = User(
                name=user.name,
                email=user.email,
                hashed_password=user.hashed_password)
        
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)

        return db_user


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