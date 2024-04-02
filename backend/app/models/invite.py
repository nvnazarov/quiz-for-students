from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy import UniqueConstraint

from .base import Base


class Invite(Base):
    __tablename__ = "invites"
    __table_args__ = (UniqueConstraint("user_id", "group_id", name="_invite_user_group_uc"),
                      )
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"))