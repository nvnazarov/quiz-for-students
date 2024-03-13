from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import DATE, JSONB

from .base import Base


class Result(Base):
    """Table with games results."""
    
    __tablename__ = "results"
    
    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    date = Column(DATE, nullable=False, default="current_date")
    scores = Column(JSONB, nullable=False)