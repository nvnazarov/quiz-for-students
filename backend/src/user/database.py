from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from .config import DATABASE_URL

engine = create_engine(DATABASE_URL)
session_maker = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_session() -> Session:
    """Create and return a db session."""
    
    session = session_maker()
    try:
        yield session
    finally:
        session.close()
