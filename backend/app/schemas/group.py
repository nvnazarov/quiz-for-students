from pydantic import BaseModel
from datetime import datetime


class GroupMemberSchema(BaseModel):
    name: str
    email: str
    
    
class GroupResultSchema(BaseModel):
    id: int
    quiz_name: str
    date: datetime


class GroupGetSchema(BaseModel):
    name: str
    admin_id: int
    members: list[GroupMemberSchema]


class GroupCreateSchema(BaseModel):
    admin_id: int
    name: str
    
    
class GroupInviteSchema(BaseModel):
    emails: list[str]