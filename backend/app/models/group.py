from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import DATE

from .base import Base


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100), nullable=False)
    creation_date = Column(DATE, default="current_date")