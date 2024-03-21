import os

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

URI = os.getenv("QFS_DATABASE_URI")

engine = create_async_engine(URI)
async_session_maker = async_sessionmaker(bind=engine, expire_on_commit=False)