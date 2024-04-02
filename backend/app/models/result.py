from datetime import datetime
from typing import Any

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from .base import Base


class Result(Base):   
    __tablename__ = "results"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"))
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"))
    date: Mapped[datetime] = mapped_column()
    scores: Mapped[dict[str, Any]] = mapped_column()