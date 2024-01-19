from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from .config import DB_URL

engine = create_engine(DB_URL)
session_maker = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_session() -> Session:
    '''
    Creates and returns a db session. The session does
    not need to be closed manually, FastAPI will close
    it after response.
    '''
    
    session = session_maker()
    try:
        yield session
    finally:
        session.close()
