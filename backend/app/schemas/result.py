from pydantic import BaseModel
from typing import Any


class DBResultCreateSchema(BaseModel):
    quiz_id: int
    result: Any