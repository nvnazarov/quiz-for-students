from sqlalchemy import select

from app.db.db import async_session_maker
from app.repos.quiz import QuizRepository
from app.models.quiz import Quiz
from app.dto.quiz import QuizCreateDto


class SqlQuizRepository(QuizRepository):
    async def create_test(self, quiz: QuizCreateDto) -> Quiz:    
        async with async_session_maker() as session: 
            db_test = Quiz(
                name=quiz.name,
                owner_id=quiz.owner_id,
                type="test",
                data=quiz.data)

            session.add(db_test)
            await session.commit()
            await session.refresh(db_test)

        return db_test


    async def create_quiz(self, quiz: QuizCreateDto) -> Quiz:        
        async with async_session_maker() as session: 
            db_quiz = Quiz(
                name=quiz.name,
                owner_id=quiz.owner_id,
                type="quiz",
                data=quiz.data)

            session.add(db_quiz)
            await session.commit()
            await session.refresh(db_quiz)

        return db_quiz


    async def update_quiz(self, owner_id: int, name: str, data: dict[str]):
        raise NotImplementedError


    async def delete_quiz(self, quiz_id: int):
        raise NotImplementedError