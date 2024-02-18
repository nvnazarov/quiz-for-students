from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    
    
class DBUserCreate(BaseModel):
    name: str
    email: str
    hashed_password: str
    
    
class DBUser(BaseModel):
    name: str
    email: str
    hashed_password: str


class UserLogin(BaseModel):
    email: str
    password: str