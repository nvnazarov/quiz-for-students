from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

# TODO: make an environment variable 
URI = "postgresql+asyncpg://postgres:postgres@localhost:5432/quiz-for-students"

engine = create_async_engine(URI)
async_session_maker = async_sessionmaker(bind=engine, expire_on_commit=False)


async def get_async_session():
    """Return a database session."""
    
    async with async_sessionmaker() as session:
        yield session