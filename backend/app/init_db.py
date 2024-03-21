import asyncio

from dotenv import load_dotenv

load_dotenv()

from app.db.db import engine
from app.models.models import Base, Group, Member, Quiz, Result, User, Image

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


asyncio.run(init_models())