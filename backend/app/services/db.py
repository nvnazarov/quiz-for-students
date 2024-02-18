from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# TODO: make an environment variable 
URI = "postgresql://postgres:postgres@localhost:5432/postgres"

engine = create_engine(URI)
session_maker = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """Return a database session.
    
    Use with FastAPI Depends() function to
    automatically close session."""
    
    session = session_maker()
    try:
        yield session
    finally:
        session.close()