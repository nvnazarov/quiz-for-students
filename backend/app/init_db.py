from app.models import base, group, member, quiz, result, user
from app.db.db import engine
import asyncio


async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(base.Base.metadata.drop_all)
        await conn.run_sync(base.Base.metadata.create_all)


asyncio.run(init_models())