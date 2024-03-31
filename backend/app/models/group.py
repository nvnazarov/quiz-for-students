from datetime import datetime

from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from .base import Base


class Group(Base):
    __tablename__ = "groups"
    __table_args__ = (UniqueConstraint("admin_id", "name", name="_admin_name_uc"),
                      )

    id: Mapped[int] = mapped_column(primary_key=True)
    admin_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(100))
    creation_date: Mapped[datetime] = mapped_column()