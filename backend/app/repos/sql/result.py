from sqlalchemy import select

from app.db.db import async_session_maker
from app.models.result import Result
from app.repos.result import ResultRepository
from app.dto.result import ResultDto, ResultCreateDto, to_result_dto


class SqlResultRepository(ResultRepository):
    async def get_results(self, group_id: int) -> list[ResultDto]:
        async with async_session_maker() as session:
            stmt = select(Result).where(Result.group_id == group_id)
            result = await session.execute(stmt)
            return [to_result_dto(row[0]) for row in result]
    

    async def create_result(self, result: ResultCreateDto):
        async with async_session_maker() as session:
            db_result = Result(group_id=result.group_id,
                               quiz_id=result.quiz_id,
                               date=result.date,
                               scores=result.scores)

            session.add(db_result)
            await session.commit()