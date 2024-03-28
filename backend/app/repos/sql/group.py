from datetime import date

from sqlalchemy import select
from sqlalchemy import update

from app.repos.group import GroupRepository
from app.db.db import async_session_maker
from app.dto.group import GroupCreateDto
from app.models.group import Group
from app.models.member import Member
from app.models.user import User
from app.dto.member import MemberDto
from app.dto.member import to_member_dto
from app.models.result import Result
from app.dto.result import ResultDto
from app.dto.result import to_result_dto


class SqlGroupRepository(GroupRepository):
    async def create_group(self, group: GroupCreateDto) -> Group:
        async with async_session_maker() as session:
            db_group = Group(
                name=group.name,
                admin_id=group.admin_id,
                date=date.today())

            session.add(db_group)
            await session.commit()
            await session.refresh(db_group)

        return db_group


    async def get_all_groups(self, user_id: int) -> list[Group]:
        async with async_session_maker() as session:
            stmt = select(Group).join(Member).where(Member.user_id == user_id).where(Member.banned == False)
            result = await session.execute(stmt)
            return [row[0] for row in result]


    async def get_all_owned_groups(self, admin_id: int) -> list[Group]:
        async with async_session_maker() as session:
            stmt = select(Group).where(Group.admin_id == admin_id)
            result = await session.execute(stmt)
            return [row[0] for row in result]


    async def get_group_members(self, group_id: int) -> list[MemberDto]:
        async with async_session_maker() as session:
            stmt = select(User, Member).join(Member).where(Member.group_id == group_id)
            result = await session.execute(stmt)
            return [to_member_dto(row[0], row[1]) for row in result]


    async def add_group_member(self, group_id: int, user_id: int) -> Member:
        async with async_session_maker() as session:
            db_member = Member(group_id=group_id,
                               user_id=user_id)

            session.add(db_member)
            await session.commit()
            await session.refresh(db_member)

        return db_member


    async def ban(self, group_id: int, user_id: int) -> Member:
        async with async_session_maker() as session:
            stmt = update(Member).where(Member.group_id == group_id).where(Member.user_id == user_id).values(banned=True).returning(Member)
            result = await session.execute(stmt)
            await session.commit()
        
        return result.fetchall()[0][0]


    async def unban(self, group_id: int, user_id: int) -> Member:
        async with async_session_maker() as session:
            stmt = update(Member).where(Member.group_id == group_id).where(Member.user_id == user_id).values(banned=False).returning(Member)
            result = await session.execute(stmt)
            await session.commit()
        
        return result.fetchall()[0][0]


    async def find_by_id(self, group_id: int) -> Group | None:
        async with async_session_maker() as session:
            return await session.get(Group, group_id)
    
    
    async def get_history(self, group_id: int) -> list[ResultDto]:
        async with async_session_maker() as session:
            stmt = select(Result).where(Result.group_id == group_id);
            result = await session.execute(stmt)
            return [to_result_dto(row[0]) for row in result]