from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.group import GroupCreateSchema
from app.api.dependencies import get_current_user_id, GroupServiceDependency


router = APIRouter(
    prefix="/groups",
    tags=["groups"]
)


@router.post("/create/{name}")
async def create_group(
    name: str,
    group_service: GroupServiceDependency,
    admin_id: int = Depends(get_current_user_id)
):
    
    try:
        group_id = await group_service.create_group(GroupCreateSchema(name=name, admin_id=admin_id))
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="group exists")
        
    return {"id": group_id, "name": name}


@router.post("/join/{group_token}")
async def join_group(
    group_token: str,
    group_service: GroupServiceDependency,
    user_id: int = Depends(get_current_user_id)
):

    try:
        await group_service.join_group_by_token(user_id, group_token)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="group does not exist")
    
    
@router.get("/all")
async def get_all_groups(
    group_service: GroupServiceDependency,
    user_id: int = Depends(get_current_user_id)
):
    
    groups = await group_service.get_all_groups(user_id)
    
    return list(map(lambda g: {"id": g.id, "name": g.name}, groups))


@router.get("/my")
async def get_all_owned_groups(
    group_service: GroupServiceDependency,
    admin_id: int = Depends(get_current_user_id)
):
    
    groups = await group_service.get_all_owned_groups(admin_id)
    return list(map(lambda g: {"id": g.id, "name": g.name}, groups))


@router.get("/{id}/members")
async def get_group_members(
    group_service: GroupServiceDependency,
    id: int
):
    
    try:
        members = await group_service.get_members(id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="group does not exist")

    return members


@router.get("/{id}/history")
async def get_group_history(
    id: int,
    group_service: GroupServiceDependency
):
    
    try:
        history = await group_service.get_history(id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="group does not exist")

    return history


@router.get("/{id}/quiz")
async def get_group_current_quiz(id: int):
    return None


@router.post("/{id}/ban")
async def ban_user_in_group(id: int):
    return None