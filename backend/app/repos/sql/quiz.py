from sqlalchemy import select
from sqlalchemy import update

from app.db.db import async_session_maker
from app.repos.quiz import QuizRepository
from app.models.quiz import Quiz
from app.dto.quiz import QuizCreateDto
from app.dto.quiz import QuizUpdateDto


class SqlQuizRepository(QuizRepository):
    async def create_test(self, test: QuizCreateDto) -> Quiz:    
        async with async_session_maker() as session:
            db_test = Quiz(name=test.name,
                           owner_id=test.owner_id,
                           type="test",
                           data=test.data)

            session.add(db_test)
            await session.commit()
            await session.refresh(db_test)

        return db_test


    async def create_quiz(self, quiz: QuizCreateDto) -> Quiz:        
        async with async_session_maker() as session:
            db_quiz = Quiz(name=quiz.name,
                           owner_id=quiz.owner_id,
                           type="quiz",
                           data=quiz.data)

            session.add(db_quiz)
            await session.commit()
            await session.refresh(db_quiz)

        return db_quiz


    async def update_test(self, user_id: int, quiz: QuizUpdateDto) -> Quiz:
        async with async_session_maker() as session:
            stmt = update(Quiz).where(Quiz.id == quiz.id).where(Quiz.owner_id == user_id).values(data=quiz.data).returning(Quiz)
            result = await session.execute(stmt)
            await session.commit()
        
        return result.fetchall()[0][0]
    
    
    async def update_quiz(self, user_id: int, quiz: QuizUpdateDto) -> Quiz:
        async with async_session_maker() as session:
            stmt = update(Quiz).where(Quiz.id == quiz.id).where(Quiz.owner_id == user_id).values(data=quiz.data).returning(Quiz)
            result = await session.execute(stmt)
            await session.commit()
            
        return result.fetchall()[0][0]


    async def find_all_quizzes_by_user_id(self, user_id: int) -> list[Quiz]:
        async with async_session_maker() as session:
            stmt = select(Quiz).where(Quiz.owner_id == user_id)
            result = await session.execute(stmt)
            return [row[0] for row in result]


    async def find_quiz_by_id(self, id: int) -> Quiz:
        async with async_session_maker() as session:
            return await session.get(Quiz, id)