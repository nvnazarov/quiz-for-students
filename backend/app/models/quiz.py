from typing import Any

from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from .base import Base


class Quiz(Base):
    __tablename__ = "quizzes"
    __table_args__ = (UniqueConstraint("owner_id", "name", name="_owner_name_uc"),
                      )

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(100))
    type: Mapped[str] = mapped_column(String(4))
    data: Mapped[dict[str, Any]] = mapped_column()