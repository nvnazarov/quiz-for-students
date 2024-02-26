from pydantic import BaseModel


class GroupCreateSchema(BaseModel):
    name: str
    
    
class GroupInviteSchema(BaseModel):
    emails: list[str]