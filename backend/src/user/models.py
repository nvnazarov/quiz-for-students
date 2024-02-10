from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base

from .database import engine

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)


# TODO: alembic migrations
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
