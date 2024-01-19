from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base
from .database import engine

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    acitve = Column(Boolean, default=True)


Base.metadata.create_all(bind=engine)
