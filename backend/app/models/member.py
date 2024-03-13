from sqlalchemy import Column, Integer, ForeignKey

from .base import Base


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    member_id = Column(Integer, ForeignKey("users.id"))