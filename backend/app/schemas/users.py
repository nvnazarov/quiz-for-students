from pydantic import BaseModel


class UserCreateSchema(BaseModel):
    name: str
    email: str
    hashed_password: str
    
    
class UserRegisterSchema(BaseModel):
    name: str
    email: str
    password: str
    
    
class UserAuthenticateSchema(BaseModel):
    email: str
    password: str