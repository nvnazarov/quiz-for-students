from pydantic import BaseModel


class User(BaseModel):
    email: str
    hashed_password: str


class UserCreate(BaseModel):
    email: str
    password: str
    
    
class Credentials(BaseModel):
    email: str
    password: str
